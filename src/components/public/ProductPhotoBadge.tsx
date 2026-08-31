"use client";

import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { csvList } from "@/lib/utils";

interface ProductPhotoBadgeProps {
  photoUrls: string | null;
  productName: string;
  variety?: string | null;
  originRegion?: string | null;
  originCountry: string;
}

function NepalFlagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 130" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 6 L92 40 L28 56 L92 118 L6 124 Z"
        fill="#DC143C"
        stroke="#003893"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Moon on the upper pennant */}
      <path d="M28 22 a8 8 0 1 0 10 12 a6 6 0 1 1 -10 -12 Z" fill="#FFFFFF" />
      {/* Sun on the lower pennant */}
      <circle cx="34" cy="92" r="7" fill="#FFFFFF" />
    </svg>
  );
}

export function ProductPhotoBadge({
  photoUrls,
  productName,
  variety,
  originRegion,
  originCountry,
}: ProductPhotoBadgeProps) {
  const photos = csvList(photoUrls ?? "");
  const [active, setActive] = useState(0);

  return (
    <div
      className={`relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl ${
        photos.length === 0 ? "bg-pine-50" : ""
      }`}
    >
      {photos.length > 0 && (
        <img src={photos[active]} alt={productName} className="h-full w-full object-cover" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

      {originCountry?.toLowerCase() === "nepal" && (
        <div className="absolute right-4 top-4 h-9 w-9 drop-shadow-md">
          <NepalFlagIcon className="h-full w-full" />
        </div>
      )}

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActive((a) => (a - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-paper/80 p-1.5 text-ink backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setActive((a) => (a + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-paper/80 p-1.5 text-ink backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 gap-1">
            {photos.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-paper" : "bg-paper/40"}`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-paper/85">
          <MapPin className="h-3 w-3" />
          {originRegion ? `${originRegion}, ` : ""}
          {originCountry}
        </p>
        <h1 className="font-display text-3xl leading-tight text-paper">{productName}</h1>
        {variety && <p className="font-display italic text-paper/75">{variety}</p>}
      </div>
    </div>
  );
}