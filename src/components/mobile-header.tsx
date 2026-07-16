"use client";

type Props = {
  menuOpen: boolean;
  onToggle: () => void;
  scrollTo: (id: string) => void;
  onClose: () => void;
};

export default function MobileHeader({
  menuOpen,
  onToggle,
  scrollTo,
  onClose,
}: Props) {
  const handleScroll = (id: string) => {
    onClose();
  
    requestAnimationFrame(() => {
      const element = getVisibleElement(id);
  
      if (!element) return;
  
      const headerHeight = 72;
      const extraSpacing = 16;
      const offset = headerHeight + extraSpacing;
  
      const top =
        element.getBoundingClientRect().top +
        window.scrollY -
        offset;
  
      window.scrollTo({
        top,
        behavior: "smooth",
      });
    });
  };

  function getVisibleElement(id: string): HTMLElement | null {
    const elements = document.querySelectorAll<HTMLElement>(`[id="${id}"]`);
  
    for (const element of elements) {
      if (element.offsetParent !== null) {
        return element;
      }
    }
  
    return null;
  }

  return (
    <header
  className={`lg:hidden sticky top-0 z-50 flex items-center justify-between bg-bg h-[72px] px-6 max-md:px-5 ${
    menuOpen ? "" : "border-b"
  }`}
  style={{ borderColor: "rgba(35,33,29,0.35)" }}
>
  <a href="/">
    <img
      src="/assets/logo-mobile.svg"
      alt="Cinema em São Paulo"
      className="h-11"
    />
  </a>

  <button
    onClick={onToggle}
    className="flex items-center justify-center w-10 h-10 text-[#A52323] hover:text-[#8B1C1C] transition-colors"
  >
    {menuOpen ? (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M15 5L5 15M5 5l10 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
        <path
          d="M1 2h18M1 8h18M1 14h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )}
  </button>

  <div
    className={`
      absolute
      top-full
      left-0
      right-0
      bg-bg
      border-t
      border-b
      z-50
      px-6
      max-md:px-5
      pt-4
      pb-8
      transition-all
      duration-300
      ease-out
      origin-top
      ${
        menuOpen
          ? "opacity-100 translate-y-0 scale-y-100 pointer-events-auto"
          : "opacity-0 -translate-y-2 scale-y-95 pointer-events-none"
      }
    `}
    style={{
      borderColor: "rgba(35,33,29,0.35)",
    }}
  >
        <nav className="flex flex-col gap-6 text-[14px] uppercase font-sora font-medium">
          <button
            onClick={() => handleScroll("agenda")}
            className="text-left hover:text-accent transition-colors cursor-pointer tracking-wide"
          >
            PROGRAMAÇÃO
          </button>

          <button
            onClick={() => handleScroll("textos")}
            className="text-left hover:text-accent transition-colors cursor-pointer tracking-wide"
          >
            TEXTOS
          </button>

          <button
            onClick={() => handleScroll("about")}
            className="text-left hover:text-accent transition-colors cursor-pointer tracking-wide"
          >
            SOBRE
          </button>
        </nav>

        <div className="dash-ink my-6" style={{ width: 100 }} />

        <div className="flex flex-col uppercase font-sora tracking-wide text-[14px]">
          <a
            href="https://cinemaemsp.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:text-accent transition-colors flex items-center gap-2.5 font-medium mb-6"
          >
            <svg
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 fill-[#23211D] group-hover:fill-[#A52323] transition-colors"
            >
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>

            SUBSTACK

            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="w-2 h-2 stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
            >
              <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href="https://instagram.com/cinemaemsp"
            target="_blank"
            rel="noopener noreferrer"
            className="group hover:text-accent transition-colors flex items-center gap-2.5 font-medium mb-6"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                d="M1.167 5.833c0-1.237.492-2.424 1.367-3.3a4.667 4.667 0 013.3-1.366h9.334a4.667 4.667 0 013.3 1.367A4.667 4.667 0 0119.834 5.833v9.334a4.667 4.667 0 01-1.367 3.3 4.667 4.667 0 01-3.3 1.367H5.834a4.667 4.667 0 01-3.3-1.367 4.667 4.667 0 01-1.367-3.3V5.833z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
              />
              <path
                d="M7 10.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
              />
              <path
                d="M15.75 5.25v.012"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
              />
            </svg>

            INSTAGRAM

            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="w-2 h-2 stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
            >
              <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href="mailto:cinemaemsaopaulo@gmail.com"
            className="group hover:text-accent transition-colors flex items-center gap-2.5 font-medium"
          >
            <svg
              width="23"
              height="18"
              viewBox="0 0 23 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.733.822L.846 1.73v14.539l.888.909h19.533l.887-.909V1.73l-.887-.908H1.733zm.888 2.963V15.36h17.758V3.785L11.5 12.045 2.621 3.785zM18.97 2.64H4.03L11.5 9.59l7.47-6.95z"
                className="fill-[#23211D] group-hover:fill-[#A52323] transition-colors"
              />
            </svg>

            E-MAIL

            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="w-2 h-2 stroke-[#23211D] group-hover:stroke-[#A52323] transition-colors"
            >
              <path d="M7.333 0.667L0.667 7.333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M1.333 0.667h6v6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}