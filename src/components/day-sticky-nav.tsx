"use client";

import { useEffect, useState, useCallback } from "react";

type DayTab = {
  day: string;
  label: string;
  dayNum: number;
  month: string;
  isToday: boolean;
  index: number;
};

type Props = {
  dayTabs: DayTab[];
  activeDayIndex: number;
  canNavigateToPreviousPost: boolean;
  canNavigateToNextPost: boolean;
  onNavigate: (
    direction: "previous" | "next",
    currentDayIndex: number,
  ) => void;
};

const RED = "#A52323";
const RED_DARK = "#8B1C1C";
const NAV_HEIGHT = 44;
const MOBILE_HEADER_HEIGHT = 72;
const NAV_BAND_HEIGHT = 56;

function getVisibleId(id: string): HTMLElement | null {
  const elements = document.querySelectorAll<HTMLElement>(`[id="${id}"]`);

  for (const element of elements) {
    if (element.offsetParent !== null) return element;

    if (
      typeof element.checkVisibility === "function" &&
      element.checkVisibility()
    ) {
      return element;
    }
  }

  return null;
}

export default function DayStickyNav({
  dayTabs,
  activeDayIndex,
  canNavigateToPreviousPost,
  canNavigateToNextPost,
  onNavigate,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [scrollBasedIndex, setScrollBasedIndex] = useState(0);

  const effectiveIndex =
    activeDayIndex >= 0 ? activeDayIndex : scrollBasedIndex;

  const current = dayTabs[effectiveIndex] ?? dayTabs[0];

  const hasPrevious = effectiveIndex > 0;

  const hasNext = effectiveIndex < dayTabs.length - 1;

  useEffect(() => {
    if (activeDayIndex >= 0) {
      setScrollBasedIndex(activeDayIndex);
    } else {
      setScrollBasedIndex(0);
    }
  }, [activeDayIndex, dayTabs]);

  useEffect(() => {
    const triggerTop = MOBILE_HEADER_HEIGHT + NAV_BAND_HEIGHT;

    const check = () => {
      const firstDay = getVisibleId("day-0");
      const agenda = getVisibleId("agenda");

      if (!firstDay || !agenda) {
        setVisible(false);
        return;
      }

      const firstDayTop = firstDay.getBoundingClientRect().top;
      const agendaBottom = agenda.getBoundingClientRect().bottom;

      const hasEnteredAgenda = firstDayTop < triggerTop;
      const hasNotLeftAgenda = agendaBottom > triggerTop;

      setVisible(hasEnteredAgenda && hasNotLeftAgenda);
    };

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    const timer = window.setTimeout(check, 300);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.clearTimeout(timer);
    };
  }, [dayTabs.length]);

  useEffect(() => {
    if (activeDayIndex >= 0) return;

    const elements: Element[] = [];

    for (let index = 0; index < dayTabs.length; index += 1) {
      const element = getVisibleId(`day-${index}`);
      if (element) elements.push(element);
    }

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const index = Number.parseInt(
            entry.target.id.replace("day-", ""),
            10,
          );

          if (!Number.isNaN(index) && index > bestIndex) {
            bestIndex = index;
          }
        }

        if (bestIndex >= 0) {
          setScrollBasedIndex((previousIndex) =>
            previousIndex !== bestIndex ? bestIndex : previousIndex,
          );
        }
      },
      {
        threshold: 0,
        rootMargin: "-128px 0px -65% 0px",
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [dayTabs.length]);

  const goPrevious = useCallback(() => {
    if (!hasPrevious) return;
    onNavigate("previous", effectiveIndex);
  }, [hasPrevious, effectiveIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (!hasNext) return;
    onNavigate("next", effectiveIndex);
  }, [hasNext, effectiveIndex, onNavigate]);

  const goCurrentDayTop = useCallback(() => {
    const element = getVisibleId(`day-${effectiveIndex}`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [effectiveIndex]);

  if (dayTabs.length === 0) return null;

  return (
    <div
      className="fixed left-0 right-0 lg:hidden"
      style={{
        top: `${MOBILE_HEADER_HEIGHT}px`,
        zIndex: 40,
        minHeight: `${NAV_BAND_HEIGHT}px`,
        background: "#F3F2ED",
        borderBottom: "1px dashed rgba(35, 33, 29, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 16px",
        transition: "opacity 0.2s, transform 0.2s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <div
        style={{
          filter: "drop-shadow(0 2px 5px rgba(35,33,29,0.12))",
        }}
      >
        <div
          className="ticket-shape"
          style={{
            background: RED_DARK,
            padding: "1px",
          }}
        >
          <div
            className="ticket-shape-inner"
            style={{ background: RED }}
          >
            <div
              className="flex items-center max-lg:w-[180px] max-[520px]:w-[140px]"
              style={{
                height: NAV_HEIGHT,
                padding: "0 8px",
              }}
            >
              <button
                type="button"
                onClick={goPrevious}
                disabled={!hasPrevious}
                className="flex items-center justify-center shrink-0 h-full transition-opacity"
                style={{
                  width: 16,
                  color: "#F3F2ED",
                  opacity: hasPrevious ? 1 : 0.2,
                  cursor: hasPrevious ? "pointer" : "default",
                }}
                aria-label="Ir para o dia anterior"
              >
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                >
                  <path
                    d="M6 11L1 6L6 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={goCurrentDayTop}
                className="flex flex-col items-center justify-center flex-1 min-w-0"
                aria-label={`Voltar ao início de ${current?.label ?? "dia atual"}`}
              >
                <span
                  className="font-sora font-bold uppercase tracking-wide"
                  style={{
                    fontSize: "clamp(12px,1vw,16px)",
                    color: "#F3F2ED",
                  }}
                >
                  {current?.label ?? ""}
                </span>

                <span
                  className="font-normal uppercase tracking-wide"
                  style={{
                    fontSize: "clamp(12px,1.2vw,18px)",
                    color: "#F3F2ED",
                  }}
                >
                  {current
                    ? `${current.dayNum} ${current.month}`
                    : ""}
                </span>
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={!hasNext}
                className="flex items-center justify-center shrink-0 h-full transition-opacity"
                style={{
                  width: 16,
                  color: "#F3F2ED",
                  opacity: hasNext ? 1 : 0.2,
                  cursor: hasNext ? "pointer" : "default",
                }}
                aria-label="Ir para o próximo dia"
              >
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                >
                  <path
                    d="M1 1L6 6L1 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
