function ExternalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="inline-block shrink-0"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function About() {
  return (
    <section
      id="sobre"
      className="bg-background border-t border-border px-12 py-16"
      aria-labelledby="sobre-heading"
    >
      {/* Label */}
      <p
        className="font-display font-semibold text-gold uppercase tracking-widest mb-8"
        style={{ fontSize: "12px", letterSpacing: "0.15em" }}
      >
        SOBRE
      </p>

      <div className="flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Left: headline + CTA */}
        <div className="md:w-[340px] shrink-0">
          <h2
            id="sobre-heading"
            className="font-display font-bold text-foreground leading-tight text-balance"
            style={{ fontSize: "40px", lineHeight: 1.1 }}
          >
            Não perca mais nenhuma sessão.
          </h2>

          <a
            href="https://cinemaemsaopaulo.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-8 border border-gold text-gold hover:bg-gold hover:text-foreground transition-colors px-5 py-2.5 font-display font-semibold uppercase tracking-wide"
            style={{ fontSize: "12px", letterSpacing: "0.1em" }}
          >
            ASSINAR NEWSLETTER
            <ExternalArrow />
          </a>
        </div>

        {/* Right: description text */}
        <div className="flex-1 max-w-xl">
          <div
            className="font-sans text-foreground leading-relaxed space-y-4"
            style={{ fontSize: "16px", lineHeight: 1.6 }}
          >
            <p>
              <strong>Divulgamos a programação das salas de repertório e dos cineclubes da cidade de São Paulo.</strong>
            </p>
            <p>
              Organizamos e enviamos por email os horários e principais informações das sessões programadas
              por salas de cinema como as do Cinesesc, do IMS, do CINUSP, do CCSP e outras.
            </p>
            <p>
              Focamos sempre nos filmes que já não estão mais na sua janela de exibição,
              mas são programados em sessões especiais.
            </p>
            <p>
              Nosso trabalho é feito manualmente a oito mãos.{" "}
              <strong>Toda ajuda é bem vinda. :)</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
