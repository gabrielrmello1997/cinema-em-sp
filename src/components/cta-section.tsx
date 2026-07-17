import PoltronasSVG from "@/components/poltronas-svg";

export default function CtaSection() {
  return (
    <section
      className="relative bg-ink text-white overflow-visible lg:h-[clamp(220px,20vw,260px)]"
    >
      <div
        className="
          px-5
          md:px-8
          lg:px-12
          flex
          gap-0
          h-full
          max-lg:h-auto
          max-lg:flex-col
          max-lg:pb-36
        "
        style={{
          paddingTop: "clamp(32px,4vw,56px)",
          paddingBottom: "clamp(72px,8vw,120px)",
        }}
      >
        <div
          className="shrink-0 max-lg:w-full"
          style={{ width: "clamp(260px,22vw,340px)" }}
        >
          <h2
            className="font-bold leading-tight font-sora tracking-wide"
            style={{
              color: "#F3F2ED",
              fontSize: "clamp(36px,2.8vw,42px)",
            }}
          >
            É programador
            <br />
            de cinema?
          </h2>
        </div>

        <div
          className="w-px max-lg:hidden"
          style={{
            marginLeft: "clamp(24px,4vw,60px)",
            marginRight: "clamp(24px,4vw,60px)",
            paddingBottom: "140px",
            backgroundImage:
              "repeating-linear-gradient(to bottom, #F3F2ED 0, #F3F2ED 4px, transparent 4px, transparent 6px)",
          }}
        />

        <div
          className="
            flex-1
            leading-relaxed
            space-y-2
            pt-8
            lg:pt-1
            pr-10
            max-w-[500px]
            md:max-w-[550px]
            lg:max-w-[600px]
          "
          style={{
            color: "#F3F2ED",
            opacity: 0.7,
            fontSize: "clamp(16px,1.2vw,18px)",
          }}
        >
          <p>
            A ajuda dos programadores é central para o nosso trabalho.
          </p>

          <p>
            Se você é programador, curador ou membro de um cineclube,
            entre em contato conosco e compartilhe a sua programação via
            email:
          </p>

          <a
            href="mailto:cinemaemsaopaulo@gmail.com"
            className="inline-block font-semibold underline text-[#F3F2ED] hover:text-[#A52323] transition-colors"
          >
            cinemaemsaopaulo@gmail.com
          </a>
          .
        </div>
      </div>

      {/* Poltronas — desktop */}
      <div
        className="absolute max-lg:hidden"
        style={{
          right: "clamp(16px,3vw,36px)",
          bottom: 0,
          width: "clamp(280px,25vw,446px)",
          transform: "translateY(39.2%)",
        }}
      >
        <PoltronasSVG />
      </div>

      {/* Poltronas — tablet e mobile */}
      <div
        className="absolute lg:hidden"
        style={{
          right: "clamp(12px,4vw,24px)",
          bottom: 0,
          width: "clamp(230px,60vw,310px)",
          transform: "translateY(39.2%)",
        }}
      >
        <PoltronasSVG />
      </div>
    </section>
  );
}