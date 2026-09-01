"use client";

import { useState } from "react";
import { csvList } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProcessStepPanelProps {
  index: number;
  title: string;
  description?: string | null;
  photoUrls?: string | null;
}

export function ProcessStepPanel({ index, title, description, photoUrls }: ProcessStepPanelProps) {
  const photos = csvList(photoUrls ?? "");
  const [active, setActive] = useState(0);
  const reversed = index % 2 === 1;
  const badgeBg = index % 2 === 0 ? "bg-marigold-500" : "bg-pine-700";
  const tilt = index % 2 === 0 ? "-rotate-2" : "rotate-2";

  return (
    <div
      className={`flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:gap-10 ${
        reversed ? "sm:flex-row-reverse" : ""
      }`}
    >
      <div className="relative w-full flex-shrink-0 sm:w-1/2">
        {/* Polaroid-style frame, slightly tilted for a handmade feel */}
        <div className={`relative rounded-2xl bg-paper p-2.5 pb-6 shadow-lg ${tilt}`}>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-pine-50">
            {photos.length > 0 ? (
              <img src={photos[active]} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-6xl text-pine-200">{index + 1}</span>
              </div>
            )}
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActive((a) => (a - 1 + photos.length) % photos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-1.5 text-ink shadow"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActive((a) => (a + 1) % photos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-paper/90 p-1.5 text-ink shadow"
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
        </div>

        {/* Big, unmistakably visible step number sticker */}
        <div
          className={`absolute -left-5 -top-5 flex h-16 w-16 rotate-6 items-center justify-center rounded-full border-4 border-paper font-display text-2xl text-paper shadow-lg ${badgeBg}`}
        >
          {index + 1}
        </div>
      </div>

      <div className="relative sm:w-1/2">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-marigold-600">
          Step {index + 1}
        </p>
        <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">{title}</h2>
        <span className={`mt-2 block h-1.5 w-16 rounded-full ${badgeBg}`} />
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-ink/75 sm:text-base">{description}</p>
        )}
      </div>
    </div>
  );
}