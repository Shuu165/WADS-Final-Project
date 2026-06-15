import { UnitBanner } from "./unit-banner"
import { LessonButton } from "./lesson-button"

type Challenge = {
    id: number;
    challengeProgress: {
        completed: boolean;
    }[];
};

type Lesson = {
    id: number;
    title: string;
    completed: boolean;
    challenges: Challenge[];
};

type Props = {
    id: number;
    order: number;
    title: string;
    description: string;
    lessons: Lesson[];
    activeLesson: { id: number } | undefined;
    activeLessonPercentage: number;
};

export const Unit = ({
    id,
    order,
    title,
    description,
    lessons,
    activeLesson,
    activeLessonPercentage,
}: Props) => {
    return (
        <>
            <UnitBanner title={title} description={description} />
            <div className="flex flex-col items-center relative w-full">
                {lessons.map((lesson, index) => {
                    const isCompleted = lesson.completed;
                    const isCurrent = activeLesson?.id === lesson.id;
                    const isLocked = !isCompleted && !isCurrent

                    return (
                        <LessonButton
                            key={lesson.id}
                            id={lesson.id}
                            index={index}
                            totalCount={lessons.length - 1}
                            current={isCurrent}
                            locked={isLocked}
                            percentage={isCurrent ? activeLessonPercentage : isCompleted ? 100 : 0}
                        />
                    );
                })}
            </div>
        </>
    );
};