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

function CinemaInfoBlock({ cinema, cinemaMap }: { cinema: string; cinemaMap: Map<string, CinemaInfo> }) {
  const info = cinemaMap.get(cinema);
  return (
    <>
      {info?.address && <div className="text-sm mt-1 leading-snug">{info.address}</div>}
      {info?.infoUrl && (
        <a href={info.infoUrl} target="_blank" rel="noopener noreferrer"
          className="group text-sm mt-1 inline-block text-[#23211D] hover:text-accent transition-colors">
          <span style={{ textDecoration: "underline" }}>Mais informações</span>
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="ml-1 w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
            <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      )}
    </>
  );
}

function FilmMeta({ s, fi }: { s: Session; fi: number }) {
  return (
    <>
      {fi > 0 && <div className="dash-ink mb-6" />}
      <div className="font-bold tracking-wide leading-snug font-sora" style={{ fontSize: "clamp(16px,1.4vw,20px)" }}>
        {s.title}{s.year > 0 ? ` (${s.year})` : ""}
      </div>
      {s.originalTitle && s.originalTitle !== s.title &&
        !s.originalTitle.toLowerCase().includes(s.title.toLowerCase()) && (
        <div className="text-[15px] italic mt-0.5 leading-snug" style={{ color: "#4A4742" }}>
          {s.originalTitle}
        </div>
      )}
      {s.director && (
        <div className="text-[15px] mt-2 leading-snug">Direção: {s.director}</div>
      )}
      <div className="text-[15px] mt-1 leading-snug">
        {s.country}{s.country && s.duration > 0 ? ", " : ""}{s.duration > 0 ? `${s.duration}'` : ""}
      </div>
    </>
  );
}

export default function Agenda({ groups, dayGroups, dayTabs, cinemaMap, onPosterClick }: Props) {
  return (
    <>
      {/* Desktop agenda — unchanged */}
      <section id="agenda" className="px-12 pt-8 pb-16 max-lg:hidden">
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
                <div className="dash-ink -mx-12" style={{ marginTop: 48, marginBottom: 48 }} />
              )}
              <div className="flex gap-0">
                <div className="w-[90px] shrink-0 text-center sticky top-6 self-start -ml-2">
                  <div className="font-medium uppercase leading-tight font-sora" style={{ color: "#23211D", fontSize: "clamp(14px,1.2vw,18px)" }}>
                    {dayInfo?.label || ""}
                  </div>
                  <div className="font-bold leading-tight mt-0 font-sora" style={{ color: "#A52323", fontSize: "clamp(38px,3.8vw,56px)" }}>
                    {dayInfo?.dayNum ?? ""}
                  </div>
                  <div className="font-medium uppercase mt-0 font-sora" style={{ color: "#23211D", fontSize: "clamp(14px,1.2vw,18px)" }}>
                    {dayInfo?.month || ""}
                  </div>
                </div>

                <div className="flex-1 min-w-0" style={{ paddingLeft: "clamp(24px,3vw,48px)" }}>
                  {dg.groups.map((group, gi) => {
                  const first = group[0];
                  return (
                    <Fragment key={gi}>
                      {gi > 0 && (
                        <div className="dash-ink" style={{ marginTop: 48, marginBottom: 48, marginLeft: 0 }} />
                      )}
                      <div className="flex" style={{ gap: "clamp(4px,1vw,16px)" }}>
                        <div className="shrink-0 pt-1" style={{ width: "clamp(100px,7.5vw,130px)" }}>
                          <div className="text-[26px] font-bold leading-tight font-sora tracking-wide" style={{ color: "#A52323" }}>{first.time}</div>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="grid gap-x-12 gap-y-6" style={{ gridTemplateColumns: "minmax(auto,480px) clamp(80px,8vw,150px)" }}>
                            {group.map((s, fi) => (
                              <Fragment key={fi}>
                                <div>
                                  {fi === 0 && first.mostra && (
                                    <div className="font-medium tracking-wide uppercase mb-2 leading-snug break-words max-w-[400px] font-sora" style={{ fontSize: "clamp(13px,1vw,16px)", color: "#A52323" }}>
                                      {first.mostra}
                                    </div>
                                  )}
                                  <FilmMeta s={s} fi={fi} />
                                </div>
                                <div>
                                  {fi > 0 && <div className="h-[41px]" />}
                                  {s.poster && (
                                    <div className="w-full" style={{ aspectRatio: "150/220", maxWidth: 150, border: "1px solid rgba(35,33,29,0.3)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
                                      <img src={s.poster} alt={s.title} className="w-full h-full object-cover cursor-pointer" onClick={() => onPosterClick(s.poster)} />
                                    </div>
                                  )}
                                </div>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0 pt-1" style={{ width: "clamp(140px,16vw,300px)", marginLeft: "clamp(12px,2vw,48px)", marginRight: "clamp(16px,3vw,80px)" }}>
                          <div className="font-bold leading-tight tracking-wide font-sora" style={{ fontSize: "clamp(15px,1.3vw,20px)" }}>{first.cinema}</div>
                          <CinemaInfoBlock cinema={first.cinema} cinemaMap={cinemaMap} />
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

      {/* Tablet agenda — reduced grid */}
      <section id="agenda" className="hidden md:block lg:hidden px-8 pt-8 pb-16">
        {groups.length === 0 && (
          <p className="text-ink/40 text-[20px]">Nenhuma sessão para esta data.</p>
        )}
        {dayGroups.map((dg, dgi) => {
          const dayInfo = dayTabs.find((d) => d.day === dg.day);
          return (
            <div key={dg.day}>
              {dgi > 0 && <div className="dash-ink -mx-8" style={{ marginTop: 40, marginBottom: 40 }} />}
              <div className="flex gap-4">
                <div className="shrink-0 text-center self-start pt-1" style={{ width: 75 }}>
                  <div className="font-medium uppercase leading-tight font-sora text-sm">{dayInfo?.label || ""}</div>
                  <div className="font-bold leading-tight font-sora text-3xl" style={{ color: "#A52323" }}>{dayInfo?.dayNum ?? ""}</div>
                  <div className="font-medium uppercase leading-tight font-sora text-sm">{dayInfo?.month || ""}</div>
                </div>
                <div className="flex-1 min-w-0">
                  {dg.groups.map((group, gi) => {
                    const first = group[0];
                    return (
                      <Fragment key={gi}>
                        {gi > 0 && <div className="dash-ink my-8" />}
                        <div className="flex gap-3">
                          <div className="shrink-0 pt-1" style={{ width: 70 }}>
                            <div className="text-lg font-bold font-sora tracking-wide" style={{ color: "#A52323" }}>{first.time}</div>
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="grid gap-x-6 gap-y-4" style={{ gridTemplateColumns: "1fr 90px" }}>
                              {group.map((s, fi) => (
                                <Fragment key={fi}>
                                  <div>
                                    {fi === 0 && first.mostra && (
                                      <div className="font-medium uppercase text-xs mb-1 break-words font-sora" style={{ color: "#A52323" }}>{first.mostra}</div>
                                    )}
                                    <FilmMeta s={s} fi={fi} />
                                  </div>
                                  <div>
                                    {fi > 0 && <div className="h-[30px]" />}
                                    {s.poster && (
                                      <img src={s.poster} alt={s.title} className="w-full cursor-pointer object-cover" style={{ aspectRatio: "150/220", maxWidth: 90 }} onClick={() => onPosterClick(s.poster)} />
                                    )}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </div>
                          <div className="shrink-0 pt-1" style={{ width: 200 }}>
                            <div className="font-bold text-sm uppercase tracking-wide font-sora">{first.cinema}</div>
                            <CinemaInfoBlock cinema={first.cinema} cinemaMap={cinemaMap} />
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
      </section>

      {/* Mobile agenda — stacked */}
      <section id="agenda" className="md:hidden px-5 pt-6 pb-12">
        {groups.length === 0 && (
          <p className="text-ink/40 text-[18px]">Nenhuma sessão para esta data.</p>
        )}
        {dayGroups.map((dg, dgi) => {
          const dayInfo = dayTabs.find((d) => d.day === dg.day);
          return (
            <div key={dg.day}>
              {dgi > 0 && <div className="dash-ink -mx-5" style={{ marginTop: 32, marginBottom: 32 }} />}
              {dayInfo && (
                <div className="mb-6">
                  <div className="font-bold font-sora text-lg tracking-wide" style={{ color: "#A52323" }}>{dayInfo.label} · {dayInfo.dayNum} DE {dayInfo.month}</div>
                  <div className="dash-ink mt-3" />
                </div>
              )}
              {dg.groups.map((group, gi) => {
                const first = group[0];
                return (
                  <Fragment key={gi}>
                    {gi > 0 && <div className="dash-ink my-5" />}
                    <div className="flex gap-2">
                      <div className="shrink-0 pt-1" style={{ width: 60 }}>
                        <div className="text-lg font-bold font-sora tracking-wide" style={{ color: "#A52323" }}>{first.time}</div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        {first.mostra && (
                          <div className="font-medium uppercase text-xs mb-1 leading-tight break-words font-sora" style={{ color: "#A52323" }}>{first.mostra}</div>
                        )}
                        {group.map((s, fi) => (
                          <div key={fi} className={fi > 0 ? "mt-4" : ""}>
                            {fi > 0 && <div className="dash-ink mb-4" />}
                            <div className="flex gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="font-bold leading-snug font-sora text-lg tracking-wide">{s.title}{s.year > 0 ? ` (${s.year})` : ""}</div>
                                {s.originalTitle && s.originalTitle !== s.title &&
                                  !s.originalTitle.toLowerCase().includes(s.title.toLowerCase()) && (
                                  <div className="text-sm italic mt-0.5 leading-snug" style={{ color: "#4A4742" }}>{s.originalTitle}</div>
                                )}
                                {s.director && <div className="text-sm mt-1 leading-snug">Direção: {s.director}</div>}
                                <div className="text-sm mt-1 leading-snug">
                                  {s.country}{s.country && s.duration > 0 ? ", " : ""}{s.duration > 0 ? `${s.duration}'` : ""}
                                </div>
                              </div>
                              {s.poster && (
                                <div className="shrink-0">
                                  <img src={s.poster} alt={s.title} className="object-cover cursor-pointer" style={{ width: 76, height: 114, border: "1px solid rgba(35,33,29,0.3)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }} onClick={() => onPosterClick(s.poster)} />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(35,33,29,0.15)" }}>
                          <div className="font-bold text-sm uppercase tracking-wide font-sora">{first.cinema}</div>
                          <CinemaInfoBlock cinema={first.cinema} cinemaMap={cinemaMap} />
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          );
        })}
      </section>
    </>
  );
}
