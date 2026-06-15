import { StickyWrapper } from "@/components/sticky-wrapper";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { redirect } from "next/navigation"
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { getUserProgress, getUnits, getCourseProgress, getLessonPercentage, getUserSubscription } from "@/lib/queries";
import { Unit } from "./unit";
import { Quests } from "@/components/quests";
import { Promo } from "@/components/promo";
import { ChatModal } from "@/components/modals/chat-modal"
import { ChatButton } from "./chat-button";

const LearnPage = async () => {
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

    const [ userProgress, units, courseProgress, lessonPercentage, userSubscription ] = await Promise.all ([
        getUserProgress(userId),
        getUnits(userId),
        getCourseProgress(userId),
        getLessonPercentage(userId),
        getUserSubscription(userId),
    ]);    

    if (!userProgress || !userProgress.activeCourseId) redirect("/courses");
    if (!courseProgress) redirect("/course");
    
    const isPro = !!userSubscription?.isActive;

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <ChatModal language={userProgress.activeCourse?.title ?? ""} />
            <StickyWrapper>
                <UserProgress activeCourse={ userProgress.activeCourse! } hearts={ userProgress.hearts } points={userProgress.points} hasActiveSubscription={isPro} />
                {!isPro && (
                    <Promo />
                )}
                <Quests points={userProgress.points} />
                <ChatButton />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse!.title} />
                {units.map((unit) => 
                    <Unit
                        key={unit.id}
                        id={unit.id}
                        order={unit.order}
                        title={unit.title}
                        description={unit.description}
                        lessons={unit.lessons}
                        activeLesson={courseProgress.activeLesson}
                        activeLessonPercentage={lessonPercentage}
                    />    
                )}
            </FeedWrapper>
        </div>
    );
};

export default LearnPage;