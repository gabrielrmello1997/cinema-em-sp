"use client";

import { useMemo, useState, useRef } from "react";
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

function mondayOf(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
  return m;
}

function formatKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseKey(key: string): Date {
  const [y, m, dd] = key.split("-").map(Number);
  return new Date(y, m - 1, dd);
}

function todayAtMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateFromDay(dayStr: string): Date | null {
  const m = dayStr.match(/\((\d{2})\/(\d{2})\)/);
  if (!m) return null;
  return new Date(new Date().getFullYear(), Number(m[2]) - 1, Number(m[1]));
}

export default function SessionTable({ sessions, allSessions, feedTitle, refreshedAt, cinemas }: Props) {
  const [query, setQuery] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [weekKey, setWeekKey] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  const weeks = useMemo(() => {
    const seen = new Set<string>();
    const result: { monday: Date }[] = [];
    for (const s of allSessions) {
      const d = parseDate(s);
      if (!d) continue;
      const mon = mondayOf(d);
      const key = formatKey(mon);
      if (!seen.has(key)) {
        seen.add(key);
        result.push({ monday: mon });
      }
    }
    result.sort((a, b) => b.monday.getTime() - a.monday.getTime());
    return result;
  }, [allSessions]);

  const resolvedSessions = useMemo(() => {
    if (!weekKey) return sessions;
    const mon = parseKey(weekKey);
    return allSessions.filter((s) => {
      const d = parseDate(s);
      if (!d) return true;
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);
      d.setFullYear(mon.getFullYear());
      if (d < mon) d.setFullYear(mon.getFullYear() + 1);
      return d >= mon && d <= sun;
    });
  }, [weekKey, sessions, allSessions]);

  const daysOut = useMemo(() => {
    const unique = new Map<string, Session[]>();
    for (const s of resolvedSessions) {
      if (!unique.has(s.day)) unique.set(s.day, []);
      unique.get(s.day)!.push(s);
    }
    return Array.from(unique.entries())
      .sort(([a], [b]) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99))
      .map(([day, sess]) => {
        const d = dateFromDay(day);
        const today = todayAtMidnight();
        let year = today.getFullYear();
        if (d) {
          const test = new Date(year, d.getMonth(), d.getDate());
          if (test.getTime() > today.getTime() + 90 * 24 * 60 * 60 * 1000) year -= 1;
        }
        const dayDate = d ? new Date(year, d.getMonth(), d.getDate()) : null;
        return { day, sessions: sess, date: dayDate };
      });
  }, [resolvedSessions]);

  const today = todayAtMidnight();
  const currentMonday = useMemo(() => {
    if (!weekKey) {
      const d = parseDate(sessions[0]);
      return d ? mondayOf(d) : new Date();
    }
    return parseKey(weekKey);
  }, [weekKey, sessions]);

  const weekEnd = useMemo(() => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + 6);
    return d;
  }, [currentMonday]);

  const dayTabs = useMemo(() => {
    return daysOut.map((d, i) => {
      if (!d.date) return { ...d, label: d.day, dayNum: 0, month: "", isToday: false, index: i };
      const diff = d.date.getTime() - today.getTime();
      const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));
      let label: string;
      if (diffDays === 0) label = "HOJE";
      else if (diffDays === 1) label = "AMANHÃ";
      else label = d.date.toLocaleDateString("pt-BR", { weekday: "long" }).toUpperCase();
      return { ...d, label, dayNum: d.date.getDate(), month: MONTHS[d.date.getMonth()], isToday: diffDays === 0, index: i };
    });
  }, [daysOut, today]);

  const filteredSessions = useMemo(() => {
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const q = normalize(query);
    const selectedDay = dayTabs[activeDayIndex]?.day;

    return resolvedSessions.filter((s) => {
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
        const sHour = parseInt(s.time);
        if (timeFilter === "manha" && sHour >= 12) return false;
        if (timeFilter === "tarde" && (sHour < 12 || sHour >= 18)) return false;
        if (timeFilter === "noite" && sHour < 18) return false;
      }
      return true;
    });
  }, [resolvedSessions, query, cinemaFilter, timeFilter, activeDayIndex, dayTabs]);

  const groups = useMemo(() => {
    const map = new Map<string, Session[]>();
    for (const s of filteredSessions) {
      const gk = `${s.cinema}|${s.day}|${s.time}|${s.mostra}`;
      if (!map.has(gk)) map.set(gk, []);
      map.get(gk)!.push(s);
    }
    return Array.from(map.values());
  }, [filteredSessions]);

  const cinemaMap = useMemo(() => {
    const map = new Map<string, CinemaInfo>();
    for (const c of cinemas) map.set(c.name, c);
    return map;
  }, [cinemas]);

  const availableCinemas = useMemo(() => {
    return Array.from(new Set(resolvedSessions.map((s) => s.cinema))).sort();
  }, [resolvedSessions]);

  function formatWeekLabel(date: Date): string {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    return `${day} DE ${month}`;
  }

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const heroLabel = weekKey
    ? (() => {
        const m = weeks.find((w) => formatKey(w.monday) === weekKey);
        if (!m) return "";
        const end = new Date(m.monday);
        end.setDate(m.monday.getDate() + 6);
        return `${formatWeekLabel(m.monday)} A ${formatWeekLabel(end)}`;
      })()
    : `${formatWeekLabel(currentMonday)} A ${formatWeekLabel(weekEnd)}`;

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[220px] shrink-0 border-r border-ink/15 pt-12 pb-8 px-8 sticky top-0 self-start min-h-screen">
          <div className="flex flex-col gap-6">
            <a href="/">
              <img src="/assets/logo.svg" alt="Cinema em São Paulo" className="w-16 h-16" />
            </a>
            <div className="border-t border-dashed border-ink/20" />
            <nav className="flex flex-col gap-3 text-xs uppercase tracking-widest">
              <button onClick={() => scrollTo("agenda")} className="text-left text-ink/60 hover:text-accent transition-colors">
                PROGRAMAÇÃO
              </button>
              <button onClick={() => scrollTo("about")} className="text-left text-ink/60 hover:text-accent transition-colors">
                SOBRE
              </button>
            </nav>
            <div className="border-t border-dashed border-ink/20" />
            <div className="flex flex-col gap-3 text-xs uppercase tracking-widest">
              <a href="https://cinemaemsp.substack.com" target="_blank" rel="noopener noreferrer" className="text-ink/60 hover:text-accent transition-colors flex items-center gap-1.5">
                <img src="/assets/substack.svg" alt="" className="w-3.5 h-3.5" />
                SUBSTACK ↗
              </a>
              <a href="https://instagram.com/cinemaemsp" target="_blank" rel="noopener noreferrer" className="text-ink/60 hover:text-accent transition-colors flex items-center gap-1.5">
                <img src="/assets/contato-instagram.svg" alt="" className="w-3.5 h-3.5" />
                INSTAGRAM ↗
              </a>
              <a href="mailto:cinemaemsaopaulo@gmail.com" className="text-ink/60 hover:text-accent transition-colors flex items-center gap-1.5">
                <img src="/assets/email.svg" alt="" className="w-3.5 h-3.5" />
                E-MAIL ↗
              </a>
            </div>
            <div className="border-t border-dashed border-ink/20" />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Hero */}
          <div className="relative h-[318px] bg-ink text-bg px-12 flex items-center overflow-hidden">
            <div className="z-10">
              <h1 className="font-sora text-[54px] leading-none font-bold">
                Cinema em<br />São Paulo
              </h1>
              <p className="mt-3 text-bg/70 text-lg">
                Acompanhe a programação de cineclubes<br />
                e cinemas pela cidade.
              </p>
            </div>

            <div className="relative ml-auto z-10">
              <WeekPicker label={heroLabel} weeks={weeks} weekKey={weekKey} onWeekChange={(k) => setWeekKey(k === weekKey ? "" : k)} />
            </div>

            <div className="absolute -bottom-6 right-0 z-0 pointer-events-none">
              <svg width="300" height="80" viewBox="0 0 446 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-auto h-auto max-w-none">
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

          {/* Day tabs */}
          <div className="px-12 pt-2 pb-6">
            <div className="flex items-stretch h-[70px] border border-ink/20">
              {dayTabs.map((d) => (
                <button
                  key={d.index}
                  onClick={() => setActiveDayIndex(d.index)}
                  className={`flex-1 flex flex-col items-center justify-center border-r border-dashed border-ink/20 last:border-r-0 transition-colors ${
                    d.index === activeDayIndex
                      ? "bg-accent text-white"
                      : "bg-[#F3F2ED] text-ink/70 hover:bg-ink/5"
                  }`}
                >
                  <span className={`text-[11px] uppercase tracking-widest font-semibold ${d.index === activeDayIndex ? "text-white" : "text-ink/60"}`}>{d.label}</span>
                  <span className={`text-lg font-bold ${d.index === activeDayIndex ? "text-white" : "text-accent"}`}>
                    {String(d.dayNum).padStart(2, "0")}
                  </span>
                </button>
              ))}
              <label className="flex items-center gap-2 px-4 border-l-2 border-dashed border-ink/20 cursor-pointer bg-[#F3F2ED] text-ink/60 hover:bg-ink/5 transition-colors text-[11px] uppercase tracking-wider font-semibold relative overflow-hidden">
                <img src="/assets/calendar.svg" alt="" className="w-4 h-4" />
                ESCOLHER DATA
                <input type="date" onChange={(e) => {
                  const val = e.target.value;
                  if (!val) return;
                  const [y, m, dd] = val.split("-").map(Number);
                  const target = new Date(y, m - 1, dd);
                  const mon = mondayOf(target);
                  setWeekKey(formatKey(mon));
                  const key = formatKey(target);
                  const idx = dayTabs.findIndex((t) => t.date && formatKey(t.date) === key);
                  if (idx >= 0) setActiveDayIndex(idx);
                }} className="absolute inset-0 opacity-0 cursor-pointer" />
              </label>
            </div>
          </div>

          {/* Agenda */}
          <section id="agenda" className="px-12 pb-12">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center mt-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar filme, diretor, cinema..."
                className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-ink/20 bg-[#F3F2ED] text-ink placeholder:text-ink/30 outline-none focus:border-ink/40 transition-colors"
              />
              <select
                value={cinemaFilter}
                onChange={(e) => setCinemaFilter(e.target.value)}
                className="w-48 px-3 py-2 text-sm border border-ink/20 bg-[#F3F2ED] text-ink outline-none focus:border-ink/40 transition-colors appearance-none"
              >
                <option value="">Todos os cinemas</option>
                {availableCinemas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-44 px-3 py-2 text-sm border border-ink/20 bg-[#F3F2ED] text-ink outline-none focus:border-ink/40 transition-colors appearance-none"
              >
                <option value="">Qualquer horário</option>
                <option value="manha">Manhã (até 12h)</option>
                <option value="tarde">Tarde (12h–18h)</option>
                <option value="noite">Noite (após 18h)</option>
              </select>
            </div>

            <div className="border-t border-ink/10 mt-6" />

            {groups.length === 0 && (
              <p className="mt-10 text-ink/40 text-lg">Nenhuma sessão para esta data.</p>
            )}

            {groups.map((group, gi) => {
              const first = group[0];
              const dayInfo = dayTabs.find((d) => d.day === first.day);
              return (
                <div key={gi}>
                  {gi > 0 && <div className="border-t border-dashed border-ink/20 my-8" />}
                  <div className="flex gap-10">
                    <div className="w-16 shrink-0 pt-1 text-center">
                      <div className="text-sm font-semibold text-ink uppercase tracking-wider leading-tight">{dayInfo?.label || ""}</div>
                      <div className="text-4xl font-bold text-accent leading-tight mt-1">{dayInfo?.dayNum || ""}</div>
                      <div className="text-xs text-ink/50 uppercase tracking-wider mt-0.5">{dayInfo?.month || ""}</div>
                    </div>
                    <div className="w-px border-l border-dashed border-ink/20" />
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-6">
                        <div className="w-20 shrink-0 pt-1">
                          <div className="text-accent text-2xl font-bold">{first.time}</div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-6">
                          {group.map((s, fi) => (
                            <div key={fi}>
                              {fi > 0 && <div className="border-t border-dashed border-ink/10 my-4" />}
                              <div className="flex gap-4">
                                <div className="flex-1 min-w-0">
                                  {s.mostra && (
                                    <div className="text-accent text-sm font-semibold uppercase tracking-wider mb-1 leading-snug">{s.mostra}</div>
                                  )}
                                  <div className="font-semibold text-lg leading-snug">
                                    {s.title}{s.year > 0 ? ` (${s.year})` : ""}
                                  </div>
                                  {(s.country || s.duration > 0) && (
                                    <div className="text-ink/50 text-sm mt-0.5 leading-snug">
                                      {s.country}{s.country && s.duration > 0 ? ", " : ""}{s.duration > 0 ? `${s.duration}'` : ""}
                                    </div>
                                  )}
                                  {s.director && (s.country || s.duration > 0) && (
                                    <div className="text-ink/50 text-sm leading-snug">
                                      Direção: {s.director}
                                    </div>
                                  )}
                                  {s.director && !s.country && s.duration <= 0 && (
                                    <div className="text-ink/50 text-sm mt-0.5 leading-snug">
                                      Direção: {s.director}
                                    </div>
                                  )}
                                </div>
                                {s.poster && (
                                  <div className="w-16 shrink-0">
                                    <img src={s.poster} alt={s.title} className="w-full aspect-[2/3] object-fit" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="w-52 shrink-0 pt-1">
                          <div className="font-bold text-sm uppercase tracking-wider leading-tight">{first.cinema}</div>
                          {(() => {
                            const info = cinemaMap.get(first.cinema);
                            return (
                              <>
                                {info?.address && (
                                  <div className="text-ink/50 text-xs mt-0.5 leading-snug">{info.address}</div>
                                )}
                                {info?.infoUrl && (
                                  <a href={info.infoUrl} target="_blank" rel="noopener noreferrer" className="text-accent text-xs mt-1 inline-block hover:underline">
                                    Mais informações ↗
                                  </a>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* About */}
          <section id="about" className="px-12 py-12 border-t border-ink/10">
            <div className="flex gap-16">
              <div className="w-64 shrink-0">
                <h2 className="text-sm uppercase tracking-widest font-semibold text-ink/60 mb-6">SOBRE</h2>
                <p className="text-2xl font-bold leading-tight font-sora">
                  Não perca<br />mais nenhuma<br />sessão.
                </p>
                <a
                  href="https://cinemaemsp.substack.com"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-6 text-accent font-semibold border-b border-accent/30 hover:border-accent transition-colors text-sm uppercase tracking-wider"
                >
                  ASSINAR NEWSLETTER ↗
                </a>
              </div>
              <div className="flex-1 max-w-xl text-ink/80 text-sm leading-relaxed space-y-4">
                <p>Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.</p>
                <p>Organizamos e enviamos por email os horários e principais informações das sessões programadas por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.</p>
                <p>Focamos sempre nos filmes que já não estão mais na sua janela de exibição, mas são programados em sessões especiais.</p>
                <p>Nosso trabalho é feito manualmente a oito mãos.<br />Toda ajuda é bem vinda. :)</p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative bg-ink text-white px-12 py-14 overflow-hidden">
            <div className="flex gap-16">
              <div className="w-64 shrink-0">
                <h2 className="text-3xl font-bold leading-tight font-sora">
                  É programador<br />de cinema?
                </h2>
              </div>
              <div className="flex-1 max-w-xl text-bg/70 text-sm leading-relaxed space-y-2">
                <p>A ajuda dos programadores é central para mantermos o nosso trabalho.</p>
                <p>Se você é programador, curador ou membro de um cineclube, por favor, entre em contato conosco e compartilhe a sua programação via email:</p>
                <a href="mailto:cinemaemsaopaulo@gmail.com" className="text-accent font-semibold text-base hover:underline inline-block mt-2">
                  cinemaemsaopaulo@gmail.com
                </a>
              </div>
            </div>
            <div className="absolute -bottom-6 right-0 pointer-events-none">
              <svg viewBox="0 0 446 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-72 h-auto max-w-none">
                <rect x="3" y="7" width="94" height="44" rx="8" fill="#F3F2ED"/>
                <rect x="3" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="117" y="7" width="94" height="44" rx="8" fill="#F3F2ED"/>
                <rect x="117" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="231" y="7" width="94" height="44" rx="8" fill="#F3F2ED"/>
                <rect x="231" y="45" width="94" height="26" fill="#23211D"/>
                <rect x="345" y="7" width="94" height="44" rx="8" fill="#F3F2ED"/>
                <rect x="345" y="45" width="94" height="26" fill="#23211D"/>
              </svg>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-12 pb-8 pt-6 flex justify-between text-xs text-ink/40">
            <span>© 2026 Cinema em São Paulo. Todos os direitos reservados.</span>
            <span>Desenvolvido pela Moddulo.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

function WeekPicker({ label, weeks, weekKey, onWeekChange }: {
  label: string;
  weeks: { monday: Date }[];
  weekKey: string;
  onWeekChange: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);

  function wrapLabel(d: Date): string {
    const day = d.getDate();
    const months = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
    return `${day} DE ${months[d.getMonth()]}`;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 border border-white/30 text-sm uppercase tracking-wider text-bg/80 hover:bg-white/5 transition-colors"
      >
        <img src="/assets/calendar.svg" alt="" className="w-4 h-4 invert" />
        {label}
        <svg className="w-3 h-3 ml-1" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-64 bg-white text-ink shadow-md border border-ink/10 z-20 max-h-60 overflow-y-auto">
          <button
            onClick={() => { onWeekChange(""); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-sm uppercase tracking-wider ${!weekKey ? 'text-accent bg-accent/5' : 'text-ink/60 hover:bg-ink/5'}`}
          >
            ESTA SEMANA
          </button>
          {weeks.map((w) => {
            const mk = formatKey(w.monday);
            const end = new Date(w.monday);
            end.setDate(end.getDate() + 6);
            return (
              <button
                key={mk}
                onClick={() => { onWeekChange(mk); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm uppercase tracking-wider ${mk === weekKey ? 'text-accent bg-accent/5' : 'text-ink/60 hover:bg-ink/5'}`}
              >
                {formatLabel(w.monday)} — {formatLabel(end)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function formatLabel(d: Date): string {
  const day = d.getDate();
  const months = ["JANEIRO","FEVEREIRO","MARÇO","ABRIL","MAIO","JUNHO","JULHO","AGOSTO","SETEMBRO","OUTUBRO","NOVEMBRO","DEZEMBRO"];
  return `${day} DE ${months[d.getMonth()]}`;
}