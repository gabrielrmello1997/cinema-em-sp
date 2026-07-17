"use client";

import { RefObject } from "react";

type Props = {
  postOpen: boolean;
  postRef: RefObject<HTMLDivElement | null>;
  currentPostTitle: string;
  feedTitle: string;
  selectedPost: string;
  olderPostTitles: string[];
  onToggle: () => void;
  onSelectLatest: () => void;
  onSelectOlder: (t: string) => void;
  fullWidth?: boolean;
};

export default function PostSelector({
  postOpen,
  postRef,
  currentPostTitle,
  feedTitle,
  selectedPost,
  olderPostTitles,
  onToggle,
  onSelectLatest,
  onSelectOlder,
  fullWidth,
}: Props) {
  return (
    <div className={fullWidth ? "relative" : "absolute"} style={fullWidth ? {width: "100%", maxWidth: "320px"} : { right: "clamp(16px,3vw,42px)", top: "33%" }} ref={postRef}>
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 tracking-wider"
          style={{
            width: fullWidth ? "100%" : "clamp(280px,30vw,403px)",
            height: "clamp(40px,4vw,55px)",
            fontSize: "clamp(11px,1vw,14px)",
            border: "1px solid #66625D",
            padding: "0 clamp(12px,2vw,20px)",
            color: "#F3F2ED",
          }}
        >
          <img src="/assets/calendar.svg" alt="" className="invert mr-2" style={{ width: "clamp(12px,1.2vw,16px)", height: "clamp(12px,1.2vw,16px)" }} />
          <span className="flex-1 text-left truncate uppercase text-bold font-sora font-bold">{currentPostTitle}</span>
          <svg style={{ width: "clamp(10px,1vw,12px)", height: "clamp(10px,1vw,12px)", flexShrink: 0 }} viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {postOpen && (
          <div className="absolute right-0 mt-1 bg-[#F3F2ED] text-ink shadow-md border border-ink/10 z-20 max-h-60 overflow-y-auto" style={{ width: fullWidth ? "100%" : "clamp(280px,30vw,403px)" }}>
            <div style={{ fontSize: "clamp(9px,0.8vw,11px)" }} className="uppercase tracking-wider font-bold px-4 pt-4 pb-1">
              Programação mais recente
            </div>
            <button
              onClick={onSelectLatest}
              className={`w-full text-left px-4 py-2 uppercase leading-tight ${!selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
              style={{ fontSize: "clamp(11px,1vw,14px)" }}
            >
              {feedTitle}
            </button>
            {olderPostTitles.length > 0 && (
              <>
                <div style={{ fontSize: "clamp(9px,0.8vw,11px)" }} className="uppercase text-bold tracking-wider font-bold px-4 pt-5 pb-1">
                  Programações anteriores
                </div>
                {olderPostTitles.map((t) => (
                  <button
                    key={t}
                    onClick={() => onSelectOlder(t)}
                    className={`w-full text-left px-4 py-2 uppercase leading-tight ${t === selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
                    style={{ fontSize: "clamp(11px,1vw,14px)" }}
                  >
                    {t}
                  </button>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
