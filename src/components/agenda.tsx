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

function CinemaInfoBlock({
  cinema,
  cinemaMap,
}: {
  cinema: string;
  cinemaMap: Map<string, CinemaInfo>;
}) {
  const info = cinemaMap.get(cinema);

  return (
    <>
      {info?.address && (
        <div className="text-[13px] mt-1 leading-snug">{info.address}</div>
      )}

      {info?.infoUrl && (
        <a
          href={info.infoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-sm mt-1 inline-block text-[#23211D] hover:text-accent transition-colors"
        >
          <span style={{ textDecoration: "underline" }}>Mais informações</span>

          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            className="ml-1 w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
          >
            <path
              d="M7.333 0.667L0.667 7.333"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1.333 0.667h6v6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

      <div
        className="font-bold tracking-wide leading-snug font-sora"
        style={{ fontSize: "clamp(16px,1.4vw,20px)" }}
      >
        {s.title}
        {s.year > 0 ? ` (${s.year})` : ""}
      </div>

      {s.originalTitle &&
        s.originalTitle !== s.title &&
        !s.originalTitle.toLowerCase().includes(s.title.toLowerCase()) && (
          <div
            className="text-[15px] italic mt-2 leading-snug"
            style={{ color: "#4A4742" }}
          >
            {s.originalTitle}
          </div>
        )}

      {s.director && (
        <div className="text-[15px] mt-6 leading-snug">
          Direção: {s.director}
        </div>
      )}

      <div className="text-[15px] mt-1 leading-snug">
        {s.country}
        {s.country && s.duration > 0 ? ", " : ""}
        {s.duration > 0 ? `${s.duration}'` : ""}
      </div>
    </>
  );
}

export default function Agenda({
  groups,
  dayGroups,
  dayTabs,
  cinemaMap,
  onPosterClick,
}: Props) {
  return (
    <>
      {/* Desktop agenda — unchanged */}
      <section id="agenda" className="px-12 pt-8 pb-16 max-lg:hidden">
        {groups.length === 0 && (
          <p className="text-ink/40 text-[20px]">
            Nenhuma sessão para esta data.
          </p>
        )}

        <div className="relative">
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: 90,
              borderLeft: "1px dashed #23211D",
            }}
          />

          {dayGroups.map((dg, dgi) => {
            const dayInfo = dayTabs.find((d) => d.day === dg.day);

            return (
              <div key={dg.day}>
                {dgi > 0 && (
                  <div
                    className="dash-ink"
                    style={{
                      marginTop: 48,
                      marginBottom: 48,
                    }}
                  />
                )}

                <div className="flex gap-0">
                  <div className="w-[90px] shrink-0 text-center sticky top-6 self-start -ml-2">
                    <div
                      className="font-medium uppercase leading-tight font-sora"
                      style={{
                        color: "#23211D",
                        fontSize: "clamp(14px,1.2vw,18px)",
                      }}
                    >
                      {dayInfo?.label || ""}
                    </div>

                    <div
                      className="font-bold leading-tight mt-0 font-sora"
                      style={{
                        color: "#A52323",
                        fontSize: "clamp(38px,3.8vw,56px)",
                      }}
                    >
                      {dayInfo?.dayNum ?? ""}
                    </div>

                    <div
                      className="font-medium uppercase mt-0 font-sora"
                      style={{
                        color: "#23211D",
                        fontSize: "clamp(14px,1.2vw,18px)",
                      }}
                    >
                      {dayInfo?.month || ""}
                    </div>
                  </div>

                  <div
                    className="flex-1 min-w-0"
                    style={{ paddingLeft: "clamp(24px,3vw,48px)" }}
                  >
                    {dg.groups.map((group, gi) => {
                      const first = group[0];

                      return (
                        <Fragment key={gi}>
                          {gi > 0 && (
                            <div
                              className="dash-ink"
                              style={{
                                marginTop: 48,
                                marginBottom: 48,
                                marginLeft: 0,
                              }}
                            />
                          )}

                          <div
                            className="flex"
                            style={{ gap: "clamp(4px,1vw,16px)" }}
                          >
                            <div
                              className="shrink-0 pt-1"
                              style={{
                                width: "clamp(100px,7.5vw,130px)",
                              }}
                            >
                              <div
                                className="text-[26px] font-bold leading-tight font-sora tracking-wide"
                                style={{ color: "#A52323" }}
                              >
                                {first.time}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 pt-1">
                              <div
                                className="grid gap-x-12 gap-y-6"
                                style={{
                                  gridTemplateColumns:
                                    "minmax(auto,480px) clamp(80px,8vw,150px)",
                                }}
                              >
                                {group.map((s, fi) => (
                                  <Fragment key={fi}>
                                    <div>
                                      {fi === 0 && first.mostra && (
                                        <div
                                          className="font-medium tracking-wide uppercase mb-2 leading-snug break-words max-w-[400px] font-sora"
                                          style={{
                                            fontSize: "clamp(13px,1vw,16px)",
                                            color: "#A52323",
                                          }}
                                        >
                                          {first.mostra}
                                        </div>
                                      )}

                                      <FilmMeta s={s} fi={fi} />
                                    </div>

                                    <div>
                                      {fi > 0 && <div className="h-[41px]" />}

                                      {s.poster && (
                                        <div
                                          className="w-full"
                                          style={{
                                            aspectRatio: "150/220",
                                            maxWidth: 150,
                                            border:
                                              "1px solid rgba(35,33,29,0.3)",
                                            boxShadow:
                                              "4px 4px 10px rgba(35,33,29,0.3)",
                                          }}
                                        >
                                          <img
                                            src={s.poster}
                                            alt={s.title}
                                            className="w-full h-full object-cover cursor-pointer"
                                            onClick={() =>
                                              onPosterClick(s.poster)
                                            }
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </Fragment>
                                ))}
                              </div>
                            </div>

                            <div
                              className="shrink-0 pt-1"
                              style={{
                                width: "clamp(140px,16vw,300px)",
                                marginLeft: "clamp(12px,2vw,48px)",
                                marginRight: "clamp(16px,3vw,80px)",
                              }}
                            >
                              <div
                                className="font-bold leading-tight tracking-wide font-sora"
                                style={{
                                  fontSize: "clamp(12px,1.3vw,20px)",
                                }}
                              >
                                {first.cinema}
                              </div>

                              <CinemaInfoBlock
                                cinema={first.cinema}
                                cinemaMap={cinemaMap}
                              />
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

      {/* Tablet agenda — sem data empilhada */}
<section
  id="agenda"
  className="hidden md:block lg:hidden px-8 pt-8 pb-16"
>
  {groups.length === 0 && (
    <p className="text-ink/40 text-[20px]">
      Nenhuma sessão para esta data.
    </p>
  )}

  {dayGroups.map((dg, dgi) => {
    const dayInfo = dayTabs.find((d) => d.day === dg.day);

    return (
      <div key={dg.day} id={`day-${dgi}`} style={{ scrollMarginTop: 144 }}>
        {/* Data única acima da linha pontilhada */}
        <div className="flex flex-col gap-4 pt-3">
          <span
            className="font-bold font-sora text-[17px] uppercase tracking-wide"
            style={{ color: "#A52323" }}
          >
            {dayInfo
              ? `${dayInfo.label} • ${dayInfo.dayNum} DE ${dayInfo.month}`
              : dg.day}
          </span>

          <div className="dash-ink" />
        </div>

        <div className="pt-7">
          {dg.groups.map((group, gi) => {
            const first = group[0];

            return (
              <Fragment key={gi}>
                {gi > 0 && <div className="dash-ink my-8" />}

                <div className="flex gap-10">
                  {/* Horário */}
                  <div
                    className="shrink-0 pt-1"
                    style={{ width: 76 }}
                  >
                    <div
                      className="text-[20px] font-bold leading-tight font-sora tracking-wide"
                      style={{ color: "#A52323" }}
                    >
                      {first.time}
                    </div>
                  </div>

                  {/* Filmes + posters */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div
                      className="grid gap-x-6 gap-y-4"
                      style={{
                        gridTemplateColumns:
                          "minmax(0, 1fr) clamp(80px,10vw,110px)",
                      }}
                    >
                      {group.map((s, fi) => (
                        <Fragment key={fi}>
                          <div className="min-w-0">
                            {fi === 0 && first.mostra && (
                              <div
                                className="font-medium uppercase text-[14px] mb-1 break-words font-sora tracking-wide"
                                style={{ color: "#A52323" }}
                              >
                                {first.mostra}
                              </div>
                            )}

                            <FilmMeta s={s} fi={fi} />
                          </div>

                          <div>
                            {fi > 0 && <div className="h-[30px]" />}

                            {s.poster && (
                              <img
                                src={s.poster}
                                alt={s.title}
                                className="w-full cursor-pointer object-cover"
                                style={{
                                  aspectRatio: "150/220",
                                  maxWidth: 110,
                                  border:
                                    "1px solid rgba(35,33,29,0.3)",
                                  boxShadow:
                                    "4px 4px 10px rgba(35,33,29,0.2)",
                                }}
                                onClick={() =>
                                  onPosterClick(s.poster)
                                }
                              />
                            )}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Cinema */}
                  <div
                    className="shrink-0 pt-1"
                    style={{
                      width: "clamp(150px,20vw,210px)",
                    }}
                  >
                    <div className="font-bold text-sm uppercase leading-tight tracking-wide font-sora">
                      {first.cinema}
                    </div>

                    <CinemaInfoBlock
                      cinema={first.cinema}
                      cinemaMap={cinemaMap}
                    />
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    );
  })}
</section>

      {/* Mobile agenda — vertical editorial layout */}
      <section id="agenda" className="md:hidden px-5 pt-8 pb-6">
        {groups.length === 0 && (
          <p className="text-ink/40 text-[18px]">
            Nenhuma sessão para esta data.
          </p>
        )}

        {dayGroups.map((dg, dgi) => {
          const dayInfo = dayTabs.find((d) => d.day === dg.day);

          return (
            <div key={dg.day} id={`day-${dgi}`} style={{ scrollMarginTop: 144 }}>
              <div className="flex flex-col gap-4 pt-3 mb-0">
                <span
                  className="font-bold font-sora text-[17px] tracking-wide"
                  style={{ color: "#A52323" }}
                >
                  {dayInfo
                    ? `${dayInfo.label} · ${dayInfo.dayNum} DE ${dayInfo.month}`
                    : dg.day}
                </span>

                <div className="dash-ink" />
              </div>

              {/* Sessions */}
              <div className="day-sessions">
                {dg.groups.map((group, gi) => {
                  const first = group[0];

                  return (
                    <Fragment key={gi}>
                      {gi > 0 && <div className="dash-ink" />}

                      <div className="mobile-session">
                        {/* Session header: time + mostra */}
                        <div className="session-mobile-header pb-2.5">
                          <div
                            className="text-[22px] font-bold font-sora tracking-wide"
                            style={{ color: "#A52323" }}
                          >
                            {first.time}
                          </div>

                          {first.mostra && (
                            <div
                              className="text-[12px] font-medium uppercase tracking-wide text-right font-sora leading-snug"
                              style={{
                                color: "#A52323",
                                maxWidth: "55%",
                              }}
                            >
                              {first.mostra}
                            </div>
                          )}
                        </div>

                        {/* Films */}
                        <div className="mobile-film-list">
                          {group.map((s, fi) => {
                            const isLast = fi === group.length - 1;

                            return (
                              <div key={fi} className="mobile-film-item">
                                <div
                                  className={`mobile-film-row ${
                                    !s.poster ? "no-poster" : ""
                                  }`}
                                  style={
                                    isLast && s.poster
                                      ? { gridTemplateRows: "auto auto" }
                                      : {}
                                  }
                                >
                                  <div
                                    style={
                                      isLast && s.poster
                                        ? {
                                            gridColumn: 1,
                                            gridRow: 1,
                                          }
                                        : {}
                                    }
                                  >
                                    <div
                                      className="font-bold leading-snug font-sora break-words"
                                      style={{
                                        fontSize: "clamp(15px,4.5vw,18px)",
                                      }}
                                    >
                                      {s.title}
                                      {s.year > 0 ? ` (${s.year})` : ""}
                                    </div>

                                    {s.originalTitle &&
                                      s.originalTitle !== s.title &&
                                      !s.originalTitle
                                        .toLowerCase()
                                        .includes(s.title.toLowerCase()) && (
                                        <div
                                          className="text-sm italic mt-0.5 leading-snug"
                                          style={{ color: "#4A4742" }}
                                        >
                                          {s.originalTitle}
                                        </div>
                                      )}

                                    {s.director && (
                                      <div className="text-sm mt-1.5 leading-snug">
                                        Direção: {s.director}
                                      </div>
                                    )}

                                    <div className="text-sm mt-1 leading-snug">
                                      {s.country}
                                      {s.country && s.duration > 0 ? ", " : ""}
                                      {s.duration > 0
                                        ? `${s.duration}'`
                                        : ""}
                                    </div>
                                  </div>

                                  {s.poster && (
                                    <img
                                      src={s.poster}
                                      alt={s.title}
                                      className="mobile-film-poster cursor-pointer"
                                      style={{
                                        boxShadow:
                                          "4px 4px 10px rgba(35,33,29,0.3)",
                                        gridColumn: 2,
                                        ...(isLast
                                          ? { gridRow: "1 / -1" }
                                          : {}),
                                      }}
                                      onClick={() =>
                                        onPosterClick(s.poster)
                                      }
                                    />
                                  )}

                                {isLast && (
                                  <div
                                    className="mobile-cinema-inline"
                                    style={
                                      s.poster
                                        ? {
                                            gridColumn: 1,
                                            gridRow: 2,
                                          }
                                        : undefined
                                    }
                                  >
                                    <div
                                      className="mobile-cinema-divider"
                                      aria-hidden="true"
                                    />

                                    <div className="font-bold text-[13px] uppercase tracking-wide font-sora pt-2">
                                      {first.cinema}
                                    </div>

                                    <CinemaInfoBlock
                                      cinema={first.cinema}
                                      cinemaMap={cinemaMap}
                                    />
                                  </div>
                                )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
