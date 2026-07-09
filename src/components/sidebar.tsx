"use client";

import Link from "next/link";

// Cinema seat SVG logo mark
function CinemaLogo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Simple stylized "C" film reel mark */}
      <rect x="2" y="2" width="44" height="44" rx="4" fill="#B18A3A" />
      <text
        x="24"
        y="33"
        textAnchor="middle"
        fontFamily="var(--font-sora), Sora, sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#23211D"
      >
        C
      </text>
    </svg>
  );
}

function ExternalArrow() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
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

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Sticky inner content */}
      <div className="sticky top-0 flex flex-col h-screen overflow-y-auto px-6 py-8 gap-0">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="block" aria-label="Cinema em SP — página inicial">
            <div className="flex flex-col leading-tight">
              <span
                className="font-display font-bold text-sidebar-foreground"
                style={{ fontSize: "13px", letterSpacing: "0.02em" }}
              >
                cinema
              </span>
              <span
                className="font-display font-bold text-gold"
                style={{ fontSize: "13px", letterSpacing: "0.02em" }}
              >
                em sp
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav aria-label="Navegação principal">
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#programacao"
                className="block font-display font-semibold text-sidebar-foreground hover:text-gold transition-colors py-1"
                style={{ fontSize: "13px", letterSpacing: "0.08em" }}
              >
                PROGRAMAÇÃO
              </a>
            </li>
            <li>
              <a
                href="#sobre"
                className="block font-display font-semibold text-muted hover:text-gold transition-colors py-1"
                style={{ fontSize: "13px", letterSpacing: "0.08em" }}
              >
                SOBRE
              </a>
            </li>
          </ul>
        </nav>

        {/* Separator */}
        <div className="border-t border-dashed border-sidebar-foreground/20 my-6" />

        {/* Social links */}
        <nav aria-label="Redes sociais">
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href="https://substack.com/@cinemaemsaopaulo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-display font-semibold text-muted hover:text-sidebar-foreground transition-colors"
                style={{ fontSize: "12px", letterSpacing: "0.08em" }}
              >
                SUBSTACK
                <ExternalArrow />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/cinemaemsaopaulo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-display font-semibold text-muted hover:text-sidebar-foreground transition-colors"
                style={{ fontSize: "12px", letterSpacing: "0.08em" }}
              >
                INSTAGRAM
                <ExternalArrow />
              </a>
            </li>
            <li>
              <a
                href="mailto:cinemaemsaopaulo@gmail.com"
                className="flex items-center gap-2 font-display font-semibold text-muted hover:text-sidebar-foreground transition-colors"
                style={{ fontSize: "12px", letterSpacing: "0.08em" }}
              >
                E-MAIL
                <ExternalArrow />
              </a>
            </li>
          </ul>
        </nav>

        {/* Separator */}
        <div className="border-t border-dashed border-sidebar-foreground/20 my-6" />
      </div>
    </aside>
  );
}
