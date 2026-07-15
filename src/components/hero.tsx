"use client";

import { RefObject } from "react";
import PostSelector from "@/components/post-selector";
import PoltronasSVG from "@/components/poltronas-svg";

type Props = {
  currentPostTitle: string;
  feedTitle: string;
  selectedPost: string;
  olderPostTitles: string[];
  postOpen: boolean;
  postRef: RefObject<HTMLDivElement | null>;
  onTogglePost: () => void;
  onSelectLatest: () => void;
  onSelectOlder: (t: string) => void;
};

export default function Hero({
  currentPostTitle,
  feedTitle,
  selectedPost,
  olderPostTitles,
  postOpen,
  postRef,
  onTogglePost,
  onSelectLatest,
  onSelectOlder,
}: Props) {
  return (
    <div className="relative bg-ink text-bg" style={{ height: 317 }}>
      <div className="px-12 pt-18 pb-0 h-full flex flex-col justify-start">
        <h1 className="font-sora text-[54px] leading-none font-bold mt-4" style={{ color: "#F3F2ED" }}>
          Cinema em São Paulo
        </h1>
        <p className="mt-10 text-[20px]" style={{ color: "#F3F2ED", opacity: 0.7 }}>
          Acompanhe a programação de cineclubes<br />
          e cinemas pela cidade.
        </p>
      </div>

      <PostSelector
        postOpen={postOpen}
        postRef={postRef}
        currentPostTitle={currentPostTitle}
        feedTitle={feedTitle}
        selectedPost={selectedPost}
        olderPostTitles={olderPostTitles}
        onToggle={onTogglePost}
        onSelectLatest={onSelectLatest}
        onSelectOlder={onSelectOlder}
      />

      <div className="absolute" style={{ right: 42, top: 271, width: 446, height: 74 }}>
        <PoltronasSVG />
      </div>
    </div>
  );
}
