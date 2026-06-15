export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { unitId } = await params;

  const data = await db.unit.findUnique({
    where: { id: Number(unitId) },
  });

  if (!data) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { unitId } = await params;
  const body = await req.json();

  const data = await db.unit.update({
    where: { id: Number(unitId) },
    data: { ...body },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { unitId } = await params;

  const data = await db.unit.delete({
    where: { id: Number(unitId) },
  });

  return NextResponse.json(data);
};