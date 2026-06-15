export const dynamic = "force-dynamic";

import { getLesson, getUserProgress, getUserSubscription } from "@/lib/queries"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { adminAuth } from "@/lib/firebase-admin"
import { Quiz } from "./quiz"

const LessonPage = async () => {
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
        getLesson(userId),
        getUserProgress(userId),
        getUserSubscription(userId),
    ]);

    if (!lesson || !userProgress) redirect("/learn");

    const isPro = !!userSubscription?.isActive;

    const initialPercentage = lesson.challenges.filter((c) => c.completed).length 
        / lesson.challenges.length * 100;
   
    return (
        <Quiz 
            initialLessonId={lesson.id}
            initialLessonChallenges={lesson.challenges}
            initialHearts={userProgress.hearts}
            initialPercentage={initialPercentage}
            userSubscription={isPro ?? false}
            language={userProgress.activeCourse?.title ?? ""}
        />
    )
}

export default LessonPage