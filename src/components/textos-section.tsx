"use client";

import { useState, useEffect, useCallback } from "react";

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

  const check = useCallback(() => setShowAll(window.innerWidth >= 1830), []);

  useEffect(() => {
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [check]);

  return (
    <>
      <div className="dash-ink mx-12 max-lg:mx-5 md:mx-8" />
      <section id="textos" className="px-12 pt-12 pb-16 max-lg:px-5 md:px-8">
        <h2 className="text-[18px] uppercase font-medium mb-8 tracking-wide font-sora" style={{ color: "#A52323" }}>TEXTOS</h2>
        <p className="text-[18px] mb-10" style={{ color: "#23211D" }}>
          Veja nossas últimas publicações no Substack
        </p>

        {/* Desktop: flex layout (unchanged) */}
        <div className="max-lg:hidden">
          <div className="flex flex-wrap justify-start gap-8">
            {cards.slice(0, showAll ? 4 : 3).map((c, i) => (
              <div key={i} className="shrink-0 border" style={{ width: "clamp(230px,22vw,354px)", height: "clamp(260px,25vw,392px)", borderColor: "rgba(35,33,29,0.2)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
                <div className="p-4 flex flex-col h-full">
                  <div className="w-full" style={{ height: "clamp(120px,11vw,186px)" }}>
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col pt-4">
                    <h3 className="font-bold font-sora leading-snug" style={{ fontSize: "clamp(15px,1.2vw,18px)" }}>{c.title}</h3>
                    <p className="leading-snug mt-2 flex-1" style={{ color: "#23211D", fontSize: "clamp(12px,1vw,14px)" }}>{c.desc}</p>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-semibold mt-3"
                      style={{ color: "#A52323", fontSize: "clamp(12px,1vw,14px)" }}>
                      Ler no Substack
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="stroke-[#A52323]">
                        <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden md:grid lg:hidden gap-6" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {cards.slice(0, 3).map((c, i) => (
            <div key={i} className="border" style={{ borderColor: "rgba(35,33,29,0.2)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
              <div className="p-4 flex flex-col h-full">
                <div className="w-full" style={{ aspectRatio: "322/186" }}>
                  <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col pt-4">
                  <h3 className="font-bold font-sora leading-snug text-base">{c.title}</h3>
                  <p className="text-sm leading-snug mt-2 flex-1" style={{ color: "#23211D" }}>{c.desc}</p>
                  <a href={c.url} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 font-semibold mt-3 text-sm"
                    style={{ color: "#A52323" }}>
                    Ler no Substack
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="stroke-[#A52323]">
                      <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: 1 column */}
        <div className="md:hidden flex flex-col gap-6">
          {cards.map((c, i) => (
            <div key={i}>
              {i > 0 && <div className="dash-ink mb-6" />}
              <div className="border" style={{ borderColor: "rgba(35,33,29,0.2)", boxShadow: "4px 4px 10px rgba(35,33,29,0.3)" }}>
                <div className="p-4 flex flex-col">
                  <div className="w-full" style={{ aspectRatio: "322/186" }}>
                    <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="pt-4">
                    <h3 className="font-bold font-sora leading-snug text-base">{c.title}</h3>
                    <p className="text-sm leading-snug mt-2" style={{ color: "#23211D" }}>{c.desc}</p>
                    <a href={c.url} target="_blank" rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 font-semibold mt-3 text-sm"
                      style={{ color: "#A52323" }}>
                      Ler no Substack
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="stroke-[#A52323]">
                        <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
