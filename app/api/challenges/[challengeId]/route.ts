export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeId } = await params;

  const data = await db.challenge.findUnique({
    where: { id: Number(challengeId) },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeId } = await params;
  const body = await req.json();

  const data = await db.challenge.update({
    where: { id: Number(challengeId) },
    data: { ...body },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ challengeId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { challengeId } = await params;

  const data = await db.challenge.delete({
    where: { id: Number(challengeId) },
  });

  return NextResponse.json(data);
};