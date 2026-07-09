"use client";

import { useState, useRef, useEffect } from "react";

// Cinema seat decorative SVG — simplified row of seats silhouette
function SeatMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* 4 cinema seats in a row */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 80}, 0)`}>
          {/* Seat back */}
          <rect x="8" y="0" width="56" height="44" rx="6" fill="currentColor" />
          {/* Seat armrests */}
          <rect x="0" y="30" width="12" height="30" rx="4" fill="currentColor" />
          <rect x="60" y="30" width="12" height="30" rx="4" fill="currentColor" />
          {/* Seat bottom */}
          <rect x="10" y="48" width="52" height="22" rx="4" fill="currentColor" />
          {/* Seat fold indicator */}
          <rect x="18" y="12" width="36" height="20" rx="3" fill="currentColor" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5 1.5v2M11 1.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

interface WeekOption {
  label: string;
  monday: Date;
  key: string;
}

interface HeroProps {
  weeks: WeekOption[];
  selectedWeekKey: string;
  onWeekChange: (key: string) => void;
  currentWeekLabel: string;
}

export default function Hero({ weeks, selectedWeekKey, onWeekChange, currentWeekLabel }: HeroProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selectedLabel =
    weeks.find((w) => w.key === selectedWeekKey)?.label ?? currentWeekLabel;

  return (
    <section
      id="programacao"
      className="relative overflow-hidden bg-sidebar text-sidebar-foreground"
      style={{ minHeight: "318px" }}
      aria-label="Cinema em São Paulo"
    >
      <div className="relative z-10 flex flex-col justify-between h-full px-12 pt-10 pb-0" style={{ minHeight: "318px" }}>
        {/* Top row: title + week selector */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1
              className="font-display font-bold text-sidebar-foreground leading-tight text-balance"
              style={{ fontSize: "54px", lineHeight: 1.05 }}
            >
              Cinema em São Paulo
            </h1>
            <p className="mt-4 font-sans text-sidebar-foreground/60" style={{ fontSize: "16px", maxWidth: "340px", lineHeight: 1.5 }}>
              Acompanhe a programação de cineclubes<br />e cinemas pela cidade.
            </p>
          </div>

          {/* Week selector dropdown */}
          <div className="relative shrink-0 mt-1" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 border border-sidebar-foreground/30 hover:border-gold bg-sidebar-foreground/5 hover:bg-sidebar-foreground/10 text-sidebar-foreground transition-colors px-4 py-2 rounded"
              style={{ fontSize: "12px", letterSpacing: "0.07em", fontFamily: "var(--font-display)" }}
              aria-expanded={open}
              aria-haspopup="listbox"
            >
              <CalendarIcon />
              <span className="font-semibold uppercase">{selectedLabel}</span>
              <ChevronDown />
            </button>

            {open && (
              <div
                role="listbox"
                aria-label="Selecionar semana"
                className="absolute right-0 top-full mt-1 z-50 min-w-[220px] bg-sidebar border border-sidebar-foreground/20 rounded shadow-lg overflow-hidden"
              >
                <button
                  role="option"
                  aria-selected={selectedWeekKey === ""}
                  className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors ${
                    selectedWeekKey === ""
                      ? "bg-gold text-sidebar text-foreground font-semibold"
                      : "text-sidebar-foreground hover:bg-sidebar-foreground/10"
                  }`}
                  onClick={() => { onWeekChange(""); setOpen(false); }}
                >
                  Esta semana
                </button>
                {weeks.map((w) => (
                  <button
                    key={w.key}
                    role="option"
                    aria-selected={selectedWeekKey === w.key}
                    className={`w-full text-left px-4 py-2.5 font-sans text-sm transition-colors ${
                      selectedWeekKey === w.key
                        ? "bg-gold text-foreground font-semibold"
                        : "text-sidebar-foreground hover:bg-sidebar-foreground/10"
                    }`}
                    onClick={() => { onWeekChange(w.key); setOpen(false); }}
                  >
                    Semana de {w.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Decorative seat motif — bottom right */}
        <div className="flex justify-end mt-auto" aria-hidden="true">
          <SeatMotif className="text-sidebar-foreground/10 w-[320px]" />
        </div>
      </div>
    </section>
  );
}
