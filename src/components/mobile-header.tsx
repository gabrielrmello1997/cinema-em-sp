"use client";

type Props = {
  menuOpen: boolean;
  onToggle: () => void;
  scrollTo: (id: string) => void;
  onClose: () => void;
};

export default function MobileHeader({ menuOpen, onToggle, scrollTo, onClose }: Props) {
  const handleScroll = (id: string) => {
    scrollTo(id);
    onClose();
  };

  return (
    <header className="lg:hidden sticky top-0 z-50 flex items-center justify-between bg-bg border-b h-[72px] px-6 max-md:px-5" style={{ borderColor: "rgba(35,33,29,0.35)" }}>
      <a href="/">
        <img src="/assets/logo.svg" alt="Cinema em São Paulo" className="h-8" />
      </a>
      <button onClick={onToggle} className="flex items-center justify-center w-10 h-10 text-ink">
        {menuOpen ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
            <path d="M1 2h18M1 8h18M1 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-bg border-b z-50 px-6 max-md:px-5 py-8" style={{ borderColor: "rgba(35,33,29,0.35)" }}>
          <nav className="flex flex-col gap-6 text-[18px] uppercase font-sora font-medium">
            <button onClick={() => handleScroll("agenda")} className="text-left hover:text-accent transition-colors cursor-pointer">
              PROGRAMAÇÃO
            </button>
            <button onClick={() => handleScroll("textos")} className="text-left hover:text-accent transition-colors cursor-pointer">
              TEXTOS
            </button>
            <button onClick={() => handleScroll("about")} className="text-left hover:text-accent transition-colors cursor-pointer">
              SOBRE
            </button>
          </nav>
          <div className="dash-ink my-6" />
          <div className="flex flex-col gap-4 text-[16px] uppercase font-sora font-medium">
            <a href="https://cinemaemsp.substack.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
              SUBSTACK
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" className="stroke-current">
                <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="https://instagram.com/cinemaemsp" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors flex items-center gap-2">
              INSTAGRAM
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" className="stroke-current">
                <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="mailto:cinemaemsaopaulo@gmail.com" className="hover:text-accent transition-colors flex items-center gap-2">
              E-MAIL
              <svg width="10" height="10" viewBox="0 0 8 8" fill="none" className="stroke-current">
                <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
