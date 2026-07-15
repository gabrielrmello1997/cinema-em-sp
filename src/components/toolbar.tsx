"use client";

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
  return (
    <div className="px-12 pt-[30px]">
      <div className="flex items-center gap-4">
        <div className="mr-4">
          <DaySelector
            days={daySelectorDays}
            selectedDayId={selectedDayId}
            onDayChange={onDayChange}
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
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar filme, diretor, cinema..."
            className="flex-1 px-2 text-sm bg-transparent text-ink placeholder:text-ink/30 outline-none"
            style={{ height: 49 }}
          />
        </div>
        <div className="relative shrink-0" style={{ width: 210 }}>
          <select
            value={cinemaFilter}
            onChange={(e) => onCinemaFilterChange(e.target.value)}
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
            onChange={(e) => onTimeFilterChange(e.target.value)}
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
  );
}
