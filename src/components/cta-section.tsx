import PoltronasSVG from "@/components/poltronas-svg";

export default function CtaSection() {
  return (
    <section className="relative bg-ink text-white overflow-visible" style={{ height: 280 }}>
      <div className="px-12 py-12 flex gap-0 h-full">
        <div className="w-[340px] shrink-0">
          <h2 className="text-[38px] font-bold leading-[64px] font-sora" style={{ color: "#F3F2ED" }}>
            É programador<br />de cinema?
          </h2>
        </div>

        <div className="w-px mx-[60px]" style={{ backgroundImage: "repeating-linear-gradient(to bottom, #F3F2ED 0, #F3F2ED 4px, transparent 4px, transparent 6px)" }} />

        <div className="flex-1 max-w-[600px] text-[18px] leading-relaxed space-y-2 pt-3" style={{ color: "#F3F2ED", opacity: 0.7 }}>
          <p>A ajuda dos programadores é central para mantermos o nosso trabalho.</p>
          <p>Se você é programador, curador ou membro de um cineclube, por favor, entre em contato conosco e compartilhe a sua programação via email:
          <a href="mailto:cinemaemsaopaulo@gmail.com" className="inline-block font-semibold underline text-[#F3F2ED] hover:text-[#A52323] transition-colors">
            cinemaemsaopaulo@gmail.com
          </a>.</p>
        </div>
      </div>

      <div className="absolute" style={{ right: 42, top: 235, width: 446, height: 74 }}>
        <PoltronasSVG />
      </div>
    </section>
  );
}
