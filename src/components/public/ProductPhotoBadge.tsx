import { MapPin } from "lucide-react";

interface ProductPhotoBadgeProps {
  photoUrl: string;
  productName: string;
  variety?: string | null;
  originRegion?: string | null;
  originCountry: string;
}

export function ProductPhotoBadge({
  photoUrl,
  productName,
  variety,
  originRegion,
  originCountry,
}: ProductPhotoBadgeProps) {
  return (
    <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden rounded-xl">
      <img src={photoUrl} alt={productName} className="h-full w-full object-cover" />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

      {/* Export stamp — the site's real function is an export certificate,
          so "verified origin" reads as a customs stamp, not a location pill. */}
      <div className="absolute right-4 top-4 flex h-16 w-16 -rotate-6 flex-col items-center justify-center rounded-full border border-dashed border-paper/70 bg-ink/25 backdrop-blur-sm">
        <p className="font-mono text-[6px] uppercase leading-tight tracking-[0.18em] text-paper">
          Verified
        </p>
        <p className="font-mono text-[6px] uppercase leading-tight tracking-[0.18em] text-paper">
          Origin
        </p>
      </div>

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