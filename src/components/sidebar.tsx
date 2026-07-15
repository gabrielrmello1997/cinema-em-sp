"use client";

type Props = {
  scrollTo: (id: string) => void;
};

export default function Sidebar({ scrollTo }: Props) {
  return (
    <aside className="shrink-0 border-r py-0 px-[clamp(16px,2vw,32px)] sticky top-0 self-start min-h-screen" style={{ width: "clamp(140px,14vw,220px)" }}>
      <div className="flex flex-col">
        <a href="/" className="mt-[-16px]">
          <img src="/assets/logo.svg" alt="Cinema em São Paulo" style={{ width: "100%", maxWidth: "32rem" }} />
        </a>
        <div className="dash-ink mb-10" />
        <nav className="flex flex-col uppercase" style={{ fontSize: "clamp(11px,1.1vw,16px)" }}>
          <button onClick={() => scrollTo("agenda")} className="text-left hover:text-accent transition-colors font-semibold mb-8 cursor-pointer">
            PROGRAMAÇÃO
          </button>
          <button onClick={() => scrollTo("about")} className="text-left hover:text-accent transition-colors font-semibold mb-10 cursor-pointer">
            SOBRE
          </button>
        </nav>
        <div className="dash-ink mb-10" />
        <div className="flex flex-col uppercase" style={{ fontSize: "clamp(10px,1vw,14px)" }}>
          <a href="https://cinemaemsp.substack.com" target="_blank" rel="noopener noreferrer" className="group hover:text-accent transition-colors flex items-center gap-2.5 font-semibold mb-8">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-[#23211D] group-hover:fill-[#A52323] transition-colors">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
            </svg>
            SUBSTACK <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
              <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="https://instagram.com/cinemaemsp" target="_blank" rel="noopener noreferrer" className="group hover:text-accent transition-colors flex items-center gap-2.5 font-semibold mb-8">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <g clipPath="url(#insta-clip)">
                <path d="M1.167 5.833c0-1.237.492-2.424 1.367-3.3a4.667 4.667 0 013.3-1.366h9.334a4.667 4.667 0 013.3 1.367A4.667 4.667 0 0119.834 5.833v9.334a4.667 4.667 0 01-1.367 3.3 4.667 4.667 0 01-3.3 1.367H5.834a4.667 4.667 0 01-3.3-1.367 4.667 4.667 0 01-1.367-3.3V5.833z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"/>
                <path d="M7 10.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"/>
                <path d="M15.75 5.25v.012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"/>
              </g>
              <defs>
                <clipPath id="insta-clip"><rect width="21" height="21" fill="white"/></clipPath>
              </defs>
            </svg>
            INSTAGRAM <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
              <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="mailto:cinemaemsaopaulo@gmail.com" className="group hover:text-accent transition-colors flex items-center gap-2.5 font-semibold mb-10">
            <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
              <path fillRule="evenodd" clipRule="evenodd" d="M1.733.822L.846 1.73v14.539l.888.909h19.533l.887-.909V1.73l-.887-.908H1.733zm.888 2.963V15.36h17.758V3.785L11.5 12.045 2.621 3.785zM18.97 2.64H4.03L11.5 9.59l7.47-6.95z" className="fill-[#23211D] group-hover:fill-[#A52323] transition-colors"/>
            </svg>
            E-MAIL <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="w-2 h-2 inline stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors">
              <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
        <div className="dash-ink" />
      </div>
    </aside>
  );
}
