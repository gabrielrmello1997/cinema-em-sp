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
};

const LINE = "#66625D";
const BG = "#F3F2ED";
const ACCENT = "#A52323";

export default function DaySelector({
  days,
  selectedDayId,
  onDayChange,
  className = "",
}: DaySelectorProps) {
  const outerBorder = useMemo(
    () => ({ background: LINE, padding: "1px" }),
    [],
  );

  if (days.length === 0) return null;

  return (
    <div className={className}>
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
                  className="flex-1 flex flex-col items-center justify-center transition-colors relative cursor-pointer"
                  style={{
                    background: selected ? ACCENT : BG,
                    borderRight: last ? "none" : `1px dashed ${LINE}`,
                    minWidth: "clamp(120px, 11vw, 185px)",
                  }}
                >
                  <span
                    className="font-semibold uppercase"
                    style={{ fontSize: "clamp(11px,1vw,16px)", color: selected ? "#F3F2ED" : "#23211D" }}
                  >
                    {day.label}
                  </span>
                  <span
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
}
