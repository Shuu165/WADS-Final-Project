export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { getLesson, getUserProgress, getUserSubscription } from "@/lib/queries";
import { Quiz } from "../quiz";

type Props = {
    params: Promise<{
        lessonId: number;
    }>;
};

const LessonIdPage = async ({ params }: Props) => {
    const { lessonId } = await params;

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

    if (!userId) redirect("/login");

    const [lesson, userProgress, userSubscription] = await Promise.all([
        getLesson(userId, Number(lessonId)),
        getUserProgress(userId),
        getUserSubscription(userId),
    ]);

    if (!lesson || !userProgress) redirect("/learn");

    const isPro = !!userSubscription?.isActive;

    const initialPercentage = lesson.challenges
        .filter((challenge) => challenge.completed)
        .length / lesson.challenges.length * 100;

    return (
        <Quiz
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubscription={isPro}
            language={userProgress.activeCourse?.title ?? ""}
        />
    );
};

export default LessonIdPage;