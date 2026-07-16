import PoltronasSVG from "@/components/poltronas-svg";

export default function CtaSection() {
  return (
    <section className="relative bg-ink text-white overflow-visible max-lg:h-auto" style={{ height: "clamp(220px,20vw,317px)" }}>
      <div className="px-12 max-lg:px-5 md:px-8 flex gap-0 h-full max-lg:h-auto max-lg:flex-col" style={{ paddingTop: "clamp(32px,4vw,56px)", paddingBottom: "clamp(32px,4vw,56px)" }}>
        <div className="shrink-0 max-lg:w-full" style={{ width: "clamp(240px,22vw,340px)" }}>
          <h2 className="font-bold leading-tight font-sora tracking-wide" style={{ color: "#F3F2ED", fontSize: "clamp(26px,2.8vw,38px)" }}>
            É programador<br />de cinema?
          </h2>
        </div>

        <div className="w-px max-lg:!w-auto max-lg:!h-px max-lg:!my-4" style={{ marginLeft: "clamp(24px,4vw,60px)", marginRight: "clamp(24px,4vw,60px)", backgroundImage: "repeating-linear-gradient(to bottom, #F3F2ED 0, #F3F2ED 4px, transparent 4px, transparent 6px)" }} />

        <div className="flex-1 max-lg:max-w-none leading-relaxed space-y-2 pt-3" style={{ maxWidth: 600, color: "#F3F2ED", opacity: 0.7, fontSize: "clamp(16px,1.2vw,18px)" }}>
          <p>A ajuda dos programadores é central para o nosso trabalho.</p>
          <p>Se você é programador, curador ou membro de um cineclube, entre em contato conosco e compartilhe a sua programação via email:</p>
           <a href="mailto:cinemaemsaopaulo@gmail.com" className="inline-block font-semibold underline text-[#F3F2ED] hover:text-[#A52323] transition-colors">
            cinemaemsaopaulo@gmail.com
          </a>.
        </div>
      </div>

      <div className="absolute max-lg:hidden" style={{ right: "clamp(16px,3vw,36px)", top: "calc(clamp(220px,20vw,317px) - min(45px, 2.5vw))", width: "clamp(280px,25vw,446px)" }}>
        <PoltronasSVG />
      </div>
    </section>
  );
}
