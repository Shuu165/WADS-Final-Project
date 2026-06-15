"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminAuth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { getUserProgress, getUserSubscription } from "@/lib/queries";

export const upsertChallengeProgress = async (challengeId: number) => {
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

    if (!userId) throw new Error("Unauthorized");

    const currentUserProgress = await getUserProgress(userId);
    const userSubscription = await getUserSubscription(userId);
    const isPro = !!userSubscription?.isActive;

    if (!currentUserProgress) throw new Error("User progress not found");

    const challenge = await db.challenge.findFirst({
        where: { id: challengeId },
    });

    if (!challenge) throw new Error("Challenge not found");

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.challengeProgress.findFirst({
        where: {
            userId,
            challengeId,
        },
    });

    const isPractice = !!existingChallengeProgress;

    if (currentUserProgress.hearts === 0 && !isPractice && !isPro) {
        return { error: "hearts" };
    }

    if (isPractice) {
        await db.challengeProgress.update({
            where: { id: existingChallengeProgress.id },
            data: { completed: true },
        });

        await db.userProgress.update({
            where: { userId },
            data: {
                hearts: Math.min(currentUserProgress.hearts + 1, 5)
            },
        });

        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonId}`);
        return;
    }
    
    await db.challengeProgress.create({
        data: {
            challengeId,
            userId,
            completed: true,
        },
    });

    await db.userProgress.update({
        where: { userId },
        data: {
            points: currentUserProgress.points + 10,
        },
    });

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};