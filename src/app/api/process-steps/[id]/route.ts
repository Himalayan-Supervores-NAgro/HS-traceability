import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { processStepSchema } from "@/lib/validation";
import { requireAdmin, isUnauthorized } from "@/lib/require-admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (isUnauthorized(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = processStepSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const step = await db.processStep.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ step });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (isUnauthorized(admin)) return admin;

  await db.processStep.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}