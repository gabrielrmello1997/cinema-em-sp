"use client";

import { Fragment } from "react";
import type { Session, CinemaInfo } from "@/lib/substack/programming";

type DayTab = {
  day: string;
  sessions: Session[];
  date: Date | null;
  label: string;
  dayNum: number;
  month: string;
  isToday: boolean;
  index: number;
};

type DayGroup = {
  day: string;
  groups: Session[][];
};

type Props = {
  groups: Session[][];
  dayGroups: DayGroup[];
  dayTabs: DayTab[];
  cinemaMap: Map<string, CinemaInfo>;
  onPosterClick: (url: string) => void;
};

export default function Agenda({ groups, dayGroups, dayTabs, cinemaMap, onPosterClick }: Props) {
  return (
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
              <div className="w-[90px] shrink-0 text-center sticky top-6 self-start -ml-2">
                <div className="text-[18px] font-semibold uppercase leading-tight " style={{ color: "#23211D" }}>
                  {dayInfo?.label || ""}
                </div>
                <div className="text-[56px] font-bold leading-tight mt-0" style={{ color: "#A52323" }}>
                  {dayInfo?.dayNum ?? ""}
                </div>
                <div className="text-[18px] font-semibold uppercase mt-0" style={{ color: "#23211D" }}>
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
                              <div>
                                {fi > 0 && <div className="dash-ink mb-10" />}
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
                                {fi > 0 && <div className="h-[41px]" />}
                                {s.poster && (
                                  <div className="w-[150px] h-[220px]" style={{ border: "1px solid rgba(35,33,29,0.3)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
                                    <img src={s.poster} alt={s.title} className="w-[150px] h-[220px] object-cover cursor-pointer" onClick={() => onPosterClick(s.poster)} />
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
  );
}
