"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useAudio, useWindowSize, useMount } from "react-use"
import Confetti from "react-confetti";
import Image from "next/image"

import { reduceHearts, incrementHintsUsed  } from "@/actions/user-progress"
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { ChallengeOption, Challenge, ChallengeProgress } from "@/lib/generated/prisma/client";

import { Header } from "./header"
import { Footer } from "./footer"
import { QuestionBubble } from "./question-bubble";
import { ResultCard } from "./result-card"
import { Challenge as ChallengeComponent } from "./challenge"
import { useHeartsModal } from "@/store/use-hearts-modal"
import { usePracticeModal } from "@/store/use-practice-modal"
import { useHintModal } from "@/store/use-hint-modal"
import { HintModal } from "@/components/modals/hint-modal"

type LessonChallenge = Challenge & {
    completed: boolean;
    challengeOptions: ChallengeOption[];
    challengeProgress: ChallengeProgress[];
};

type Props = {
    initialPercentage: number;
    initialHearts: number;
    initialLessonId: number;
    initialLessonChallenges: LessonChallenge[];
    userSubscription: boolean;
    language: string;
};

export const Quiz = ({ initialPercentage, initialHearts, initialLessonId, initialLessonChallenges, userSubscription, language }: Props ) => {
    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal();
    const { open: openHintModal, setLoading: setHintLoading } = useHintModal();
    const [hintsUsed, setHintsUsed] = useState(0);

    const { width, height } = useWindowSize();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useMount(() => {
        if (initialPercentage === 100) {
            openPracticeModal();
        }
    });

    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true})
    const [
        correctAudio, _i, correctControls
    ] = useAudio({ src: "/correct.wav"})
    const [
        incorrectAudio, _c, incorrectControls
    ] = useAudio({ src: "/incorrect.wav"})
    
    const [pending, startTransition] = useTransition();

    const [lessonId, setLessonId] = useState(initialLessonId);
    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((c) => !c.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });   

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };


    const onSelect = (id: number) => {
        if (status !== "none") return;
        setSelectedOption(id);
    };

    const onHint = async () => {
        if (!challenge) return;

        setHintLoading(true);
        openHintModal("");

        const res = await fetch("/api/hint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question: challenge.question,
                options: options.map((o) => ({ text: o.text, correct: o.correct })),
                language,
            }),
        });

        const data = await res.json();
        setHintLoading(false);
        openHintModal(data.hint);
        setHintsUsed((prev) => prev + 1);
    };    

    const onContinue = () => {
        if (!selectedOption) return;

        if (status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        if (status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correct);
        if (!correctOption) return;

        if(correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        correctControls.play()
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        if (initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5));
                        }
                    })
                    .catch((err) => {
                        toast.error("Something went wrong. Please try again.");
                    });
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if (response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        incorrectControls.play()
                        setStatus("wrong")
                        if (!response?.error && !userSubscription) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch((err) => {
                        console.error("reduceHearts error:", err);
                        toast.error("Something went wrong. Please try again.");
                    });
            });
        }
    };

    if (!challenge) {
        correctControls.pause();
        return (
            <>
                {mounted &&
                <Confetti width={width} height={height}recycle={false} numberOfPieces={500} tweenDuration={10000}/>
                }
                {finishAudio}
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image src="/finish.svg" alt="Finish" className="hidden lg:block" height={100} width={100} />
                    <Image src="/finish.svg" alt="Finish" className="block lg:hidden" height={70} width={70} />
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job!<br />You&apos;ve completed the lesson!
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard variant="points" value={challenges.length * 10} />
                        <ResultCard variant="hearts" value={hearts} />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        );
    }

    const title = challenge.type === "ASSIST"
        ? "Select the correct meaning"
        : challenge.question;

    return (
        <>
            {incorrectAudio}
            {correctAudio}
            <HintModal />
            <Header hearts={hearts} percentage={percentage} hasActiveSubscription={userSubscription} />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question}/>
                            )}
                            <ChallengeComponent options={options} onSelect={onSelect} status={status} selectedOption={selectedOption} disabled={false} type={challenge.type} />
                        </div>
                    </div>
                </div>
            </div>
            <Footer disabled={!selectedOption} status={status} onCheck={onContinue} onHint={onHint} hintsUsed={hintsUsed} isPro={userSubscription}/>
        </>
    );
};