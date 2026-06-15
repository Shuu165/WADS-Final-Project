"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { db } from "@/lib/db";
import { getCourseById, getUserProgress, getUserSubscription } from "@/lib/queries";
import { POINTS_TO_REFILL } from "@/constants";


const getUserId = async (): Promise<string | null> => {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    const decoded = await adminAuth.verifySessionCookie(session);
    return decoded.uid;
  } catch {
    return null;
  }
};

export const upsertUserProgress = async (courseId: number) => {
  const userId = await getUserId();

  if (!userId) throw new Error("Unauthorized");

  const course = await getCourseById(courseId);

  if (!course) throw new Error("Course not found");

  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error("Course is empty");
  }

  const existingUserProgress = await getUserProgress(userId);

  if (existingUserProgress) {
    await db.userProgress.update({
      where: { userId },
      data: {
        activeCourseId: courseId,
      },
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
  }

  await db.userProgress.create({
    data: {
      userId,
      activeCourseId: courseId,
      userName: "User",
      userImageSrc: "/mascot.svg",
      hearts: 5,
      points: 0,
    },
  });

  revalidatePath("/courses");
  revalidatePath("/learn");
  redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
  const userId = await getUserId();

  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress(userId);
  const userSubscription = await getUserSubscription(userId);
  const isPro = !!userSubscription?.isActive;

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

  if (isPractice) return { error: "practice" };

  if (!currentUserProgress) throw new Error("User progress not found");

  if (currentUserProgress.hearts === 0) return { error: "hearts" };

  if (isPro) return;

  await db.userProgress.update({
    where: { userId },
    data: {
      hearts: Math.max(currentUserProgress.hearts - 1, 0),
    },
  });

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
  revalidatePath(`/lesson/${lessonId}`);
};

export const refillHearts = async () => {
  const userId = await getUserId();

  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress(userId);

  if (!currentUserProgress) {throw new Error("User progress not found")};

  if (currentUserProgress.hearts === 5) {throw new Error("Hearts are already full")};

  if (currentUserProgress.points < POINTS_TO_REFILL) {throw new Error("Not enough points")};

  await db.userProgress.update({
    where: { userId },
    data: {
        hearts: 5,
        points: currentUserProgress.points - POINTS_TO_REFILL,
    },
  })

  revalidatePath("/shop");
  revalidatePath("/learn");
  revalidatePath("/quests");
  revalidatePath("/leaderboard");
};

export const incrementHintsUsed = async () => {
  const userId = await getUserId();

  if (!userId) throw new Error("Unauthorized");

  const currentUserProgress = await getUserProgress(userId);

  if (!currentUserProgress) throw new Error("User progress not found");

  revalidatePath("/lesson");
};