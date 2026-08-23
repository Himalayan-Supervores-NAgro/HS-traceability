import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PublicShell, InfoRow } from "@/components/public/PublicShell";
import { csvList } from "@/lib/utils";
import { MapPin, ShieldCheck, Package } from "lucide-react";
import { LocationMap } from "@/components/public/LocationMap";
import { ProductPhotoBadge } from "@/components/public/ProductPhotoBadge";
import { findProductByInternalRef } from "@/lib/product-lookup";
import { ProductSpecs } from "@/components/public/ProductSpecs";
import { ReferenceFooter } from "@/components/public/ReferenceFooter";

export const dynamic = "force-dynamic";

export default async function ProductRefPublicPage({ params }: { params: { code: string } }) {
  const [product, settings] = await Promise.all([
    findProductByInternalRef(params.code),
    db.settings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } }),
  ]);

  if (!product || !product.isActive) notFound();

  const certifications = csvList(product.certifications);
  const producer = product.producer;
  const latestLot = product.lots[0];

  return (
    <PublicShell companyName={settings.companyName}>
      <div className="p-6">
        {product.photoUrl && (
          <ProductPhotoBadge
            photoUrl={product.photoUrl}
            productName={product.name}
            originRegion={product.originRegion}
            originCountry={product.originCountry}
          />
        )}

        <p className="label-eyebrow">Product</p>
        <h1 className="font-display text-3xl leading-tight text-ink">{product.name}</h1>
        {product.variety && <p className="mt-0.5 font-display italic text-ink/60">{product.variety}</p>}

        <p className="mt-3 flex items-center gap-1.5 text-sm text-sage">
          <MapPin className="h-4 w-4" /> {product.originRegion ? `${product.originRegion}, ` : ""}
          {product.originCountry}
        </p>

        {product.description && (
          <p className="mt-5 text-sm leading-relaxed text-ink/80">{product.description}</p>
        )}

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

        {latestLot && (
          <div className="mt-6 border-t border-line pt-4">
            <p className="label-eyebrow mb-2 flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" /> Batch traceability
            </p>
            <InfoRow label="Latest lot" value={latestLot.lotNumber} />
            <Link
              href={`/ref/${product.internalRef}/lot/${latestLot.lotNumber}`}
              className="mt-3 inline-block rounded-md border border-line px-3 py-2 text-sm text-pine-700 hover:bg-pine-50/60 hover:underline"
            >        <ReferenceFooter gtin={product.gtin} internalRef={product.internalRef} />
              View full batch certificate →
            </Link>
          </div>
        )}
      </div>
    </PublicShell>
  );
}