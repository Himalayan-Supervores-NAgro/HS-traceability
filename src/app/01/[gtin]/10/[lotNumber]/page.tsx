import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { PublicShell, InfoRow } from "@/components/public/PublicShell";
import { formatDate } from "@/lib/utils";
import { Package, ArrowLeft } from "lucide-react";
import { JourneyTimeline } from "@/components/public/JourneyTimeline";
import { ReferenceFooter } from "@/components/public/ReferenceFooter";

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
  });

  if (!product || !product.isActive) notFound();

  const lot = await db.lot.findUnique({
    where: { lotNumber: params.lotNumber },
    include: { events: { orderBy: { eventDate: "asc" } } },
  });

  if (!lot || lot.productId !== product.id) notFound();

  const settingsResult = await db.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  return (
    <PublicShell
      companyName={settingsResult.companyName}
      websiteUrl={settingsResult.websiteUrl}
      contactEmail={settingsResult.contactEmail}
      contactPhone={settingsResult.contactPhone}
    >
      <div className="p-6">
        <Link
          href={`/01/${product.gtin}`}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-sage hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {product.name}
        </Link>

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
    </PublicShell>
  );
}
