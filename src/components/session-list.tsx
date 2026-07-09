"use client";

import { useMemo, useState } from "react";
import type { Session, CinemaInfo } from "@/lib/substack/programming";
import Hero from "@/components/hero";
import DayPicker, { type DayTab } from "@/components/day-picker";
import FilmCard from "@/components/film-card";
import About from "@/components/about";
import FooterCta from "@/components/footer-cta";

// ─── Helpers ────────────────────────────────────────────────────────────────

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
  m.setHours(0, 0, 0, 0);
  return m;
}

function formatDDMM(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}`;
}

function formatKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseKey(key: string): Date {
  const [y, m, dd] = key.split("-").map(Number);
  return new Date(y, m - 1, dd);
}

function sessionsInWeek(sessions: Session[], monday: Date): Session[] {
  const mon = new Date(monday);
  mon.setHours(0, 0, 0, 0);
  const sun = new Date(monday);
  sun.setDate(mon.getDate() + 6);
  sun.setHours(23, 59, 59, 999);

  return sessions.filter((s) => {
    const d = parseDate(s);
    if (!d) return true;
    d.setHours(12, 0, 0, 0);
    return d >= mon && d <= sun;
  });
}

// Normalize string for search
function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Get day key "DD/MM" from session
function sessionDayKey(s: Session): string {
  const m = s.day.match(/\((\d{2}\/\d{2})\)/);
  return m ? m[1] : "";
}

// Parse time like "19h30" → sortable number 1930
function parseTime(t: string): number {
  const m = t.match(/(\d+)h(\d*)/);
  if (!m) return 0;
  return Number(m[1]) * 100 + (m[2] ? Number(m[2]) : 0);
}

const MONTH_LABELS = [
  "JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO",
];

const DAY_PT: Record<number, string> = {
  0: "DOMINGO",
  1: "SEGUNDA",
  2: "TERÇA",
  3: "QUARTA",
  4: "QUINTA",
  5: "SEXTA",
  6: "SÁBADO",
};

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  sessions: Session[];
  allSessions: Session[];
  feedTitle: string;
  refreshedAt: string;
  cinemas: CinemaInfo[];
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function SessionList({ sessions, allSessions, feedTitle, refreshedAt, cinemas }: Props) {
  const [query, setQuery] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [weekKey, setWeekKey] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // ── Build cinema lookup map
  const cinemaMap = useMemo(() => {
    const map = new Map<string, CinemaInfo>();
    for (const c of cinemas) {
      map.set(c.name, c);
    }
    return map;
  }, [cinemas]);

  // ── Derive all available weeks from allSessions
  const weeks = useMemo(() => {
    const seen = new Set<string>();
    const result: Array<{ label: string; monday: Date; key: string }> = [];

    for (const s of allSessions) {
      const d = parseDate(s);
      if (!d) continue;
      const mon = mondayOf(d);
      const key = formatKey(mon);
      if (!seen.has(key)) {
        seen.add(key);
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        result.push({
          label: `${formatDDMM(mon)} a ${formatDDMM(sun)}`,
          monday: mon,
          key,
        });
      }
    }

    result.sort((a, b) => b.monday.getTime() - a.monday.getTime());
    return result;
  }, [allSessions]);

  // ── Resolve sessions for selected week
  const resolvedSessions = useMemo(() => {
    if (!weekKey) return sessions;
    const mon = parseKey(weekKey);
    return sessionsInWeek(allSessions, mon);
  }, [weekKey, sessions, allSessions]);

  // ── Current week label for hero
  const currentWeekLabel = useMemo(() => {
    const dates = resolvedSessions
      .map(parseDate)
      .filter(Boolean) as Date[];
    if (!dates.length) return "SEMANA ATUAL";
    dates.sort((a, b) => a.getTime() - b.getTime());
    const first = dates[0];
    const last = dates[dates.length - 1];
    const mon = mondayOf(first);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return `SEMANA DE ${formatDDMM(mon)} A ${formatDDMM(sun)}`;
  }, [resolvedSessions]);

  // ── Build sorted list of unique days in this week for DayPicker
  const dayTabs = useMemo((): DayTab[] => {
    const seen = new Map<string, Date>();
    for (const s of resolvedSessions) {
      const d = parseDate(s);
      if (!d) continue;
      const key = formatDDMM(d);
      if (!seen.has(key)) seen.set(key, d);
    }
    return Array.from(seen.entries())
      .map(([dayKey, date]) => ({ dayKey, date }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [resolvedSessions]);

  // ── Cinema list derived from resolved sessions
  const cinemaOptions = useMemo(() => {
    const unique = new Set(resolvedSessions.map((s) => s.cinema));
    return Array.from(unique).sort();
  }, [resolvedSessions]);

  // ── Apply filters
  const filtered = useMemo(() => {
    const q = normalize(query);

    return resolvedSessions.filter((s) => {
      // Day tab filter
      if (selectedDay && sessionDayKey(s) !== selectedDay) return false;
      // Cinema filter
      if (cinemaFilter && s.cinema !== cinemaFilter) return false;
      // Time filter
      if (timeFilter) {
        const t = parseTime(s.time);
        if (timeFilter === "manha" && t >= 1200) return false;
        if (timeFilter === "tarde" && (t < 1200 || t >= 1800)) return false;
        if (timeFilter === "noite" && t < 1800) return false;
      }
      // Text search
      if (q) {
        const inTitle = normalize(s.title).includes(q);
        const inCinema = normalize(s.cinema).includes(q);
        const inDirector = normalize(s.director).includes(q);
        const inMostra = normalize(s.mostra).includes(q);
        if (!inTitle && !inCinema && !inDirector && !inMostra) return false;
      }
      return true;
    });
  }, [resolvedSessions, selectedDay, cinemaFilter, timeFilter, query]);

  // ── Group by day then by time
  const grouped = useMemo(() => {
    const byDay = new Map<string, { date: Date; byTime: Map<string, Session[]> }>();

    for (const s of filtered) {
      const dayKey = sessionDayKey(s);
      const date = parseDate(s) ?? new Date();

      if (!byDay.has(dayKey)) {
        byDay.set(dayKey, { date, byTime: new Map() });
      }
      const dayGroup = byDay.get(dayKey)!;
      if (!dayGroup.byTime.has(s.time)) {
        dayGroup.byTime.set(s.time, []);
      }
      dayGroup.byTime.get(s.time)!.push(s);
    }

    // Sort days chronologically
    return Array.from(byDay.entries())
      .sort(([, a], [, b]) => a.date.getTime() - b.date.getTime())
      .map(([dayKey, { date, byTime }]) => ({
        dayKey,
        date,
        timeGroups: Array.from(byTime.entries())
          .sort(([a], [b]) => parseTime(a) - parseTime(b))
          .map(([time, sessionList]) => ({ time, sessions: sessionList })),
      }));
  }, [filtered]);

  // ─── Helpers for date header
  function formatDateHeader(date: Date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday =
      date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    const isTomorrow =
      date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth();

    const prefix = isToday ? "HOJE" : isTomorrow ? "AMANHÃ" : null;
    const dayName = DAY_PT[date.getDay()] ?? "";

    return { prefix: prefix ?? dayName, dateNum: date.getDate(), month: MONTH_LABELS[date.getMonth()] };
  }

  return (
    <>
      {/* Hero */}
      <Hero
        weeks={weeks}
        selectedWeekKey={weekKey}
        onWeekChange={(key) => { setWeekKey(key); setSelectedDay(null); }}
        currentWeekLabel={currentWeekLabel}
      />

      {/* Day picker (ticket-style) */}
      <div className="border-b border-border bg-background">
        <DayPicker
          days={dayTabs}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      </div>

      {/* Filters bar */}
      <div className="bg-background border-b border-border px-12 py-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filme, diretor, cinema..."
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-gold"
            style={{ fontSize: "14px" }}
            aria-label="Buscar sessões"
          />
        </div>

        {/* Cinema filter */}
        <div className="relative">
          <select
            value={cinemaFilter}
            onChange={(e) => setCinemaFilter(e.target.value)}
            className="appearance-none bg-background border border-border rounded pl-3 pr-8 py-2 font-sans text-foreground focus:outline-none focus:border-gold cursor-pointer"
            style={{ fontSize: "14px", minWidth: "160px" }}
            aria-label="Filtrar por cinema"
          >
            <option value="">Todos os cinemas</option>
            {cinemaOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Time filter */}
        <div className="relative">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="appearance-none bg-background border border-border rounded pl-3 pr-8 py-2 font-sans text-foreground focus:outline-none focus:border-gold cursor-pointer"
            style={{ fontSize: "14px", minWidth: "160px" }}
            aria-label="Filtrar por horário"
          >
            <option value="">Qualquer horário</option>
            <option value="manha">Manhã (até 12h)</option>
            <option value="tarde">Tarde (12h–18h)</option>
            <option value="noite">Noite (após 18h)</option>
          </select>
          <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Sessions list */}
      <main className="flex-1 bg-background px-12 py-8" aria-label="Programação de cinema">
        {grouped.length === 0 && (
          <p className="text-muted font-sans py-12 text-center" style={{ fontSize: "15px" }}>
            Nenhuma sessão corresponde aos filtros selecionados.
          </p>
        )}

        {grouped.map(({ dayKey, date, timeGroups }) => {
          const { prefix, dateNum, month } = formatDateHeader(date);

          return (
            <section key={dayKey} className="mb-10" aria-label={`Sessões de ${dayKey}`}>
              {/* Day header */}
              <div className="flex items-start gap-6 mb-0">
                <div
                  className="w-16 shrink-0 pt-1 font-display"
                  aria-hidden="true"
                >
                  <span
                    className="block font-semibold text-muted uppercase tracking-wider"
                    style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                  >
                    {prefix}
                  </span>
                  <span
                    className="block font-bold text-gold leading-none"
                    style={{ fontSize: "28px" }}
                  >
                    {dateNum}
                  </span>
                  <span
                    className="block font-semibold text-muted uppercase tracking-wider"
                    style={{ fontSize: "10px", letterSpacing: "0.08em" }}
                  >
                    {month}
                  </span>
                </div>

                {/* Time groups */}
                <div className="flex-1 min-w-0">
                  {timeGroups.map(({ time, sessions: group }, ti) => (
                    <div key={time}>
                      {group.map((s, si) => (
                        <div key={`${time}-${si}`}>
                          <FilmCard
                            session={s}
                            cinemaInfo={cinemaMap.get(s.cinema)}
                            showTime={si === 0}
                          />
                          {(si < group.length - 1 || ti < timeGroups.length - 1) && (
                            <div
                              className="border-t border-dashed border-border"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Day separator */}
              <div className="border-t border-border mt-4" aria-hidden="true" />
            </section>
          );
        })}
      </main>

      {/* About + Footer sections */}
      <About />
      <FooterCta />
    </>
  );
}
