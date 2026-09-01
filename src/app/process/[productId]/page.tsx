import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { PublicShell } from "@/components/public/PublicShell";
import { ProcessStepPanel } from "@/components/public/ProcessStepPanel";

export const dynamic = "force-dynamic";

export default async function ProcessPage({ params }: { params: { productId: string } }) {
  const [product, settings] = await Promise.all([
    db.product.findUnique({
      where: { id: params.productId },
      include: { processSteps: { orderBy: { order: "asc" } } },
    }),
    db.settings.upsert({ where: { id: "singleton" }, update: {}, create: { id: "singleton" } }),
  ]);

  if (!product || !product.isActive || product.processSteps.length === 0) notFound();

  const backHref = product.gtin ? `/01/${product.gtin}` : `/ref/${product.internalRef}`;

  return (
    <PublicShell companyName={settings.companyName}>
      <div className="p-6">
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-sage hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to {product.name}
        </Link>

        <p className="label-eyebrow">How it&apos;s made</p>
        <h1 className="font-display text-3xl leading-tight text-ink">{product.name}</h1>
        <p className="mt-1 text-sm text-sage">
          {product.processSteps.length} step{product.processSteps.length > 1 ? "s" : ""} from harvest to pack
        </p>

                <div className="mt-4 divide-y-2 divide-dashed divide-pine-100">
          {product.processSteps.map((step, i) => (
            <ProcessStepPanel
              key={step.id}
              index={i}
              title={step.title}
              description={step.description}
              photoUrls={step.photoUrls}
            />
          ))}
        </div>
      </div>
    </PublicShell>
  );
}