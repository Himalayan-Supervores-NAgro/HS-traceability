interface ProcessStepItem {
  id: string;
  title: string;
  description?: string | null;
  photoUrl?: string | null;
}

export function ProcessSteps({ steps }: { steps: ProcessStepItem[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-6 border-t border-line pt-5">
      <p className="label-eyebrow mb-3">Processing steps</p>

      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className="w-[72%] flex-shrink-0 snap-start sm:w-[45%]"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-pine-50">
              {step.photoUrl ? (
                <img
                  src={step.photoUrl}
                  alt={step.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-6xl text-pine-200">{i + 1}</span>
                </div>
              )}

              {/* Step number, always visible even with a photo */}
              <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 font-display text-sm text-ink backdrop-blur-sm">
                {i + 1}
              </div>
            </div>

            <p className="mt-2.5 font-display text-base leading-tight text-ink">{step.title}</p>
            {step.description && (
              <p className="mt-1 text-xs leading-relaxed text-sage">{step.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}