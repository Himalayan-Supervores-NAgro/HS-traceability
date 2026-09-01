"use client";

import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { csvList } from "@/lib/utils";
import { LightboxOverlay } from "@/components/public/Lightbox";

interface ProductPhotoBadgeProps {
  photoUrls: string | null;
  productName: string;
  nameEn?: string | null;
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
      <path d="M28 22 a8 8 0 1 0 10 12 a6 6 0 1 1 -10 -12 Z" fill="#FFFFFF" />
      <circle cx="34" cy="92" r="7" fill="#FFFFFF" />
    </svg>
  );
}

export function ProductPhotoBadge({
  photoUrls,
  productName,
  nameEn,
  variety,
  originRegion,
  originCountry,
}: ProductPhotoBadgeProps) {
  const photos = csvList(photoUrls ?? "");
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div
        className={`relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl ${
          photos.length === 0 ? "bg-pine-50" : ""
        }`}
      >
        {photos.length > 0 && (
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="group absolute inset-0 h-full w-full cursor-zoom-in"
          >
            <img src={photos[active]} alt={productName} className="h-full w-full object-cover" />
            <span className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/85 text-ink opacity-0 shadow transition group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
            </span>
          </button>
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
          {nameEn && <p className="text-sm text-paper/70">{nameEn}</p>}
          {variety && <p className="font-display italic text-paper/75">{variety}</p>}
        </div>
      </div>

      {lightboxOpen && (
        <LightboxOverlay
          src={photos[active]}
          alt={productName}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
