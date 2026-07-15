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
}: Props) {
  return (
    <div className="absolute" style={{ right: 42, top: 104.5 }} ref={postRef}>
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-sm tracking-wider"
          style={{
            width: 403,
            height: 55,
            border: "1px solid #66625D",
            padding: "0 20px",
            color: "#F3F2ED",
          }}
        >
          <img src="/assets/calendar.svg" alt="" className="w-4 h-4 invert mr-2" />
          <span className="flex-1 text-left truncate uppercase text-bold">{currentPostTitle}</span>
          <svg className="w-3 h-3 shrink-0" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {postOpen && (
          <div className="absolute right-0 mt-1 bg-[#F3F2ED] text-ink shadow-md border border-ink/10 z-20 max-h-60 overflow-y-auto" style={{ width: 403 }}>
            <div className="text-[11px] uppercase tracking-wider px-4 pt-4 pb-1">
              Programação mais recente
            </div>
            <button
              onClick={onSelectLatest}
              className={`w-full text-left px-4 py-2 text-sm uppercase leading-tight ${!selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
            >
              {feedTitle}
            </button>
            {olderPostTitles.length > 0 && (
              <>
                <div className="text-[11px] uppercase text-bold tracking-wider px-4 pt-5 pb-1">
                  Programações anteriores
                </div>
                {olderPostTitles.map((t) => (
                  <button
                    key={t}
                    onClick={() => onSelectOlder(t)}
                    className={`w-full text-left px-4 py-2 text-sm leading-tight uppercase ${t === selectedPost ? "text-accent bg-accent/5" : "text-ink/60 hover:bg-ink/5"}`}
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
