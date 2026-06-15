export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/admin";

export const GET = async () => {
    if (!(await isAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await db.challenge.findMany();
    return NextResponse.json(data);
};

export const POST = async (req: Request) => {
    if (!(await isAdmin())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const data = await db.challenge.create({
        data: {
            ...body,
        },
    });

    return NextResponse.json(data);
};