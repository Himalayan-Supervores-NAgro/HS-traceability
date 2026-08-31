"use client";

import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { csvList } from "@/lib/utils";

interface ProductPhotoBadgeProps {
  photoUrls: string | null;
  productName: string;
  nameEn?: string | null;
  variety?: string | null;
  originRegion?: string | null;
  originCountry: string;
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
        {nameEn && <p className="text-sm text-paper/75">{nameEn}</p>}
        {variety && <p className="font-display italic text-paper/75">{variety}</p>}
      </div>
    </div>
  );
}