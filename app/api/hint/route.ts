export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { rateLimit } from "@/lib/rate-limit";
import { sanitizeInput } from "@/lib/sanitize";
import { validateCsrf } from "@/lib/csrf";

export const POST = async (req: Request) => {
    if (!validateCsrf(req)) {
        return new NextResponse("Forbidden", { status: 403 });
    }
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(`hint:${ip}`, 10, 60000)) {
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

    const { question, options, language } = await req.json();
    const sanitizedQuestion = sanitizeInput(question);
    const sanitizedLanguage = sanitizeInput(language);
    const sanitizedOptions = options.map((o: any) => ({
        text: sanitizeInput(o.text),
        correct: o.correct,
    }));

    const correctOption = options.find((o: any) => o.correct);

    const prompt = `You are a helpful language learning assistant for ${language}.
A student got this question wrong: "${question}"
The correct answer is: "${correctOption?.text}"
The other options were: ${options.filter((o: any) => !o.correct).map((o: any) => o.text).join(", ")}

Give a brief, clear translation breakdown explaining why "${correctOption?.text}" is correct.
Focus on word-by-word translation and any relevant grammar note. Keep it under 4 sentences.`;

    const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    parts: [{ text: prompt }],
                },
            ],
        }),
    }
);

    const data = await response.json();
    console.log("Gemini response:", JSON.stringify(data, null, 2));
    const hint = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No hint available.";

    return NextResponse.json({ hint });
};