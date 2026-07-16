"use client";

import { useState, useEffect } from "react";
import DaySelector from "@/components/day-selector";

type ProgrammingDay = {
  id: string;
  label: string;
  dateLabel: string;
};

type Props = {
  query: string;
  cinemaFilter: string;
  timeFilter: string;
  availableCinemas: string[];
  daySelectorDays: ProgrammingDay[];
  selectedDayId: string;
  onQueryChange: (value: string) => void;
  onCinemaFilterChange: (value: string) => void;
  onTimeFilterChange: (value: string) => void;
  onDayChange: (dayId: string) => void;
};

export default function Toolbar({
  query,
  cinemaFilter,
  timeFilter,
  availableCinemas,
  daySelectorDays,
  selectedDayId,
  onQueryChange,
  onCinemaFilterChange,
  onTimeFilterChange,
  onDayChange,
}: Props) {
  const [isNarrow, setIsNarrow] = useState(false);
  const [isVeryNarrow, setIsVeryNarrow] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1270px)");
    setIsNarrow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 479px)");
    setIsVeryNarrow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsVeryNarrow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const hasActiveFilters = cinemaFilter || timeFilter;

  return (
    <>
      {/* Desktop toolbar — unchanged */}
      <div className="pl-12 pt-[40px] max-lg:hidden" style={{ paddingRight: "clamp(16px,3vw,42px)" }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="mr-4">
            <DaySelector
              days={daySelectorDays}
              selectedDayId={selectedDayId}
              onDayChange={onDayChange}
            />
          </div>
          <div className="flex items-center gap-4 ml-auto flex-shrink-0">
            <div className="flex items-center" style={{ border: "1px solid #66625D", height: 49, width: "clamp(220px,22vw,380px)" }}>
              <svg className="w-4 h-4 ml-3 shrink-0" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6.5" stroke="#23211D" strokeWidth="1.5"/>
                <path d="M14 14L18 18" stroke="#23211D" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Buscar filme, diretor, cinema..."
                className="flex-1 px-2 text-sm bg-transparent text-ink placeholder:text-ink/30 outline-none"
                style={{ height: 49 }}
              />
            </div>
            <div className="relative flex-shrink-0" style={{ width: "clamp(90px,10vw,190px)" }}>
              <select
                value={cinemaFilter}
                onChange={(e) => onCinemaFilterChange(e.target.value)}
                className="w-full px-3 pr-8 text-sm bg-transparent text-ink outline-none appearance-none cursor-pointer"
                style={{ height: 49, border: "1px solid #66625D" }}
              >
                <option value="">{isNarrow ? "Cinemas" : "Todos os cinemas"}</option>
                {availableCinemas.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, pointerEvents: 'none' }} viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="relative flex-shrink-0" style={{ width: "clamp(80px,10vw,180px)" }}>
              <select
                value={timeFilter}
                onChange={(e) => onTimeFilterChange(e.target.value)}
                className="w-full px-3 pr-8 text-sm bg-transparent text-ink outline-none appearance-none cursor-pointer"
                style={{ height: 49, border: "1px solid #66625D" }}
              >
                <option value="">{isNarrow ? "Horário" : "Qualquer horário"}</option>
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
      </div>

      {/* Mobile/tablet toolbar */}
      <div className="lg:hidden px-5 md:px-8 pt-6">
        <div className="mb-4">
          <DaySelector
            days={daySelectorDays}
            selectedDayId={selectedDayId}
            onDayChange={onDayChange}
            scrollable={!isVeryNarrow}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center flex-1" style={{ border: "1px solid #66625D", height: 44 }}>
            <svg className="w-4 h-4 ml-3 shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6.5" stroke="#23211D" strokeWidth="1.5"/>
              <path d="M14 14L18 18" stroke="#23211D" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar filme, diretor, cinema..."
              className="flex-1 px-2 text-sm bg-transparent text-ink placeholder:text-ink/30 outline-none"
              style={{ height: 44 }}
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 shrink-0 px-4 h-11 text-sm font-medium uppercase tracking-wider"
            style={{ border: `1px solid ${hasActiveFilters ? "#A52323" : "#66625D"}`, color: hasActiveFilters ? "#A52323" : "#23211D" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M1 3h14M3 8h10M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="max-md:hidden">FILTROS</span>
          </button>
        </div>

        {filtersOpen && (
          <div className="mt-3 p-4 border" style={{ borderColor: "rgba(35,33,29,0.2)" }}>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <select
                  value={cinemaFilter}
                  onChange={(e) => onCinemaFilterChange(e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 text-sm bg-transparent text-ink outline-none appearance-none cursor-pointer"
                  style={{ border: "1px solid #66625D" }}
                >
                  <option value="">Todos os cinemas</option>
                  {availableCinemas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, pointerEvents: 'none' }} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="relative flex-1">
                <select
                  value={timeFilter}
                  onChange={(e) => onTimeFilterChange(e.target.value)}
                  className="w-full px-3 pr-8 py-2.5 text-sm bg-transparent text-ink outline-none appearance-none cursor-pointer"
                  style={{ border: "1px solid #66625D" }}
                >
                  <option value="">Qualquer horário</option>
                  <option value="manha">Manhã (até 12h)</option>
                  <option value="tarde">Tarde (12h–18h)</option>
                  <option value="noite">Noite (após 18h)</option>
                </select>
                <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, pointerEvents: 'none' }} viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && !filtersOpen && (
          <div className="flex flex-wrap gap-2 mt-3">
            {cinemaFilter && (
              <button
                onClick={() => onCinemaFilterChange("")}
                className="flex items-center gap-1 px-2.5 py-1 text-xs"
                style={{ border: "1px solid #A52323", color: "#A52323" }}
              >
                {cinemaFilter}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5" stroke="#A52323" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {timeFilter && (
              <button
                onClick={() => onTimeFilterChange("")}
                className="flex items-center gap-1 px-2.5 py-1 text-xs"
                style={{ border: "1px solid #A52323", color: "#A52323" }}
              >
                {timeFilter === "manha" ? "Manhã" : timeFilter === "tarde" ? "Tarde" : "Noite"}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M7.5 2.5L2.5 7.5M2.5 2.5l5 5" stroke="#A52323" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
