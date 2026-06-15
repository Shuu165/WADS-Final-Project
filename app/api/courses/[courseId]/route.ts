export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { courseId } = await params;

  const data = await db.course.findUnique({
    where: { id: Number(courseId) },
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { courseId } = await params;
  const body = await req.json();

  const data = await db.course.update({
    where: { id: Number(courseId) },
    data: { ...body },
  });

  return NextResponse.json(data);
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) => {
  if (!await isAdmin()) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  const { courseId } = await params;

  const data = await db.course.delete({
    where: { id: Number(courseId) },
  });

  return NextResponse.json(data);
};