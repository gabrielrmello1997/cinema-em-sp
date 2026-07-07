"use client";

import { useMemo, useState } from "react";
import type { Session } from "@/lib/substack/programming";

const DAY_ORDER: Record<string, number> = {
  "SEGUNDA-FEIRA": 1,
  "TERÇA-FEIRA": 2,
  "QUARTA-FEIRA": 3,
  "QUINTA-FEIRA": 4,
  "SEXTA-FEIRA": 5,
  "SÁBADO": 6,
  "DOMINGO": 7,
};

interface Props {
  sessions: Session[];
  allSessions: Session[];
  feedTitle: string;
  refreshedAt: string;
}

function parseDate(s: Session): Date | null {
  const m = s.day.match(/\((\d{2})\/(\d{2})\)/);
  if (!m) return null;
  return new Date(s.year, Number(m[2]) - 1, Number(m[1]));
}

function mondayOf(d: Date): Date {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const m = new Date(d);
  m.setDate(d.getDate() + diff);
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
  const sun = new Date(monday);
  sun.setDate(mon.getDate() + 6);

  return sessions.filter((s) => {
    const d = parseDate(s);
    if (!d) return true;
    return d >= mon && d <= sun;
  });
}

interface WeekOption {
  label: string;
  monday: Date;
}

export default function SessionTable({ sessions, allSessions, feedTitle, refreshedAt }: Props) {
  const [query, setQuery] = useState("");
  const [cinemaFilter, setCinemaFilter] = useState("");
  const [dayFilter, setDayFilter] = useState("");
  const [weekKey, setWeekKey] = useState("");

  const weeks = useMemo(() => {
    const seen = new Set<string>();
    const result: WeekOption[] = [];

    for (const s of allSessions) {
      const d = parseDate(s);
      if (!d) continue;
      const mon = mondayOf(d);
      const key = formatKey(mon);

      if (!seen.has(key)) {
        seen.add(key);
        const sun = new Date(mon);
        sun.setDate(mon.getDate() + 6);
        result.push({ label: `${formatDDMM(mon)} — ${formatDDMM(sun)}`, monday: mon });
      }
    }

    result.sort((a, b) => b.monday.getTime() - a.monday.getTime());
    return result;
  }, [allSessions]);

  const resolvedSessions = useMemo(() => {
    if (!weekKey) return sessions;

    const mon = parseKey(weekKey);
    return sessionsInWeek(allSessions, mon);
  }, [weekKey, sessions, allSessions]);

  const cinemas = useMemo(() => {
    const unique = new Set(resolvedSessions.map((s) => s.cinema));
    return Array.from(unique).sort();
  }, [resolvedSessions]);

  const days = useMemo(() => {
    const unique = new Set(resolvedSessions.map((s) => s.day));
    return Array.from(unique).sort(
      (a, b) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99),
    );
  }, [resolvedSessions]);

  const filtered = useMemo(() => {
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const q = normalize(query);

    return resolvedSessions.filter((s) => {
      if (q) {
        const inTitle = normalize(s.title).includes(q);
        const inCinema = normalize(s.cinema).includes(q);
        const inDirector = normalize(s.director).includes(q);
        const inCountry = normalize(s.country).includes(q);
        if (!inTitle && !inCinema && !inDirector && !inCountry) return false;
      }
      if (cinemaFilter && s.cinema !== cinemaFilter) return false;
      if (dayFilter && s.day !== dayFilter) return false;
      return true;
    });
  }, [resolvedSessions, query, cinemaFilter, dayFilter]);

  const grouped: Record<string, Session[]> = {};
  for (const s of filtered) {
    if (!grouped[s.day]) grouped[s.day] = [];
    grouped[s.day].push(s);
  }

  const sortedDays = Object.keys(grouped).sort(
    (a, b) => (DAY_ORDER[a] ?? 99) - (DAY_ORDER[b] ?? 99),
  );

  const inputClass =
    "rounded border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-zinc-600";

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-8">
      <h1 className="mb-1 text-2xl font-bold">{feedTitle}</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Atualizado em {new Date(refreshedAt).toLocaleString("pt-BR")}
      </p>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className={`${inputClass} w-56`}
          value={weekKey}
          onChange={(e) => setWeekKey(e.target.value)}
        >
          <option value="">Esta semana</option>
          {weeks.map((w) => (
            <option key={formatKey(w.monday)} value={formatKey(w.monday)}>
              {w.label}
            </option>
          ))}
        </select>
        <input
          className={`${inputClass} min-w-0 flex-1`}
          placeholder="Buscar filme, cinema, diretor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className={`${inputClass} w-48`}
          value={cinemaFilter}
          onChange={(e) => setCinemaFilter(e.target.value)}
        >
          <option value="">Todos os cinemas</option>
          {cinemas.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={`${inputClass} w-44`}
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
        >
          <option value="">Todas as datas</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-4 text-sm text-zinc-400">{filtered.length} sessões encontradas</p>

      {sortedDays.length === 0 && (
        <p className="text-zinc-500">Nenhuma sessão corresponde aos filtros.</p>
      )}

      {sortedDays.map((day) => (
        <section key={day} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">{day}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-300 text-left text-zinc-500">
                  <th className="py-2 pr-4">Cinema</th>
                  <th className="py-2 pr-4">Horário</th>
                  <th className="py-2 pr-4">Filme</th>
                  <th className="py-2 pr-4">Ano</th>
                  <th className="py-2 pr-4">País</th>
                  <th className="py-2 pr-4">Duração</th>
                  <th className="py-2 pr-4">Direção</th>
                </tr>
              </thead>
              <tbody>
                {grouped[day].map((s, i) => (
                  <tr key={i} className="border-b border-zinc-200">
                    <td className="py-2 pr-4">{s.cinema}</td>
                    <td className="whitespace-nowrap py-2 pr-4">{s.time}</td>
                    <td className="py-2 pr-4 font-medium">{s.title}</td>
                    <td className="py-2 pr-4">{s.year}</td>
                    <td className="py-2 pr-4">{s.country}</td>
                    <td className="py-2 pr-4">{s.duration}&rsquo;</td>
                    <td className="py-2 pr-4">{s.director}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
