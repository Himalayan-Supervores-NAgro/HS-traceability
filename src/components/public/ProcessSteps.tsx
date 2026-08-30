"use client";

import { useState } from "react";
import { csvList } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProcessStepItem {
  id: string;
  title: string;
  description?: string | null;
  photoUrls?: string | null;
}

function StepPhoto({ photos, title, index }: { photos: string[]; title: string; index: number }) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-pine-50">
      {photos.length > 0 ? (
        <img src={photos[active]} alt={title} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="font-display text-6xl text-pine-200">{index + 1}</span>
        </div>
      )}

      <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 font-display text-sm text-ink backdrop-blur-sm">
        {index + 1}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActive((a) => (a - 1 + photos.length) % photos.length)}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-paper/80 p-1 text-ink backdrop-blur-sm"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActive((a) => (a + 1) % photos.length)}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-paper/80 p-1 text-ink backdrop-blur-sm"
          >
            <ChevronRight className="h-3.5 w-3.5" />
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
  );
}

export function ProcessSteps({ steps }: { steps: ProcessStepItem[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="label-eyebrow mb-3">Processing steps</p>

      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
        {steps.map((step, i) => {
          const photos = csvList(step.photoUrls ?? "");
          return (
            <div key={step.id} className="w-[72%] flex-shrink-0 snap-start sm:w-[45%]">
              <StepPhoto photos={photos} title={step.title} index={i} />
              <p className="mt-2.5 font-display text-base leading-tight text-ink">{step.title}</p>
              {step.description && (
                <p className="mt-1 text-xs leading-relaxed text-sage">{step.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}