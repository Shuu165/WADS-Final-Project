export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { lessonId } = await params;

  const data = await db.lesson.findUnique({
    where: { id: Number(lessonId) },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { lessonId } = await params;
  const body = await req.json();

  const data = await db.lesson.update({
    where: { id: Number(lessonId) },
    data: { ...body },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { lessonId } = await params;

  const data = await db.lesson.delete({
    where: { id: Number(lessonId) },
  });

  return NextResponse.json(data);
};