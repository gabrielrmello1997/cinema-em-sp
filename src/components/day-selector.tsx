"use client";

import { useMemo } from "react";

export type ProgrammingDay = {
  id: string;
  label: string;
  dateLabel: string;
};

export type DaySelectorProps = {
  days: ProgrammingDay[];
  selectedDayId: string;
  onDayChange: (dayId: string) => void;
  className?: string;
  scrollable?: boolean;
};

const LINE = "#66625D";
const BG = "#F3F2ED";
const ACCENT = "#A52323";

export default function DaySelector({
  days,
  selectedDayId,
  onDayChange,
  className = "",
  scrollable,
}: DaySelectorProps) {
  const outerBorder = useMemo(
    () => ({ background: LINE, padding: "1px" }),
    [],
  );

  if (days.length === 0) return null;

  const inner = (
    <div style={{ filter: "drop-shadow(4px 4px 10px rgba(35,33,29,0.12))" }}>
      <div className="ticket-shape" style={outerBorder}>
        <div className="ticket-shape-inner overflow-hidden" style={{ background: BG }}>
          <div className="flex" style={{ height: "clamp(54px,4.5vw,72px)" }}>
            {days.map((day, i) => {
              const selected = day.id === selectedDayId && selectedDayId !== "";
              const last = i === days.length - 1;
              return (
                <button
                  key={day.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onDayChange(day.id)}
                  className="flex flex-1 min-w-0 flex-col items-center justify-center transition-colors relative cursor-pointer tracking-wide"
                  style={{
                    background: selected ? ACCENT : BG,
                    borderRight: last ? "none" : `1px dashed ${LINE}`,
                  }}
                >
                  <span
                    className="font-sora font-bold uppercase tracking-wide"
                    style={{ fontSize: "clamp(11px,1vw,16px)", color: selected ? "#F3F2ED" : "#23211D" }}
                  >
                    {day.label}
                  </span>
                  <span
                    className="font-normal uppercase tracking-wide"
                    style={{ fontSize: "clamp(10px,0.9vw,15px)", color: selected ? "#F3F2ED" : "#23211D" }}
                  >
                    {day.dateLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  if (scrollable) {
    return (
      <div className={className}>
        <div className="days-scroll w-full pt-[2px] pb-3">
          <div className="w-full">
            {inner}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {inner}
    </div>
  );
}
