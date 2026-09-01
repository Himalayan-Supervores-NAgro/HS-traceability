"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { csvList } from "@/lib/utils";
import { LightboxOverlay } from "@/components/public/Lightbox";

export function ProducerPhotoGallery({
  photoUrls,
  alt,
}: {
  photoUrls: string | null;
  alt: string;
}) {
  const photos = csvList(photoUrls ?? "");
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="group absolute inset-0 h-full w-full cursor-zoom-in"
        >
          <img src={photos[active]} alt={alt} className="h-full w-full object-cover" />
          <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/85 text-ink opacity-0 shadow transition group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" />
          </span>
        </button>

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
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === active ? "bg-paper" : "bg-paper/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && (
        <LightboxOverlay src={photos[active]} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
}