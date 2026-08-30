import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { csvList } from "@/lib/utils";

interface ProcessStepItem {
  id: string;
  photoUrls?: string | null;
}

export function ProcessSteps({
  steps,
  productId,
}: {
  steps: ProcessStepItem[];
  productId: string;
}) {
  if (!steps || steps.length === 0) return null;

  const previewPhotos = steps
    .map((s) => csvList(s.photoUrls ?? "")[0])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="mt-6 border-t border-line pt-5">
      <Link
        href={`/process/${productId}`}
        className="flex items-center justify-between rounded-lg border border-line px-4 py-3 transition hover:bg-pine-50/50"
      >
        <div>
          <p className="label-eyebrow mb-1">Processing steps</p>
          <p className="text-sm text-ink">
            {steps.length} step{steps.length > 1 ? "s" : ""}, from harvest to pack
          </p>
        </div>
        <div className="flex items-center gap-2">
          {previewPhotos.length > 0 && (
            <div className="flex -space-x-2">
              {previewPhotos.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-paper object-cover"
                />
              ))}
            </div>
          )}
          <ArrowRight className="h-4 w-4 text-pine-700" />
        </div>
      </Link>
    </div>
  );
}