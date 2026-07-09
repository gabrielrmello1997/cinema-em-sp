"use client";

import { useRef, useState } from "react";

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="1.5" y="3" width="15" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.5 7.5h15" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 1.5v3M12 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

// PT day abbreviations mapping
const DAY_LABELS: Record<string, { short: string; full: string }> = {
  0: { short: "DOM", full: "DOMINGO" },
  1: { short: "SEG", full: "SEGUNDA" },
  2: { short: "TER", full: "TERÇA" },
  3: { short: "QUA", full: "QUARTA" },
  4: { short: "QUI", full: "QUINTA" },
  5: { short: "SEX", full: "SEXTA" },
  6: { short: "SÁB", full: "SÁBADO" },
};

const MONTH_LABELS = [
  "JAN", "FEV", "MAR", "ABR", "MAI", "JUN",
  "JUL", "AGO", "SET", "OUT", "NOV", "DEZ",
];

// Today labels
function getTodayLabel(date: Date): string | null {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth()
  ) {
    return "HOJE";
  }
  if (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth()
  ) {
    return "AMANHÃ";
  }
  return null;
}

export interface DayTab {
  date: Date;
  dayKey: string; // "DD/MM" used to match sessions
}

interface DayPickerProps {
  days: DayTab[];
  selectedDay: string | null; // "DD/MM" or null for "all"
  onSelectDay: (day: string | null) => void;
}

export default function DayPicker({ days, selectedDay, onSelectDay }: DayPickerProps) {
  const [customDate, setCustomDate] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function formatDayKey(date: Date): string {
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    return `${dd}/${mm}`;
  }

  function handleCustomDate(val: string) {
    setCustomDate(val);
    if (!val) return;
    // val is YYYY-MM-DD
    const [, m, d] = val.split("-");
    const key = `${d}/${m}`;
    onSelectDay(key);
  }

  return (
    <div className="flex items-stretch gap-0 overflow-x-auto" role="tablist" aria-label="Selecionar dia">
      {days.map((tab) => {
        const key = formatDayKey(tab.date);
        const isActive = selectedDay === key;
        const dayOfWeek = tab.date.getDay();
        const todayLabel = getTodayLabel(tab.date);
        const dayLabel = todayLabel ?? DAY_LABELS[dayOfWeek]?.full ?? DAY_LABELS[dayOfWeek]?.short;
        const dateNum = tab.date.getDate();
        const month = MONTH_LABELS[tab.date.getMonth()];

        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectDay(isActive ? null : key)}
            className={`
              flex flex-col items-center justify-center px-5 py-3 border-r border-border
              transition-colors min-w-[100px] font-display
              ${isActive
                ? "bg-gold text-foreground"
                : "bg-background text-foreground hover:bg-card"
              }
            `}
          >
            <span
              className={`font-semibold uppercase tracking-wider mb-0.5 ${isActive ? "text-foreground" : "text-muted"}`}
              style={{ fontSize: "10px", letterSpacing: "0.1em" }}
            >
              {dayLabel}
            </span>
            <span
              className="font-bold leading-none"
              style={{ fontSize: "26px" }}
            >
              {dateNum}
            </span>
            <span
              className={`uppercase tracking-wider ${isActive ? "text-foreground/70" : "text-muted"}`}
              style={{ fontSize: "10px", letterSpacing: "0.08em" }}
            >
              {month}
            </span>
          </button>
        );
      })}

      {/* Custom date picker */}
      <div className="relative flex items-center">
        <button
          onClick={() => inputRef.current?.showPicker?.()}
          className="flex flex-col items-center justify-center px-5 py-3 gap-1 bg-background text-foreground hover:bg-card transition-colors min-w-[100px] font-display border-r border-border"
          aria-label="Escolher data específica"
        >
          <CalendarIcon />
          <span
            className="font-semibold uppercase tracking-wider text-muted"
            style={{ fontSize: "10px", letterSpacing: "0.08em" }}
          >
            ESCOLHER<br />DATA
          </span>
        </button>
        <input
          ref={inputRef}
          type="date"
          value={customDate}
          onChange={(e) => handleCustomDate(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
