import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PublicShell, InfoRow } from "@/components/public/PublicShell";
import { csvList, formatDate } from "@/lib/utils";
import { MapPin, ShieldCheck, Package } from "lucide-react";
import { JourneyTimeline } from "@/components/public/JourneyTimeline";
import { LocationMap } from "@/components/public/LocationMap";
import { ProductPhotoBadge } from "@/components/public/ProductPhotoBadge";
import { ReferenceFooter } from "@/components/public/ReferenceFooter";
import { ProductSpecs } from "@/components/public/ProductSpecs";
import { ProcessSteps } from "@/components/public/ProcessSteps";

export const dynamic = "force-dynamic";

export default async function LotPublicPage({
  params,
}: {
  params: { gtin: string; lotNumber: string };
}) {
  const raw = params.gtin;
  const stripped = raw.replace(/^0+/, "");

  const product = await db.product.findFirst({
    where: {
      OR: [{ gtin: raw }, { gtin: stripped }, { gtin: raw.padStart(14, "0") }],
    },
    include: { producer: true, processSteps: { orderBy: { order: "asc" } } },
  });

  if (!product || !product.isActive) notFound();

  const lot = await db.lot.findUnique({
    where: { lotNumber: params.lotNumber },
    include: { events: { orderBy: { eventDate: "asc" } } },
  });

  if (!lot || lot.productId !== product.id) notFound();

  const [settingsResult] = await Promise.all([
    db.settings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } }),
  ]);

  const certifications = csvList(product.certifications);
  const producer = product.producer;

  return (
    <PublicShell
  companyName={settingsResult.companyName}
  websiteUrl={settingsResult.domain ? `https://${settingsResult.domain}` : undefined}
>
      <div className="p-6">
        {product.photoUrls ? (
          <ProductPhotoBadge
            photoUrls={product.photoUrls}
            productName={product.name}
            variety={product.variety}
            originRegion={product.originRegion}
            originCountry={product.originCountry}
          />
        ) : (
          <div className="mb-6">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-sage">
              <MapPin className="h-3 w-3" /> {product.originRegion ? `${product.originRegion}, ` : ""}
              {product.originCountry}
            </p>
            <h1 className="font-display text-3xl leading-tight text-ink">{product.name}</h1>
            {product.variety && <p className="font-display italic text-ink/60">{product.variety}</p>}
          </div>
        )}

        {product.description && (
          <p className="mt-5 text-sm leading-relaxed text-ink/80">{product.description}</p>
        )}
        <ProcessSteps steps={product.processSteps} productId={product.id} />
        {certifications.length > 0 && (
          <div className="mt-5">
            <p className="label-eyebrow mb-2">Certification</p>
            <div className="flex flex-wrap gap-2">
              {certifications.map((c) => (
                <span key={c} className="badge bg-pine-50 text-pine-700">
                  <ShieldCheck className="h-3 w-3" /> {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <ProductSpecs
          category={product.category}
          weight={product.weight}
          packagingType={product.packagingType}
          sellingUnit={product.sellingUnit}
        />

        {producer && (
          <div className="mt-6 border-t border-line pt-4">
            <p className="label-eyebrow mb-2">Producer</p>
            <Link
              href={`/producer/${producer.id}`}
              className="block rounded-md border border-line px-3 py-2 text-sm hover:bg-pine-50/60"
            >
              {producer.name} — <span className="text-sage">{producer.farmName}</span>
            </Link>

            {producer.gpsLat != null && producer.gpsLng != null && (
              <LocationMap lat={producer.gpsLat} lng={producer.gpsLng} label={producer.farmName} />
            )}
          </div>
        )}

        <div className="mt-6 border-t border-line pt-4">
          <p className="label-eyebrow mb-2 flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" /> Batch traceability
          </p>
          <InfoRow label="Lot number" value={lot.lotNumber} />
          <InfoRow label="Best before" value={formatDate(lot.expiryDate)} />
          <InfoRow label="Destination" value={lot.destination} />
          <InfoRow
            label="Quantity"
            value={lot.quantity ? `${lot.quantity} ${lot.unit || ""}` : undefined}
          />
          <InfoRow label="Storage conditions" value={lot.storageConditions} />

          <JourneyTimeline events={lot.events} />
          <ReferenceFooter gtin={product.gtin} />
        </div>
      </div>
    </PublicShell>
  );
}