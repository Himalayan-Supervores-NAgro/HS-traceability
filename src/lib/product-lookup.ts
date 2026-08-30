import { db } from "@/lib/db";

/**
 * Looks up a product by GTIN, tolerating leading-zero variants.
 */
export async function findProductByGtin(raw: string) {
  const stripped = raw.replace(/^0+/, "");
  return db.product.findFirst({
    where: {
      OR: [{ gtin: raw }, { gtin: stripped }, { gtin: raw.padStart(14, "0") }],
    },
    include: {
      producer: true,
      lots: { orderBy: { createdAt: "desc" }, include: { events: { orderBy: { eventDate: "asc" } } } },
      processSteps: { orderBy: { order: "asc" } },
    },
  });
}

/**
 * Looks up a product by its internal reference (products with no GTIN).
 */
export async function findProductByInternalRef(code: string) {
  return db.product.findFirst({
    where: { internalRef: code },
    include: {
      producer: true,
      lots: { orderBy: { createdAt: "desc" }, include: { events: { orderBy: { eventDate: "asc" } } } },
      processSteps: { orderBy: { order: "asc" } },
    },
  });
}