// Cinema seat decorative SVG (same motif as hero, mirrored)
function SeatMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${i * 80}, 0)`}>
          <rect x="8" y="0" width="56" height="44" rx="6" fill="currentColor" />
          <rect x="0" y="30" width="12" height="30" rx="4" fill="currentColor" />
          <rect x="60" y="30" width="12" height="30" rx="4" fill="currentColor" />
          <rect x="10" y="48" width="52" height="22" rx="4" fill="currentColor" />
          <rect x="18" y="12" width="36" height="20" rx="3" fill="currentColor" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

export default function FooterCta() {
  return (
    <>
      {/* Dark CTA section */}
      <section
        className="bg-sidebar text-sidebar-foreground px-12 py-16 relative overflow-hidden"
        aria-labelledby="footer-cta-heading"
      >
        {/* Seat motif top-right */}
        <div className="absolute top-0 right-0 flex" aria-hidden="true">
          <SeatMotif className="text-sidebar-foreground/8 w-[280px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 md:gap-20">
          {/* Left: headline */}
          <div className="md:w-[300px] shrink-0">
            <h2
              id="footer-cta-heading"
              className="font-display font-bold text-sidebar-foreground leading-tight text-balance"
              style={{ fontSize: "40px", lineHeight: 1.1 }}
            >
              É programador de cinema?
            </h2>
          </div>

          {/* Right: contact text */}
          <div className="flex-1 max-w-lg">
            <div
              className="font-sans text-sidebar-foreground/70 leading-relaxed space-y-4"
              style={{ fontSize: "16px", lineHeight: 1.6 }}
            >
              <p>A ajuda dos programadores é central para mantermos o nosso trabalho.</p>
              <p>
                Se você é programador, curador ou membro de um cineclube, por favor, entre em
                contato conosco e compartilhe a sua programação via email:
              </p>
              <a
                href="mailto:cinemaemsaopaulo@gmail.com"
                className="text-gold hover:underline font-semibold"
              >
                cinemaemsaopaulo@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Seat motif bottom */}
        <div className="flex mt-10" aria-hidden="true">
          <SeatMotif className="text-sidebar-foreground/8 w-[320px]" />
        </div>
      </section>

      {/* Footer bar */}
      <footer className="bg-sidebar border-t border-sidebar-foreground/10 px-12 py-4 flex flex-wrap items-center justify-between gap-4">
        <p className="font-sans text-sidebar-foreground/40" style={{ fontSize: "12px" }}>
          &copy; {new Date().getFullYear()} Cinema em São Paulo. Todos os direitos reservados.
        </p>
        <p className="font-sans text-sidebar-foreground/40" style={{ fontSize: "12px" }}>
          Desenvolvido pela{" "}
          <a
            href="https://moddulo.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sidebar-foreground/70 transition-colors underline"
          >
            Moddulo
          </a>
          .
        </p>
      </footer>
    </>
  );
}
