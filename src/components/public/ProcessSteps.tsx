interface ProcessStepItem {
  id: string;
  title: string;
  description?: string | null;
  photoUrl?: string | null;
}

export function ProcessSteps({ steps }: { steps: ProcessStepItem[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-6 border-t border-line pt-4">
      <p className="label-eyebrow mb-3">How it's made</p>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.id} className="flex gap-3">
            {step.photoUrl ? (
              <img
                src={step.photoUrl}
                alt={step.title}
                className="h-16 w-16 flex-shrink-0 rounded-md object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-pine-50 font-display text-sm text-pine-600">
                {i + 1}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-ink">{step.title}</p>
              {step.description && (
                <p className="mt-0.5 text-xs leading-relaxed text-sage">{step.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}