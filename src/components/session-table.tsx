"use client";

import { useMemo, useState, useEffect, useCallback, Fragment, useRef } from "react";
import type { Session, CinemaInfo } from "@/lib/substack/programming";
import DaySelector from "@/components/day-selector";

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
  const postRef = useRef<HTMLDivElement>(null);

  const postTitles = useMemo(() => {
    const set = new Set<string>();
    for (const s of allSessions) {
      if (s.feedTitle) set.add(s.feedTitle);
    }
    return Array.from(set);
  }, [allSessions]);

  const olderPostTitles = useMemo(() =>
    postTitles.filter(t => t !== feedTitle),
  [postTitles, feedTitle]);

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
      else label = d.date.toLocaleDateString("pt-BR", { weekday: "long" }).replace("-feira", "").toUpperCase();
      return { ...d, label, dayNum: d.date.getDate(), month: MONTHS[d.date.getMonth() + 1], isToday: diff === 0, index: i };
    });
  }, [daysOut]);

  const daySelectorDays = useMemo(() =>
    dayTabs.map((d) => ({
      id: d.day,
      label: d.label,
      dateLabel: `${String(d.dayNum).padStart(2, "0")} ${d.month.slice(0, 3)}`,
    })),
  [dayTabs]);

  const selectedDayId = activeDayIndex >= 0 ? dayTabs[activeDayIndex]?.day ?? "" : "";

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

  const dayGroups = useMemo(() => {
    const result: { day: string; groups: Session[][] }[] = [];
    for (const g of groups) {
      const day = g[0].day;
      const last = result[result.length - 1];
      if (last && last.day === day) {
        last.groups.push(g);
      } else {
        result.push({ day, groups: [g] });
      }
    }
    return result;
  }, [groups]);

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
    if (!postOpen) return;
    const handler = (e: MouseEvent) => {
      if (postRef.current && !postRef.current.contains(e.target as Node)) {
        setPostOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [postOpen]);

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
        <aside className="w-[220px] shrink-0 border-r pt-0 pb-0 px-[36px] sticky top-0 self-start min-h-screen">
          <div className="flex flex-col">
            <a href="/" className="mt-[-16px]">
              <img src="/assets/logo.svg" alt="Cinema em São Paulo" style={{ width: "30rem", height: "14.4rem" }} />
            </a>
            <div className="dash-ink mb-10" />
            <nav className="flex flex-col text-sm uppercase">
              <button onClick={() => scrollTo("agenda")} className="text-left hover:text-accent transition-colors font-semibold mb-8 cursor-pointer">
                PROGRAMAÇÃO
              </button>
              <button onClick={() => scrollTo("about")} className="text-left hover:text-accent transition-colors font-semibold mb-10 cursor-pointer">
                SOBRE
              </button>
            </nav>
            <div className="dash-ink mb-10" />
            <div className="flex flex-col text-sm uppercase">
              <a href="https://cinemaemsp.substack.com" target="_blank" rel="noopener noreferrer" className="group hover:text-accent transition-colors flex items-center gap-2.5 font-semibold mb-8">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-[#23211D] group-hover:fill-[#A52323] transition-colors">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
                SUBSTACK <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
                  <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="https://instagram.com/cinemaemsp" target="_blank" rel="noopener noreferrer" className="group hover:text-accent transition-colors flex items-center gap-2.5 font-semibold mb-8">
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <g clipPath="url(#insta-clip)">
                    <path d="M1.167 5.833c0-1.237.492-2.424 1.367-3.3a4.667 4.667 0 013.3-1.366h9.334a4.667 4.667 0 013.3 1.367A4.667 4.667 0 0119.834 5.833v9.334a4.667 4.667 0 01-1.367 3.3 4.667 4.667 0 01-3.3 1.367H5.834a4.667 4.667 0 01-3.3-1.367 4.667 4.667 0 01-1.367-3.3V5.833z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"/>
                    <path d="M7 10.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"/>
                    <path d="M15.75 5.25v.012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"/>
                  </g>
                  <defs>
                    <clipPath id="insta-clip"><rect width="21" height="21" fill="white"/></clipPath>
                  </defs>
                </svg>
                INSTAGRAM <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
                  <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="mailto:cinemaemsaopaulo@gmail.com" className="group hover:text-accent transition-colors flex items-center gap-2.5 font-semibold mb-10">
                <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.733.822L.846 1.73v14.539l.888.909h19.533l.887-.909V1.73l-.887-.908H1.733zm.888 2.963V15.36h17.758V3.785L11.5 12.045 2.621 3.785zM18.97 2.64H4.03L11.5 9.59l7.47-6.95z" className="fill-[#23211D] group-hover:fill-[#A52323] transition-colors"/>
                </svg>
                E-MAIL <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
                  <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            <div className="dash-ink" />
          </div>
        </aside>

        {/* ─── Main ─── */}
        <main className="flex-1 min-w-0">
          {/* ═══════ HERO ═══════ */}
          <div className="relative bg-ink text-bg" style={{ height: 317 }}>
            <div className="px-12 pt-18 pb-0 h-full flex flex-col justify-start">
              <h1 className="font-sora text-[54px] leading-none font-bold mt-4" style={{ color: "#F3F2ED" }}>
                Cinema em São Paulo
              </h1>
              <p className="mt-10 text-[20px]" style={{ color: "#F3F2ED", opacity: 0.7 }}>
                Acompanhe a programação de cineclubes<br />
                e cinemas pela cidade.
              </p>
            </div>

            {/* Post selector */}
            <div className="absolute" style={{ right: 42, top: 104.5 }} ref={postRef}>
              <div className="relative">
                <button
                  onClick={() => setPostOpen(!postOpen)}
                  className="flex items-center gap-2 text-sm tracking-wider"
                  style={{
                    width: 403,
                    height: 55,
                    border: "1px solid #66625D",
                    padding: "0 20px",
                    color: "#F3F2ED",
                  }}
                >
                  <img src="/assets/calendar.svg" alt="" className="w-4 h-4 invert mr-2" />
                  <span className="flex-1 text-left truncate uppercase text-bold">{currentPostTitle}</span>
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {postOpen && (
                  <div className="absolute right-0 mt-1 bg-[#F3F2ED] text-ink shadow-md border border-ink/10 z-20 max-h-60 overflow-y-auto" style={{ width: 403 }}>
                    <div className="text-[11px] uppercase tracking-wider px-4 pt-4 pb-1">
                      Programação mais recente
                    </div>
                    <button
                      onClick={() => { setSelectedPost(""); setPostOpen(false); setActiveDayIndex(-1); }}
                      className={`w-full text-left px-4 py-2 text-sm uppercase leading-tight ${!selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
                    >
                      {feedTitle}
                    </button>
                    {olderPostTitles.length > 0 && (
                      <>
                        <div className="text-[11px] uppercase text-bold   tracking-wider px-4 pt-5 pb-1">
                          Programações anteriores
                        </div>
                        {olderPostTitles.map((t) => (
                          <button
                            key={t}
                            onClick={() => { setSelectedPost(t === selectedPost ? "" : t); setPostOpen(false); setActiveDayIndex(-1); }}
                            className={`w-full text-left px-4 py-2 text-sm leading-tight uppercase ${t === selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Poltronas */}
            <div className="absolute" style={{ right: 42, top: 271, width: 446, height: 74 }}>
              <svg width="446" height="74" viewBox="0 0 446 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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

          {/* ═══════ TOOLBAR: DAYS + SEARCH + FILTERS ═══════ */}
          <div className="px-12 pt-[30px]">
            <div className="flex items-center gap-4">
              <div className="mr-4">
                <DaySelector
                  days={daySelectorDays}
                  selectedDayId={selectedDayId}
                  onDayChange={(dayId) => {
                    if (dayId === selectedDayId) {
                      setActiveDayIndex(-1);
                    } else {
                      const idx = dayTabs.findIndex((d) => d.day === dayId);
                      setActiveDayIndex(idx);
                    }
                  }}
                />
              </div>
              <div className="flex-1 min-w-[220px] flex items-center" style={{ border: "1px solid #66625D", height: 49 }}>
                <svg className="w-4 h-4 ml-3 shrink-0" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="#23211D" strokeWidth="1.5"/>
                  <path d="M14 14L18 18" stroke="#23211D" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar filme, diretor, cinema..."
                  className="flex-1 px-2 text-sm bg-transparent text-ink placeholder:text-ink/30 outline-none"
                  style={{ height: 49 }}
                />
              </div>
              <div className="relative shrink-0" style={{ width: 210 }}>
                <select
                  value={cinemaFilter}
                  onChange={(e) => setCinemaFilter(e.target.value)}
                  className="w-full px-3 pr-8 text-sm bg-transparent text-ink outline-none appearance-none cursor-pointer"
                  style={{ height: 49, border: "1px solid #66625D" }}
                >
                  <option value="">Todos os cinemas</option>
                  {availableCinemas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, pointerEvents: 'none' }} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="relative shrink-0" style={{ width: 180 }}>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="w-full px-3 pr-8 text-sm bg-transparent text-ink outline-none appearance-none cursor-pointer"
                  style={{ height: 49, border: "1px solid #66625D" }}
                >
                  <option value="">Qualquer horário</option>
                  <option value="manha">Manhã (até 12h)</option>
                  <option value="tarde">Tarde (12h–18h)</option>
                  <option value="noite">Noite (após 18h)</option>
                </select>
                <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, pointerEvents: 'none' }} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* ═══════ AGENDA ═══════ */}
          <section id="agenda" className="px-12 pt-8 pb-16">
            {groups.length === 0 && (
              <p className="text-ink/40 text-[20px]">Nenhuma sessão para esta data.</p>
            )}
            <div className="relative">
              <div className="absolute top-0 bottom-0" style={{ left: 90, borderLeft: "1px dashed #23211D" }} />
              {dayGroups.map((dg, dgi) => {
              const dayInfo = dayTabs.find((d) => d.day === dg.day);
              return (
                <div key={dg.day}>
                  {dgi > 0 && (
                    <div className="dash-ink -mx-12" style={{
                      marginTop: 48,
                      marginBottom: 48,
                    }} />
                  )}
                  <div className="flex gap-0">
                    <div className="w-[90px] shrink-0 pr-8 text-center sticky top-6 self-start">
                      <div className="text-[18px] font-semibold uppercase leading-tight " style={{ color: "#23211D" }}>
                        {dayInfo?.label || ""}
                      </div>
                      <div className="text-[56px] font-bold leading-tight mt-1" style={{ color: "#A52323" }}>
                        {dayInfo?.dayNum ?? ""}
                      </div>
                      <div className="text-[18px] font-semibold uppercase mt-0.5" style={{ color: "#23211D" }}>
                        {dayInfo?.month || ""}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pl-[48px]">
                      {dg.groups.map((group, gi) => {
                      const first = group[0];
                      return (
                        <Fragment key={gi}>
                          {gi > 0 && (
                            <div className="dash-ink" style={{
                              marginTop: 48,
                              marginBottom: 48,
                              marginLeft: 0,
                            }} />
                          )}
                          <div className="flex" style={{ gap: '0px' }}>
                            <div className="w-[130px] shrink-0 pt-1">
                              <div className="text-[26px] font-bold leading-tight" style={{ color: "#A52323" }}>{first.time}</div>
                            </div>

                              <div className="flex-1 min-w-0 pt-1">
                              <div className="grid grid-cols-[minmax(auto,400px)_150px] gap-x-12 gap-y-6">
                                {group.map((s, fi) => (
                                  <Fragment key={fi}>
                                    {fi > 0 && (
                                      <div className="dash-ink col-span-2" />
                                    )}
                                    <div>
                                      {fi === 0 && first.mostra && (
                                        <div className="text-base font-semibold uppercase mb-2 leading-snug break-words max-w-[400px]" style={{ color: "#A52323" }}>
                                          {first.mostra}
                                        </div>
                                      )}
                                      <div className="font-bold leading-snug text-xl">
                                        {s.title}{s.year > 0 ? ` (${s.year})` : ""}
                                      </div>
                                      {s.originalTitle && s.originalTitle !== s.title &&
                                        !s.originalTitle.toLowerCase().includes(s.title.toLowerCase()) && (
                                        <div className="text-[15px] italic mt-0.5 leading-snug" style={{ color: "#66625D" }}>
                                          {s.originalTitle}
                                        </div>
                                      )}
                                      {s.director && (
                                        <div className="text-[15px] mt-4 leading-snug">
                                          Direção: {s.director}
                                        </div>
                                      )}
                                      <div className="text-[15px] mt-1 leading-snug">
                                        {s.country}{s.country && s.duration > 0 ? ", " : ""}{s.duration > 0 ? `${s.duration}'` : ""}
                                      </div>
                                    </div>
                                    <div>
                                      {s.poster && (
                                        <div className="w-[150px] h-[220px]" style={{ border: "1px solid rgba(35,33,29,0.3)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
                                          <img src={s.poster} alt={s.title} className="w-[150px] h-[220px] object-cover cursor-pointer" onClick={() => setFullscreenPoster(s.poster)} />
                                        </div>
                                      )}
                                    </div>
                                  </Fragment>
                                ))}
                              </div>
                            </div>

                            <div className="w-[300px] shrink-0 pt-1 ml-[48px] mr-20">
                              <div className="font-bold text-[20px] uppercase leading-tight">{first.cinema}</div>
                              {(() => {
                                const info = cinemaMap.get(first.cinema);
                                return info?.address ? (
                                  <div className="text-sm mt-1 leading-snug">{info.address}</div>
                                ) : null;
                              })()}
                              {(() => {
                                const info = cinemaMap.get(first.cinema);
                                return info?.infoUrl ? (
                                  <a href={info.infoUrl} target="_blank" rel="noopener noreferrer"
                                    className="group text-sm mt-2 inline-block text-[#23211D] hover:text-accent transition-colors">
                                    <span style={{ textDecoration: "underline" }}>Mais informações</span> <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="ml-1 w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
                                      <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </a>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </Fragment>
                      );
                    })}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </section>

          {/* ═══════ SOBRE ═══════ */}
          <div className="dash-ink mx-12" />
          <section id="about" className="px-12 py-12">
            <h2 className="text-[18px] uppercase font-semibold mb-8" style={{ color: "#A52323" }}>SOBRE</h2>
            <div className="flex gap-0">
              <div className="w-[480px] shrink-0">
                <p className="text-[54px] font-bold leading-tight font-sora">
                  Não perca<br />mais nenhuma<br />sessão.
                </p>
                <div className="ticket-shape mt-8 inline-block group" style={{ background: "#A52323", padding: "1px" }}>
                  <div className="ticket-shape-inner bg-[#A52323] group-hover:bg-[#F3F2ED] transition-colors">
                    <a
                      href="https://cinemaemsp.substack.com"
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center text-[18px] uppercase font-semibold text-[#F3F2ED] group-hover:text-[#A52323] transition-colors"
                      style={{ width: 260, height: 50 }}
                    >
                      ASSINAR NEWSLETTER <svg width="12" height="12" viewBox="0 0 8 8" fill="none" className="inline w-3 h-3 ml-2">
                        <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#F3F2ED] group-hover:stroke-[#A52323] transition-colors"/>
                        <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#F3F2ED] group-hover:stroke-[#A52323] transition-colors"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="dash-ink-v mx-[48px]" />

              <div className="flex-1 max-w-[480px] text-[18px] leading-relaxed space-y-4" style={{ color: "#23211D" }}>
                <p>Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.</p>
                <p>Organizamos e enviamos por email os horários e principais informações das sessões programadas por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.</p>
                <p>Focamos sempre nos filmes que já não estão mais na sua janela de exibição, mas são programados em sessões especiais.</p>
                <p>Nosso trabalho é feito manualmente a oito mãos.<br /><b>Toda ajuda é bem vinda</b> :)</p>
              </div>
            </div>
          </section>

          {/* ═══════ CTA ═══════ */}
          <section className="relative bg-ink text-white overflow-visible" style={{ height: 306 }}>
            <div className="px-12 py-12 flex gap-0 h-full">
              <div className="w-[340px] shrink-0">
                <h2 className="text-[40px] font-bold leading-[64px] font-sora" style={{ color: "#F3F2ED" }}>
                  É programador<br />de cinema?
                </h2>
              </div>

              <div className="w-px mx-[60px]" style={{ backgroundImage: "repeating-linear-gradient(to bottom, #F3F2ED 0, #F3F2ED 4px, transparent 4px, transparent 6px)" }} />

              <div className="flex-1 max-w-[600px] text-[18px] leading-relaxed space-y-2 pt-3" style={{ color: "#F3F2ED", opacity: 0.7 }}>
                <p>A ajuda dos programadores é central para mantermos o nosso trabalho.</p>
                <p>Se você é programador, curador ou membro de um cineclube, por favor, entre em contato conosco e compartilhe a sua programação via email:
                <a href="mailto:cinemaemsaopaulo@gmail.com" className="inline-block font-semibold underline text-[#F3F2ED] hover:text-[#A52323] transition-colors">
                  cinemaemsaopaulo@gmail.com
                </a>.</p>
              </div>
            </div>

            <div className="absolute" style={{ right: 42, top: 261, width: 446, height: 74 }}>
              <svg width="446" height="74" viewBox="0 0 446 74" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
          <footer className="px-12 pt-8 h-22 flex items-center justify-between text-xs">
            <span>© 2026 Cinema em São Paulo. Todos os direitos reservados.</span>
            <span>Desenvolvido pela <b>Moddulo</b>.</span>
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