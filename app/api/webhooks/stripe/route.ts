export const dynamic = 'force-dynamic';

import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(`stripe:${ip}`, 20, 60000)) {
        return new NextResponse("Too many requests", { status: 429 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2026-05-27.dahlia",
    });
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (error: any) {
        return new NextResponse(`Webhook error: ${error.message}`, {
            status: 400,
        });
    }

    const session = event.data.object as Stripe.Checkout.Session;

if (event.type === "checkout.session.completed") {
    try {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        const periodEnd = (subscription as any).current_period_end
            ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // fallback: 30 days

        await db.userSubscription.upsert({
            where: { userId: session.metadata.userId },
            create: {
                userId: session.metadata.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            },
            update: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            },
        });

        revalidatePath("/shop");
        revalidatePath("/learn");
        revalidatePath("/lesson");
    } catch (err) {
        console.error("checkout.session.completed error:", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}

if (event.type === "invoice.payment_succeeded") {
    try {
        const invoice = event.data.object as any;
        
        const subscriptionId = invoice.subscription 
            ?? invoice.parent?.subscription_details?.subscription;

        if (!subscriptionId) {
            console.log("No subscription ID found, skipping");
            return new NextResponse(null, { status: 200 });
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const periodEnd = (subscription as any).current_period_end
            ?? Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

        await db.userSubscription.upsert({
            where: { stripeSubscriptionId: subscription.id },
            update: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            },
            create: {
                userId: (subscription as any).metadata?.userId ?? "",
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            },
        });
    } catch (err) {
        console.error("invoice.payment_succeeded error:", err);
        return new NextResponse("Internal error", { status: 500 });
    }
}
    return new NextResponse(null, { status: 200 });
}