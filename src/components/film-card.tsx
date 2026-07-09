import type { Session, CinemaInfo } from "@/lib/substack/programming";
import Image from "next/image";

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

interface FilmCardProps {
  session: Session;
  cinemaInfo?: CinemaInfo;
  showTime?: boolean;
}

export default function FilmCard({ session, cinemaInfo, showTime = true }: FilmCardProps) {
  const meta = [
    session.country,
    session.duration ? `${session.duration}'` : null,
    session.director ? `Direção: ${session.director}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex items-start gap-6 py-5">
      {/* Time */}
      {showTime && (
        <div className="w-16 shrink-0 pt-0.5">
          <span
            className="font-display font-bold text-foreground"
            style={{ fontSize: "20px" }}
          >
            {session.time}
          </span>
        </div>
      )}

      {/* Film info + poster */}
      <div className="flex flex-1 items-start gap-4 min-w-0">
        <div className="flex-1 min-w-0">
          {/* Mostra label */}
          {session.mostra && (
            <p
              className="font-display font-semibold text-gold mb-1 uppercase tracking-wide"
              style={{ fontSize: "11px", letterSpacing: "0.06em" }}
            >
              {session.mostra}
            </p>
          )}

          {/* Title */}
          <h3
            className="font-display font-bold text-foreground leading-tight text-balance"
            style={{ fontSize: "17px" }}
          >
            {session.title}
            {session.year ? (
              <span className="font-normal text-muted" style={{ fontSize: "15px" }}>
                {" "}({session.year})
              </span>
            ) : null}
          </h3>

          {/* Meta */}
          {meta && (
            <p className="mt-1 text-muted font-sans leading-relaxed" style={{ fontSize: "14px" }}>
              {meta}
            </p>
          )}
        </div>

        {/* Poster */}
        {session.poster ? (
          <div className="shrink-0 overflow-hidden rounded" style={{ width: "52px", height: "72px" }}>
            <Image
              src={session.poster}
              alt={`Pôster de ${session.title}`}
              width={52}
              height={72}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="shrink-0 rounded bg-card flex items-center justify-center"
            style={{ width: "52px", height: "72px" }}
            aria-hidden="true"
          >
            <span className="text-muted" style={{ fontSize: "10px" }}>—</span>
          </div>
        )}
      </div>

      {/* Cinema info */}
      <div className="w-52 shrink-0 pt-0.5">
        <p
          className="font-display font-semibold text-foreground uppercase tracking-wide leading-tight"
          style={{ fontSize: "12px", letterSpacing: "0.06em" }}
        >
          {session.cinema}
        </p>
        {cinemaInfo?.address && (
          <p className="mt-0.5 font-sans text-muted leading-snug" style={{ fontSize: "13px" }}>
            {cinemaInfo.address}
          </p>
        )}
        {cinemaInfo?.infoUrl && (
          <a
            href={cinemaInfo.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-1.5 text-gold hover:underline font-sans"
            style={{ fontSize: "13px" }}
          >
            Mais informações
            <ExternalArrow />
          </a>
        )}
      </div>
    </div>
  );
}
