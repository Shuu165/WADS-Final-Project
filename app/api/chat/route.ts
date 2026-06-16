export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";
import { validateCsrf } from "@/lib/csrf";

type Message = {
    role: "user" | "model";
    text: string;
};

export const POST = async (req: Request) => {
    if (!validateCsrf(req)) {
        return new NextResponse("Forbidden", { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(`chat:${ip}`, 20, 60000)) {
        return new NextResponse("Too many requests", { status: 429 });
    }
    let userId: string | null = null;

    try {
        const session = (await cookies()).get("session")?.value;
        if (session) {
            const decoded = await adminAuth.verifySessionCookie(session);
            userId = decoded.uid;
        }
    } catch {
        userId = null;
    }

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { message, history, language } = await req.json();
    const sanitizedMessage = sanitizeInput(message);
    const sanitizedLanguage = sanitizeInput(language);
    const sanitizedHistory = history.map((msg: any) => ({
        role: msg.role,
        text: sanitizeInput(msg.text),
    }));

    const systemPrompt = `You are a friendly ${language} language tutor having a conversation with a language learner. 
Follow these rules strictly:
1. Always respond in ${language} first, then provide an English translation in parentheses.
2. Keep responses short and conversational (1-3 sentences).
3. If the user makes a grammar or vocabulary mistake, gently correct it like this: ✗ [their mistake] → ✓ [correction] then continue the conversation naturally.
4. If their ${language} is correct, just continue the conversation naturally without commenting on it.
5. Start with a simple greeting and topic to get the conversation going.`;

    const contents = [
        {
            role: "user",
            parts: [{ text: systemPrompt }],
        },
        {
            role: "model",
            parts: [{ text: "Understood! I'll help practice conversation." }],
        },
        ...history.map((msg: Message) => ({
            role: msg.role,
            parts: [{ text: msg.text }],
        })),
        {
            role: "user",
            parts: [{ text: message }],
        },
    ];

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents }),
        }
    );

    const data = await response.json();
    console.log("Chat Gemini response:", JSON.stringify(data, null, 2));
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't respond.";

    return NextResponse.json({ reply });
};