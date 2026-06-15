export const dynamic = "force-dynamic";

import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { getUserProgress, getUserSubscription } from "@/lib/queries";
import { Progress } from "@/components/ui/progress";
import { Promo } from "@/components/promo";

const quests = [
    { title: "Earn 20 XP", value: 20 },
    { title: "Earn 50 XP", value: 50 },
    { title: "Earn 100 XP", value: 100 },
    { title: "Earn 500 XP", value: 500 },
    { title: "Earn 1000 XP", value: 1000 },
];

const QuestsPage = async () => {
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

    const [userProgress, userSubscription] = await Promise.all([
        getUserProgress(userId),
        getUserSubscription(userId),
    ]);

    if (!userProgress || !userProgress.activeCourseId) redirect("/courses");

    const isPro = !!userSubscription?.isActive;

    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse!}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={isPro}
                />
                {!isPro && <Promo />}
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/quests.svg"
                        alt="Quests"
                        height={90}
                        width={90}
                    />
                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Quests
                    </h1>
                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Complete quests by earning points.
                    </p>
                    <ul className="w-full">
                        {quests.map((quest) => {
                            const progress = (userProgress.points / quest.value) * 100;
                            return (
                                <div
                                    className="flex items-center w-full p-4 gap-x-4 border-t-2"
                                    key={quest.title}
                                >
                                    <Image
                                        src="/points.svg"
                                        alt="Points"
                                        width={60}
                                        height={60}
                                    />
                                    <div className="flex flex-col gap-y-2 w-full">
                                        <p className="text-neutral-700 text-xl font-bold">
                                            {quest.title}
                                        </p>
                                        <Progress 
                                            value={progress} 
                                            className="h-3" 
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </ul>
                </div>
            </FeedWrapper>
        </div>
    );
};

export default QuestsPage;