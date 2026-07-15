export default function SobreSection() {
  return (
    <>
      <div className="dash-ink mx-12" />
      <section id="about" className="px-12 py-12">
        <h2 className="text-[18px] uppercase font-semibold mb-8" style={{ color: "#A52323" }}>SOBRE</h2>
        <div className="flex gap-0">
          <div className="shrink-0" style={{ width: "clamp(300px,35vw,480px)" }}>
            <p className="font-bold leading-tight font-sora" style={{ fontSize: "clamp(40px,3.2vw,52px)" }}>
              Não perca<br />mais nenhuma<br />sessão.
            </p>
            <div className="ticket-shape mt-8 inline-block group" style={{ background: "#A52323", padding: "1px" }}>
              <div className="ticket-shape-inner bg-[#A52323] group-hover:bg-[#F3F2ED] transition-colors">
                <a
                  href="https://cinemaemsp.substack.com"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center text-[18px] uppercase font-semibold text-[#F3F2ED] group-hover:text-[#A52323] transition-colors"
                  style={{ width: 260, height: 50 }}
                >
                  ASSINAR NEWSLETTER <svg width="12" height="12" viewBox="0 0 8 8" fill="none" className="inline w-3 h-3 ml-2">
                    <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#F3F2ED] group-hover:stroke-[#A52323] transition-colors"/>
                    <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#F3F2ED] group-hover:stroke-[#A52323] transition-colors"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="dash-ink-v" style={{ marginLeft: "clamp(24px,3vw,48px)", marginRight: "clamp(24px,3vw,48px)" }} />

          <div className="flex-1 leading-relaxed space-y-4" style={{ color: "#23211D", maxWidth: "clamp(280px,32vw,480px)", fontSize: "clamp(16px,1.2vw,18px)" }}>
            <p>Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.</p>
            <p>Organizamos e enviamos por email os horários e principais informações das sessões programadas por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.</p>
            <p>Focamos sempre nos filmes que já não estão mais na sua janela de exibição, mas são programados em sessões especiais.</p>
            <p>Nosso trabalho é feito manualmente a oito mãos.<br /><b>Toda ajuda é bem vinda</b> :)</p>
          </div>
        </div>
      </section>
    </>
  );
}
