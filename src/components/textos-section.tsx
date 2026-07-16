"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const cards = [
  {
    img: "/d012048f-d4ab-47fa-9a01-574d7c14994d_1083x798.webp",
    title: "Coluna Mensal — Fevereiro",
    desc: "Sobre os cinemas de São Paulo, o esforço para preservar sua memória e a tentativa de olhar a cidade através do cinema.",
    url: "https://cinemaemsp.substack.com/p/coluna-mensal-fevereiro",
  },
  {
    img: "/20fdb46e-c66b-456d-b197-657f4b1646bc_2000x976.webp",
    title: "Coluna Mensal — Novembro",
    desc: "Depois da nossa ausência mês passado, voltamos com um rápido relato sobre os filmes e as batalhas que vimos na 49ª Mostra Internacional de São Paulo.",
    url: "https://cinemaemsp.substack.com/p/coluna-mensal-novembro",
  },
  {
    img: "/e175d1ae-1ad5-4f0f-9213-ff1869b9e660_1280x720.webp",
    title: "Coluna Mensal — Setembro",
    desc: "Uma breve divagação sobre restaurações e um apelo pessoal pelo cinema em baixa qualidade.",
    url: "https://cinemaemsp.substack.com/p/coluna-mensal-setembro",
  },
  {
    img: "/6f6d2c62-7f27-462a-9429-05e973e5a07b_1772x976.webp",
    title: "Uma alteração breve",
    desc: "Nosso funcionamento durante a 49ª Mostra Internacional de Cinema em São Paulo será um pouquinho diferente!",
    url: "https://cinemaemsp.substack.com/p/uma-alteracao-breve",
  },
];

export default function TextosSection() {
  const [showAll, setShowAll] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const dragCurrentX = useRef<number | null>(null);

  const check = useCallback(() => {
    setShowAll(window.innerWidth >= 1830);
  }, []);

  useEffect(() => {
    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [check]);

  const previousCard = useCallback(() => {
    setActiveCard((current) =>
      current === 0 ? cards.length - 1 : current - 1,
    );
  }, []);

  const nextCard = useCallback(() => {
    setActiveCard((current) =>
      current === cards.length - 1 ? 0 : current + 1,
    );
  }, []);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    dragStartX.current = event.clientX;
    dragCurrentX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartX.current === null) return;
    dragCurrentX.current = event.clientX;
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (
      dragStartX.current === null ||
      dragCurrentX.current === null
    ) {
      return;
    }

    const distance = dragCurrentX.current - dragStartX.current;
    const swipeThreshold = 45;

    if (distance <= -swipeThreshold) {
      nextCard();
    } else if (distance >= swipeThreshold) {
      previousCard();
    }

    dragStartX.current = null;
    dragCurrentX.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const active = cards[activeCard];

  return (
    <>
      <div className="dash-ink mx-12 max-lg:mx-5 md:mx-8" />

      <section
        id="textos"
        className="px-12 pt-10 md:pt-12 pb-16 max-lg:px-5 md:px-8"
      >
        <h2
          className="text-[18px] uppercase font-bold mb-8 tracking-wide font-sora"
          style={{ color: "#A52323" }}
        >
          TEXTOS
        </h2>

        <p className="text-[18px] mb-10" style={{ color: "#23211D" }}>
          Veja nossas últimas publicações no Substack
        </p>

        <div className="max-lg:hidden">
          <div
            className="grid gap-8 items-stretch"
            style={{
              gridTemplateColumns: `repeat(${
                showAll ? 4 : 3
              }, minmax(0, 1fr))`,
            }}
          >
            {cards.slice(0, showAll ? 4 : 3).map((c, i) => (
              <article
                key={i}
                className="border h-full"
                style={{
                  borderColor: "rgba(35,33,29,0.2)",
                  boxShadow: "4px 4px 10px rgba(35,33,29,0.3)",
                }}
              >
                <div className="p-4 grid h-full grid-rows-[auto_auto_1fr_auto]">
                  <div
                    className="w-full overflow-hidden"
                    style={{ aspectRatio: "322 / 186" }}
                  >
                    <img
                      src={c.img}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3
                    className="font-bold font-sora leading-snug mt-4"
                    style={{
                      fontSize: "clamp(15px,1.2vw,18px)",
                    }}
                  >
                    {c.title}
                  </h3>

                  <p
                    className="leading-snug mt-2"
                    style={{
                      color: "#23211D",
                      fontSize: "clamp(12px,1vw,14px)",
                    }}
                  >
                    {c.desc}
                  </p>

                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-semibold mt-4 self-end"
                    style={{
                      color: "#A52323",
                      fontSize: "clamp(12px,1vw,14px)",
                    }}
                  >
                    Ler no Substack
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      className="stroke-[#A52323]"
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
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="relative">
            <div
              className="select-none touch-pan-y cursor-grab active:cursor-grabbing"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <article
                key={activeCard}
                className="text-card-enter border"
                style={{
                  borderColor: "rgba(35,33,29,0.2)",
                  boxShadow: "4px 4px 10px rgba(35,33,29,0.3)",
                }}
              >
                <div className="p-4 flex flex-col">
                  <div
                    className="w-full overflow-hidden"
                    style={{ aspectRatio: "322 / 186" }}
                  >
                    <img
                      src={active.img}
                      alt={active.title}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="font-bold font-sora leading-snug text-base">
                      {active.title}
                    </h3>

                    <p
                      className="text-sm leading-snug mt-2"
                      style={{ color: "#23211D" }}
                    >
                      {active.desc}
                    </p>

                    <a
                      href={active.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-semibold mt-3 text-sm"
                      style={{ color: "#A52323" }}
                      onPointerDown={(event) => event.stopPropagation()}
                    >
                      Ler no Substack
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 8 8"
                        fill="none"
                        className="stroke-[#A52323]"
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
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={previousCard}
                aria-label="Texto anterior"
                className="flex h-10 w-10 items-center justify-center text-[#A52323] transition-opacity hover:opacity-65"
              >
                <svg
                  width="7"
                  height="12"
                  viewBox="0 0 7 12"
                  fill="none"
                  style={{ transform: "rotate(180deg)" }}
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

              <div className="flex items-center gap-2">
                {cards.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveCard(index)}
                    aria-label={`Ir para o texto ${index + 1}`}
                    aria-current={
                      activeCard === index ? "true" : undefined
                    }
                    className="h-2 w-2 rounded-full border"
                    style={{
                      borderColor: "#A52323",
                      background:
                        activeCard === index
                          ? "#A52323"
                          : "transparent",
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextCard}
                aria-label="Próximo texto"
                className="flex h-10 w-10 items-center justify-center text-[#A52323] transition-opacity hover:opacity-65"
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
      </section>
    </>
  );
}
