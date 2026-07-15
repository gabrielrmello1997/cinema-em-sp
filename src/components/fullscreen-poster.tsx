"use client";

type Props = {
  poster: string | null;
  onClose: () => void;
};

export default function FullscreenPoster({ poster, onClose }: Props) {
  if (!poster) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 cursor-pointer"
      onClick={onClose}
    >
      <img
        src={poster}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
