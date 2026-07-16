"use client";

import {
  useEffect,
  useRef,
  type RefObject,
} from "react";
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
  const desktopPostRef = useRef<HTMLDivElement>(null);
  const mobilePostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPostRef = () => {
      const isDesktop = window.innerWidth >= 1024;

      postRef.current = isDesktop
        ? desktopPostRef.current
        : mobilePostRef.current;
    };

    syncPostRef();

    window.addEventListener("resize", syncPostRef);

    return () => {
      window.removeEventListener("resize", syncPostRef);
    };
  }, [postRef]);

  return (
    <>
      {/* Desktop */}
      <div
        className="relative bg-ink text-bg max-lg:hidden"
        style={{ height: "clamp(220px,20vw,317px)" }}
      >
        <div
          className="px-12 pb-0 h-full flex flex-col justify-start"
          style={{
            paddingTop: "clamp(32px,4vw,72px)",
          }}
        >
          <h1
            className="font-sora leading-none font-bold mt-4 tracking-wide"
            style={{
              color: "#F3F2ED",
              fontSize: "clamp(32px,3.5vw,54px)",
            }}
          >
            Cinema em São Paulo
          </h1>

          <p
            className="mt-10"
            style={{
              color: "#F3F2ED",
              opacity: 0.7,
              fontSize: "clamp(14px,1.3vw,20px)",
            }}
          >
            Acompanhe a programação de cineclubes
            <br />
            e cinemas pela cidade. Atualizada toda semana.
          </p>
        </div>

        <PostSelector
          postOpen={postOpen}
          postRef={desktopPostRef}
          currentPostTitle={currentPostTitle}
          feedTitle={feedTitle}
          selectedPost={selectedPost}
          olderPostTitles={olderPostTitles}
          onToggle={onTogglePost}
          onSelectLatest={onSelectLatest}
          onSelectOlder={onSelectOlder}
        />

        <div
          className="absolute"
          style={{
            right: "clamp(16px,3vw,36px)",
            bottom: 0,
            width: "clamp(280px,25vw,446px)",
            transform: "translateY(39.2%)",
          }}
        >
          <PoltronasSVG />
        </div>
      </div>

      {/* Mobile / Tablet */}
      <div
        className="relative bg-ink text-bg lg:hidden px-5 md:px-8"
        style={{
          height: "clamp(245px,80vw,320px)",
        }}
      >
        <div className="h-full flex flex-col justify-start pt-12">
          <h1
            className="font-sora leading-none font-bold tracking-wide"
            style={{
              color: "#F3F2ED",
              fontSize: "clamp(34px,9vw,44px)",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            Cinema em São Paulo
          </h1>

          <p
            className="mt-4 md:mt-6"
            style={{
              color: "#F3F2ED",
              opacity: 0.7,
              fontSize: "clamp(14px,4vw,18px)",
              maxWidth: 320,
            }}
          >
            Acompanhe a programação de cineclubes e cinemas pela cidade.
            Atualizada três vezes por semana.
          </p>

          <div className="mt-6 md:mt-8">
            <PostSelector
              postOpen={postOpen}
              postRef={mobilePostRef}
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

        <div
          className="absolute"
          style={{
            right: "clamp(12px,4vw,24px)",
            bottom: 0,
            width: "clamp(230px,60vw,310px)",
            transform: "translateY(39.2%)",
          }}
        >
          <PoltronasSVG />
        </div>
      </div>
    </>
  );
}