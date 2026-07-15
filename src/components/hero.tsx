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
    <>
      <div className="relative bg-ink text-bg max-lg:hidden" style={{ height: "clamp(220px,20vw,317px)" }}>
        <div className="px-12 pb-0 h-full flex flex-col justify-start" style={{ paddingTop: "clamp(32px,4vw,72px)" }}>
          <h1 className="font-sora leading-none font-bold mt-4 tracking-wide" style={{ color: "#F3F2ED", fontSize: "clamp(32px,3.5vw,54px)" }}>
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

      <div className="relative bg-ink text-bg lg:hidden px-5 md:px-8" style={{ height: "clamp(290px,80vw,320px)" }}>
        <div className="h-full flex flex-col justify-start pt-12 md:pt-12">
          <h1 className="font-sora leading-none font-bold tracking-wide" style={{ color: "#F3F2ED", fontSize: "clamp(36px,10vw,46px)" }}>
            Cinema em São Paulo
          </h1>
          <p className="mt-4 md:mt-6" style={{ color: "#F3F2ED", opacity: 0.7, fontSize: "clamp(14px,4vw,18px)" }}>
            Acompanhe a programação de cineclubes e cinemas pela cidade. Atualizada três vezes por semana.
          </p>
          <div className="mt-6 md:mt-8">
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
              fullWidth
            />
          </div>
        </div>
        <div className="absolute" style={{ right: "clamp(12px,4vw,24px)", top: "calc(clamp(290px,80vw,320px) - min(40px, 6vw))", width: "clamp(180px,50vw,280px)" }}>
          <PoltronasSVG />
        </div>
      </div>
    </>
  );
}
