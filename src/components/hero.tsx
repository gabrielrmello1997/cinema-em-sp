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
    <div className="relative bg-ink text-bg" style={{ height: "clamp(220px,20vw,317px)" }}>
      <div className="px-12 pb-0 h-full flex flex-col justify-start" style={{ paddingTop: "clamp(32px,4vw,72px)" }}>
        <h1 className="font-sora leading-none font-bold mt-4" style={{ color: "#F3F2ED", fontSize: "clamp(32px,3.5vw,54px)" }}>
          Cinema em São Paulo
        </h1>
        <p className="mt-10" style={{ color: "#F3F2ED", opacity: 0.7, fontSize: "clamp(14px,1.3vw,20px)" }}>
          Acompanhe a programação de cineclubes<br />
          e cinemas pela cidade. Atualizada três vezes por semana.
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

      <div className="absolute" style={{ right: "clamp(16px,3vw,36px)", top: "calc(clamp(220px,20vw,317px) - min(45px, 2.5vw))", width: "clamp(280px,25vw,446px)" }}>
        <PoltronasSVG />
      </div>
    </div>
  );
}
