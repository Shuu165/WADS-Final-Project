"use server";

import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { getUserSubscription } from "@/lib/queries";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
});

const absoluteUrl = (path: string) => {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
};

const returnUrl = absoluteUrl("/shop");

export const createStripeUrl = async () => {
    let userId: string | null = null;
    let userEmail: string | null = null;

    try {
        const session = (await cookies()).get("session")?.value;
        if (session) {
            const decoded = await adminAuth.verifySessionCookie(session);
            userId = decoded.uid;
            userEmail = decoded.email ?? null;
        }
    } catch {
        userId = null;
    }

    if (!userId) throw new Error("Unauthorized");

    const userSubscription = await getUserSubscription(userId);

    if (userSubscription && userSubscription.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: userSubscription.stripeCustomerId,
            return_url: returnUrl,
        });
        return { data: stripeSession.url };
    }

    const stripeSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: userEmail ?? undefined,
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: "SGD",
                    product_data: {
                        name: "BinLingo Pro",
                        description: "Unlimited Hearts",
                    },
                    unit_amount: 999,
                    recurring: {
                        interval: "month",
                    },
                },
            },
        ],
        metadata: {
            userId,
        },
        success_url: returnUrl,
        cancel_url: returnUrl,
    });

    return { data: stripeSession.url };
};