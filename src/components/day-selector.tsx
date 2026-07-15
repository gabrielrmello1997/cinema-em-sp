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
          <div className="flex" style={{ height: 85 }}>
            {days.map((day, i) => {
              const selected = day.id === selectedDayId && selectedDayId !== "";
              const last = i === days.length - 1;
              return (
                <button
                  key={day.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onDayChange(day.id)}
                  className="min-w-[220px] flex-1 flex flex-col items-center justify-center transition-colors relative cursor-pointer"
                  style={{
                    background: selected ? ACCENT : BG,
                    borderRight: last ? "none" : `1px dashed ${LINE}`,
                  }}
                >
                  <span
                    className="text-[18px] font-semibold uppercase"
                    style={{ color: selected ? "#F3F2ED" : "#23211D" }}
                  >
                    {day.label}
                  </span>
                  <span
                    className="text-[18px]"
                    style={{ color: selected ? "#F3F2ED" : "#23211D" }}
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
