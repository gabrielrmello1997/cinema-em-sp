"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { Session, CinemaInfo } from "@/lib/substack/programming";

const DAY_ORDER: Record<string, number> = {
  "SEGUNDA-FEIRA": 1,
  "TERÇA-FEIRA": 2,
  "QUARTA-FEIRA": 3,
  "QUINTA-FEIRA": 4,
  "SEXTA-FEIRA": 5,
  "SÁBADO": 6,
  "DOMINGO": 7,
};

const MONTHS: Record<number, string> = {
  1: "JANEIRO", 2: "FEVEREIRO", 3: "MARÇO", 4: "ABRIL",
  5: "MAIO", 6: "JUNHO", 7: "JULHO", 8: "AGOSTO",
  9: "SETEMBRO", 10: "OUTUBRO", 11: "NOVEMBRO", 12: "DEZEMBRO",
};

interface Props {
  sessions: Session[];
  allSessions: Session[];
  feedTitle: string;
  refreshedAt: string;
  cinemas: CinemaInfo[];
}

function parseDate(s: Session): Date | null {
  const m = s.day.match(/\((\d{2})\/(\d{2})\)/);
  if (!m) return null;
  const d = new Date(new Date().getFullYear(), Number(m[2]) - 1, Number(m[1]));
  if (d.getTime() > Date.now() + 90 * 24 * 60 * 60 * 1000) {
    d.setFullYear(d.getFullYear() - 1);
  }
  return d;
}

function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function SessionTable({ sessions, allSessions, feedTitle, refreshedAt, cinemas }: Props) {
  const [query, setQuery] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(-1);
  const [postOpen, setPostOpen] = useState(false);
  const [fullscreenPoster, setFullscreenPoster] = useState<string | null>(null);

  const postTitles = useMemo(() => {
    const set = new Set<string>();
    for (const s of allSessions) {
      if (s.feedTitle) set.add(s.feedTitle);
    }
    return Array.from(set);
  }, [allSessions]);

  const resolvedSessions = useMemo(() => {
    if (!selectedPost) return sessions;
    return allSessions.filter((s) => s.feedTitle === selectedPost);
  }, [selectedPost, sessions, allSessions]);

  const currentPostTitle = selectedPost || feedTitle;

  const daysOut = useMemo(() => {
    const unique = new Map<string, Session[]>();
    for (const s of resolvedSessions) {
      if (!unique.has(s.day)) unique.set(s.day, []);
      unique.get(s.day)!.push(s);
    }
    return Array.from(unique.entries())
      .sort(([a], [b]) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99))
      .map(([day, sess]) => {
        const d = parseDate(sess[0]);
        const today = todayDate();
        let year = today.getFullYear();
        if (d) {
          const test = new Date(year, d.getMonth(), d.getDate());
          if (test.getTime() > today.getTime() + 90 * 24 * 60 * 60 * 1000) year -= 1;
        }
        const dayDate = d ? new Date(year, d.getMonth(), d.getDate()) : null;
        return { day, sessions: sess, date: dayDate };
      });
  }, [resolvedSessions]);

  const dayTabs = useMemo(() => {
    const today = todayDate();
    return daysOut.map((d, i) => {
      if (!d.date) return { ...d, label: d.day, dayNum: 0, month: "", isToday: false, index: i };
      const diff = Math.round((d.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let label: string;
      if (diff === 0) label = "HOJE";
      else if (diff === 1) label = "AMANHÃ";
      else label = d.date.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase();
      return { ...d, label, dayNum: d.date.getDate(), month: MONTHS[d.date.getMonth()], isToday: diff === 0, index: i };
    });
  }, [daysOut]);

  const filtered = useMemo(() => {
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const q = normalize(query);
    const selectedDay = activeDayIndex >= 0 ? dayTabs[activeDayIndex]?.day : null;
    const result = resolvedSessions.filter((s) => {
      if (selectedDay && s.day !== selectedDay) return false;
      if (q) {
        const inTitle = normalize(s.title).includes(q);
        const inCinema = normalize(s.cinema).includes(q);
        const inDirector = normalize(s.director).includes(q);
        const inCountry = normalize(s.country).includes(q);
        if (!inTitle && !inCinema && !inDirector && !inCountry) return false;
      }
      if (cinemaFilter && s.cinema !== cinemaFilter) return false;
      if (timeFilter) {
        const h = parseInt(s.time);
        if (timeFilter === "manha" && h >= 12) return false;
        if (timeFilter === "tarde" && (h < 12 || h >= 18)) return false;
        if (timeFilter === "noite" && h < 18) return false;
      }
      return true;
    });
    const timeVal = (s: Session) => {
      const h = parseInt(s.time);
      const m = parseInt(s.time.split("h")[1] || "0");
      return h * 60 + m;
    };
    result.sort((a, b) => {
      const da = parseDate(a);
      const db = parseDate(b);
      if (da && db) {
        const dateDiff = da.getTime() - db.getTime();
        if (dateDiff !== 0) return dateDiff;
      }
      return timeVal(a) - timeVal(b);
    });
    return result;
  }, [resolvedSessions, query, cinemaFilter, timeFilter, activeDayIndex, dayTabs]);

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of filtered) {
      const gk = `${s.cinema}|${s.day}|${s.time}|${s.mostra}`;
      if (!map.has(gk)) map.set(gk, []);
      map.get(gk)!.push(s);
    }
    return Array.from(map.values());
  }, [filtered]);

  const cinemaMap = useMemo(() => {
    const map = new Map<string, CinemaInfo>();
    for (const c of cinemas) map.set(c.name, c);
    return map;
  }, [cinemas]);

  const availableCinemas = useMemo(() =>
    Array.from(new Set(resolvedSessions.map((s) => s.cinema))).sort(),
  [resolvedSessions]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const closeFullscreen = useCallback(() => setFullscreenPoster(null), []);

  useEffect(() => {
    if (!fullscreenPoster) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreenPoster, closeFullscreen]);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex">
        {/* ─── Sidebar ─── */}
        <aside className="w-[240px] shrink-0 border-r border-ink/15 pt-0 pb-0 px-[36px] sticky top-0 self-start min-h-screen">
          <div className="flex flex-col">
            <a href="/" className="mt-[-16px]">
              <img src="/assets/logo.svg" alt="Cinema em São Paulo" style={{ width: "30rem", height: "14.4rem" }} />
            </a>
            <div className="border-t border-dashed mb-10" style={{ borderColor: "#23211D", borderTopWidth: 1, strokeDasharray: "4 4" }} />
            <nav className="flex flex-col text-sm uppercase tracking-[0.1em]">
              <button onClick={() => scrollTo("agenda")} className="text-left text-ink/60 hover:text-accent transition-colors font-semibold mb-8">
                PROGRAMAÇÃO
              </button>
              <button onClick={() => scrollTo("about")} className="text-left text-ink/60 hover:text-accent transition-colors font-semibold mb-10">
                SOBRE
              </button>
            </nav>
            <div className="border-t border-dashed mb-10" style={{ borderColor: "#23211D", borderTopWidth: 1, strokeDasharray: "4 4" }} />
            <div className="flex flex-col text-sm uppercase tracking-[0.1em]">
              <a href="https://cinemaemsp.substack.com" target="_blank" rel="noopener noreferrer" className="text-ink/60 hover:text-accent transition-colors flex items-center gap-1.5 font-semibold mb-8">
                <img src="/assets/substack.svg" alt="" className="w-3.5 h-3.5" />
                SUBSTACK <img src="/assets/arrow-right-up.svg" alt="" className="w-3 h-3 inline" />
              </a>
              <a href="https://instagram.com/cinemaemsp" target="_blank" rel="noopener noreferrer" className="text-ink/60 hover:text-accent transition-colors flex items-center gap-1.5 font-semibold mb-8">
                <img src="/assets/contato-instagram.svg" alt="" className="w-3.5 h-3.5" />
                INSTAGRAM <img src="/assets/arrow-right-up.svg" alt="" className="w-3 h-3 inline" />
              </a>
              <a href="mailto:cinemaemsaopaulo@gmail.com" className="text-ink/60 hover:text-accent transition-colors flex items-center gap-1.5 font-semibold mb-10">
                <img src="/assets/email.svg" alt="" className="w-3.5 h-3.5" />
                E-MAIL <img src="/assets/arrow-right-up.svg" alt="" className="w-3 h-3 inline" />
              </a>
            </div>
            <div className="border-t border-dashed" style={{ borderColor: "#23211D", borderTopWidth: 1, strokeDasharray: "4 4" }} />
          </div>
        </aside>

        {/* ─── Main ─── */}
        <main className="flex-1 min-w-0">
          {/* ═══════ HERO ═══════ */}
          <div className="relative bg-ink text-bg" style={{ height: 317 }}>
            <div className="px-12 pt-18 pb-0 h-full flex flex-col justify-start">
              <h1 className="font-sora text-[54px] leading-none font-bold" style={{ color: "#F3F2ED" }}>
                Cinema em São Paulo
              </h1>
              <p className="mt-3 text-[20px]" style={{ color: "#F3F2ED", opacity: 0.7 }}>
                Acompanhe a programação de cineclubes<br />
                e cinemas pela cidade.
              </p>
            </div>

            {/* Post selector */}
            <div className="absolute" style={{ left: 972.5, top: 104.5 }}>
              <div className="relative">
                <button
                  onClick={() => setPostOpen(!postOpen)}
                  className="flex items-center gap-2 text-sm uppercase tracking-wider"
                  style={{
                    width: 403,
                    height: 55,
                    border: "1px solid #66625D",
                    padding: "0 20px",
                    color: "#F3F2ED",
                  }}
                >
                  <img src="/assets/calendar.svg" alt="" className="w-4 h-4 invert" />
                  <span className="flex-1 text-left truncate">{currentPostTitle}</span>
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {postOpen && (
                  <div className="absolute right-0 mt-1 bg-white text-ink shadow-md border border-ink/10 z-20 max-h-60 overflow-y-auto" style={{ width: 403 }}>
                    <button
                      onClick={() => { setSelectedPost(""); setPostOpen(false); setActiveDayIndex(-1); }}
                      className={`w-full text-left px-4 py-2 text-sm uppercase leading-tight ${!selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
                    >
                      {feedTitle}
                    </button>
                    {postTitles.map((t) => (
                      <button
                        key={t}
                        onClick={() => { setSelectedPost(t === selectedPost ? "" : t); setPostOpen(false); setActiveDayIndex(-1); }}
                        className={`w-full text-left px-4 py-2 text-sm leading-tight ${t === selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Poltronas */}
            <div className="absolute" style={{ left: 956, top: 271, width: 436, height: 74 }}>
              <svg width="436" height="74" viewBox="0 0 446 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="3" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="3" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="117" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="117" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="231" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="231" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="345" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="345" y="45" width="94" height="26" fill="#23211D"/>
              </svg>
            </div>
          </div>

          {/* ═══════ DAY TICKET ═══════ */}
          <div className="px-12 pt-[62px]">
            <div className="flex border" style={{ height: 94, borderColor: "#66625D" }}>
              {dayTabs.map((d) => (
                <button
                  key={d.index}
                  onClick={() => setActiveDayIndex(d.index === activeDayIndex ? -1 : d.index)}
                  className="flex-1 flex flex-col items-center justify-center transition-colors relative"
                  style={{
                    borderRight: "1px dashed #66625D",
                    background: activeDayIndex >= 0 && d.index === activeDayIndex ? "#B18A3A" : "#F3F2ED",
                  }}
                >
                  <span className="text-[11px] uppercase tracking-[0.15em] font-semibold"
                    style={{ color: activeDayIndex >= 0 && d.index === activeDayIndex ? "#FFFFFF" : "#23211D" }}>
                    {d.label}
                  </span>
                  <span className="text-[20px] font-bold" style={{
                    color: activeDayIndex >= 0 && d.index === activeDayIndex ? "#FFFFFF" : "#B18A3A"
                  }}>
                    {String(d.dayNum).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider" style={{
                    color: activeDayIndex >= 0 && d.index === activeDayIndex ? "#FFFFFF" : "#66625D"
                  }}>
                    {d.month}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ═══════ FILTERS ═══════ */}
          <div className="px-12 pt-[30px]">
            <div className="flex items-center gap-[6px]" style={{ height: 49 }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar filme, diretor, cinema..."
                className="px-3 text-sm bg-transparent text-ink placeholder:text-ink/30 outline-none"
                style={{ width: 377, height: 49, border: "1px solid #66625D" }}
              />
              <select
                value={cinemaFilter}
                onChange={(e) => setCinemaFilter(e.target.value)}
                className="px-3 text-sm bg-transparent text-ink outline-none appearance-none"
                style={{ width: 253, height: 49, border: "1px solid #66625D" }}
              >
                <option value="">Todos os cinemas</option>
                {availableCinemas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 text-sm bg-transparent text-ink outline-none appearance-none"
                style={{ width: 253, height: 49, border: "1px solid #66625D" }}
              >
                <option value="">Qualquer horário</option>
                <option value="manha">Manhã (até 12h)</option>
                <option value="tarde">Tarde (12h–18h)</option>
                <option value="noite">Noite (após 18h)</option>
              </select>
            </div>
          </div>

          {/* ═══════ AGENDA ═══════ */}
          <section id="agenda" className="px-12 pt-8 pb-16">
            {groups.length === 0 && (
              <p className="text-ink/40 text-[20px]">Nenhuma sessão para esta data.</p>
            )}
            <div className="relative">
              <div className="absolute top-0 bottom-0" style={{ left: 90, borderLeft: "1px dashed #23211D" }} />
              {groups.map((group, gi) => {
              const first = group[0];
              const dayInfo = dayTabs.find((d) => d.day === first.day);
              const prevGroup = gi > 0 ? groups[gi - 1] : null;
              const prevDay = prevGroup ? dayTabs.find((d) => d.day === prevGroup[0].day) : null;
              const isNewDay = prevDay && prevDay.day !== dayInfo?.day;

              return (
                <div key={gi}>
                  {gi > 0 && (
                    isNewDay ? (
                      <div className="border-t border-dashed -mx-12" style={{
                        borderColor: "#23211D",
                        strokeDasharray: "4 4",
                        marginTop: 48,
                        marginBottom: 48,
                      }} />
                    ) : (
                      <div className="border-t border-dashed" style={{
                        borderColor: "#23211D",
                        strokeDasharray: "4 4",
                        marginTop: 48,
                        marginBottom: 48,
                        marginLeft: 120,
                      }} />
                    )
                  )}

                  <div className="flex gap-0">
                    <div className={"w-[90px] shrink-0 pt-1 text-center " + (gi > 0 && !isNewDay ? "invisible" : "")}>
                      <div className="text-sm font-semibold uppercase tracking-wider leading-tight" style={{ color: "#23211D" }}>
                        {dayInfo?.label || ""}
                      </div>
                      <div className="text-4xl font-bold leading-tight mt-1" style={{ color: "#B18A3A" }}>
                        {dayInfo?.dayNum ?? ""}
                      </div>
                      <div className="text-xs uppercase tracking-wider mt-0.5" style={{ color: "#66625D" }}>
                        {dayInfo?.month || ""}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pl-[48px]">
                      <div className="flex" style={{ gap: '0px' }}>
                        <div className="w-[130px] shrink-0 pt-1">
                          <div className="text-3xl font-bold leading-tight" style={{ color: "#B18A3A" }}>{first.time}</div>
                        </div>

                        <div className="w-[360px] shrink-0 mt-2">
                          {first.mostra && (
                            <div className="text-base font-semibold uppercase mb-3 leading-snug" style={{ color: "#B18A3A" }}>
                              {first.mostra}
                            </div>
                          )}
                          {group.map((s, fi) => (
                            <div key={fi}>
                              {fi > 0 && <div className={"border-t border-dashed " + (group.length > 1 && group.some(s => s.poster) ? "my-20" : "my-6")} style={{ borderColor: "#23211D", strokeDasharray: "4 4" }} />}
                              <div className="font-bold leading-snug text-xl">
                                {s.title}{s.year > 0 ? ` (${s.year})` : ""}
                              </div>
                              <div className="text-[15px] mt-1 leading-snug" style={{ color: "#66625D" }}>
                                {s.country}{s.country && s.duration > 0 ? ", " : ""}{s.duration > 0 ? `${s.duration}'` : ""}
                              </div>
                              {s.director && (
                                <div className="text-[15px] mt-1 leading-snug" style={{ color: "#66625D" }}>
                                  Direção: {s.director}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="w-[400px] shrink-0 pt-1 pl-[56px]">
                          {group.map((s, fi) => (
                            s.poster ? (
                              <div key={fi} className={fi > 0 ? (group.length > 1 && group.some(s => s.poster) ? "mt-10" : "mt-20") : ""}>
                                <div className="w-[140px] h-[210px]" style={{ border: "1px solid rgba(35,33,29,0.3)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
                                  <img src={s.poster} alt={s.title} className="w-[140px] h-[210px] object-cover cursor-pointer" onClick={() => setFullscreenPoster(s.poster)} />
                                </div>
                              </div>
                            ) : null
                          ))}
                        </div>

                        <div className="w-[280px] shrink-0 pt-1 ml-[256px]">
                          <div className="font-bold text-[16px] uppercase leading-tight">{first.cinema}</div>
                          {(() => {
                            const info = cinemaMap.get(first.cinema);
                            return info?.address ? (
                              <div className="text-sm mt-1 leading-snug" style={{ color: "#66625D" }}>{info.address}</div>
                            ) : null;
                          })()}
                          {(() => {
                            const info = cinemaMap.get(first.cinema);
                            return info?.infoUrl ? (
                              <a href={info.infoUrl} target="_blank" rel="noopener noreferrer"
                                className="text-sm mt-2 inline-block" style={{ color: "#23211D" }}>
                                <span style={{ textDecoration: "underline" }}>Mais informações</span> <img src="/assets/arrow-right-up.svg" alt="" className="ml-1 w-2 h-2 inline"/>
                              </a>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </section>

          {/* ═══════ SOBRE ═══════ */}
          <section id="about" className="px-12 py-16 border-t border-dashed" style={{ borderColor: "#23211D", strokeDasharray: "4 4" }}>
            <div className="flex gap-0">
              <div className="w-[280px] shrink-0">
                <h2 className="text-sm uppercase tracking-[0.15em] font-semibold mb-8" style={{ color: "#66625D" }}>SOBRE</h2>
                <p className="text-2xl font-bold leading-tight font-sora">
                  Não perca<br />mais nenhuma<br />sessão.
                </p>
                <a
                  href="https://cinemaemsp.substack.com"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center mt-8 text-sm uppercase tracking-wider font-semibold"
                  style={{ width: 280, height: 57, border: "1px solid #B18A3A", color: "#B18A3A" }}
                >
                  ASSINAR NEWSLETTER <img src="/assets/arrow-right-up.svg" alt="" className="w-3 h-3 inline" />
                </a>
              </div>

              <div className="w-px mx-[31px]" style={{ borderLeft: "1px dashed #23211D" }} />

              <div className="flex-1 max-w-[600px] text-sm leading-relaxed space-y-4" style={{ color: "#23211D" }}>
                <p>Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.</p>
                <p>Organizamos e enviamos por email os horários e principais informações das sessões programadas por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.</p>
                <p>Focamos sempre nos filmes que já não estão mais na sua janela de exibição, mas são programados em sessões especiais.</p>
                <p>Nosso trabalho é feito manualmente a oito mãos.<br />Toda ajuda é bem vinda. :)</p>
              </div>
            </div>
          </section>

          {/* ═══════ CTA ═══════ */}
          <section className="relative bg-ink text-white overflow-hidden" style={{ height: 326 }}>
            <div className="px-12 py-14 flex gap-0 h-full">
              <div className="w-[280px] shrink-0">
                <h2 className="text-3xl font-bold leading-tight font-sora" style={{ color: "#F3F2ED" }}>
                  É programador<br />de cinema?
                </h2>
              </div>

              <div className="w-px mx-[31px] my-6" style={{ borderLeft: "1px dashed #F3F2ED" }} />

              <div className="flex-1 max-w-[500px] text-sm leading-relaxed space-y-2 pt-6" style={{ color: "#F3F2ED", opacity: 0.7 }}>
                <p>A ajuda dos programadores é central para mantermos o nosso trabalho.</p>
                <p>Se você é programador, curador ou membro de um cineclube, por favor, entre em contato conosco e compartilhe a sua programação via email:</p>
                <a href="mailto:cinemaemsaopaulo@gmail.com" className="inline-block mt-2 font-semibold text-base" style={{ color: "#B18A3A", textDecoration: "underline" }}>
                  cinemaemsaopaulo@gmail.com
                </a>
              </div>
            </div>

            <div className="absolute" style={{ left: 956, top: 289, width: 436, height: 74 }}>
              <svg width="436" height="74" viewBox="0 0 446 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="3" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="3" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="117" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="117" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="231" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="231" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="345" y="7" width="94" height="51" rx="8" fill="#F3F2ED"/>
                <rect x="345" y="45" width="94" height="26" fill="#23211D"/>
              </svg>
            </div>
          </section>

          {/* ═══════ FOOTER ═══════ */}
          <footer className="px-12 h-20 flex items-center justify-between text-xs" style={{ color: "#66625D" }}>
            <span>© 2026 Cinema em São Paulo. Todos os direitos reservados.</span>
            <span>Desenvolvido pela Moddulo.</span>
          </footer>
        </main>
      </div>

      {fullscreenPoster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 cursor-pointer"
          onClick={closeFullscreen}
        >
          <img
            src={fullscreenPoster}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain cursor-default"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}