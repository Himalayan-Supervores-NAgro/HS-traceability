"use client";

import { X } from "lucide-react";

export function LightboxOverlay({
  src,
  alt,
  onClose,
}: {
  src: string | null;
  alt: string;
  onClose: () => void;
}) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-paper/20 p-2 text-paper hover:bg-paper/30"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full rounded-lg object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
