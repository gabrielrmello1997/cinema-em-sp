"use client";

import { useState, useEffect } from "react";

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
  onDayChange: (dayId: string) => void;
};

const RED = "#A52323";
const RED_DARK = "#8B1C1C";

function getVisibleId(id: string): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>(`[id="${id}"]`);
  for (const el of els) {
    if (el.offsetParent !== null || el.checkVisibility()) return el;
  }
  return null;
}

export default function DayStickyNav({ dayTabs, activeDayIndex, onDayChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [scrollBasedIndex, setScrollBasedIndex] = useState(0);

  const effectiveIndex = activeDayIndex >= 0 ? activeDayIndex : scrollBasedIndex;
  const current = dayTabs[effectiveIndex] ?? dayTabs[0];
  const hasPrev = effectiveIndex > 0;
  const hasNext = effectiveIndex < dayTabs.length - 1;

  useEffect(() => {
    const check = () => {
      const el = getVisibleId("day-0");
      if (el) {
        setVisible(el.getBoundingClientRect().top < 110);
      }
    };
    window.addEventListener("scroll", check, { passive: true });
    const timer = setTimeout(check, 300);
    return () => {
      window.removeEventListener("scroll", check);
      clearTimeout(timer);
    };
  }, [dayTabs.length]);

  useEffect(() => {
    if (activeDayIndex >= 0) return;
    const els: Element[] = [];
    for (let i = 0; i < dayTabs.length; i++) {
      const el = getVisibleId(`day-${i}`);
      if (el) els.push(el);
    }
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = -1;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = parseInt(entry.target.id.replace("day-", ""));
          if (!isNaN(idx) && idx > best) best = idx;
        }
        if (best >= 0) setScrollBasedIndex((prev) => (prev !== best ? best : prev));
      },
      { threshold: 0, rootMargin: "-90px 0px -70% 0px" },
    );

    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, [dayTabs.length, activeDayIndex]);

  const goTo = (index: number) => {
    if (index < 0 || index >= dayTabs.length) return;
    onDayChange(dayTabs[index].day);
    setTimeout(() => {
      const el = getVisibleId("day-0");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 100);
  };

  if (dayTabs.length === 0) return null;

  return (
    <div
      className="fixed left-0 right-0 flex items-center justify-center pointer-events-none"
      style={{
        top: "80px",
        zIndex: 35,
        transition: "opacity 0.2s, transform 0.2s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-8px)",
      }}
    >
      <div
        className="pointer-events-auto"
        style={{ filter: "drop-shadow(2px 2px 6px rgba(35,33,29,0.15))" }}
      >
        <div className="ticket-shape" style={{ background: RED_DARK, padding: "1px" }}>
          <div className="ticket-shape-inner" style={{ background: RED }}>
            <div
              className="flex items-center"
              style={{ width: 140, height: 50, padding: "0 16px" }}
            >
              <button
                onClick={() => goTo(effectiveIndex - 1)}
                disabled={!hasPrev}
                className="flex items-center justify-center shrink-0 h-full transition-opacity"
                style={{
                  width: 22,
                  color: "#F3F2ED",
                  opacity: hasPrev ? 1 : 0.2,
                  cursor: hasPrev ? "pointer" : "default",
                }}
                aria-label="Dia anterior"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
                  <path
                    d="M6 11L1 6L6 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <div className="flex flex-col items-center justify-center flex-1 min-w-0">
                <span
                  className="font-sora font-bold uppercase tracking-wide"
                  style={{ fontSize: "clamp(12px,1vw,16px)", color: "#F3F2ED" }}
                >
                  {current ? current.label : ""}
                </span>
                <span
                  className="font-normal uppercase tracking-wide"
                  style={{ fontSize: "clamp(12px,1.2vw,18px)", color: "#F3F2ED" }}
                >
                  {current ? `${current.dayNum} ${current.month}` : ""}
                </span>
              </div>

              <button
                onClick={() => goTo(effectiveIndex + 1)}
                disabled={!hasNext}
                className="flex items-center justify-center shrink-0 h-full transition-opacity"
                style={{
                  width: 22,
                  color: "#F3F2ED",
                  opacity: hasNext ? 1 : 0.2,
                  cursor: hasNext ? "pointer" : "default",
                }}
                aria-label="Próximo dia"
              >
                <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
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
