import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { processStepSchema } from "@/lib/validation";
import { requireAdmin, isUnauthorized } from "@/lib/require-admin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (isUnauthorized(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = processStepSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const count = await db.processStep.count({ where: { productId: params.id } });
  const step = await db.processStep.create({
    data: { ...parsed.data, productId: params.id, order: count },
  });
  return NextResponse.json({ step }, { status: 201 });
}