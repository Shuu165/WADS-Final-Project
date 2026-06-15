import { cache } from "react";
import { db } from "@/lib/db";
import { UserProgress, Course, UserSubscription } from "@/lib/generated/prisma/client"


export type UserProgressWithCourse = UserProgress & {
  activeCourse: Course | null;
};

export const getUserProgress = cache(async (userId: string): Promise<UserProgressWithCourse | null> => {
  if (!userId) return null;

  const data = await db.userProgress.findFirst({
    where: { userId },
    include: {
      activeCourse: true,
    },
  });

  return data;
});

export const getUnits = cache(async (userId: string) => {
  const userProgress = await getUserProgress(userId);

  if (!userId || !userProgress?.activeCourseId) return [];

  const data = await db.unit.findMany({
    where: { courseId: userProgress.activeCourseId },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          challenges: {
            orderBy: { order: "asc" },
            include: {
              challengeProgress: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }

      const allCompleted = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((p) => p.completed)
        );
      });

      return { ...lesson, completed: allCompleted };
    });

    return { ...unit, lessons: lessonsWithCompletedStatus };
  });

  return normalizedData;
});  

export const getCourses = cache(async () => {
    const data = await db.course.findMany();
    return data;
})

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.course.findFirst({
    where: { id: courseId },
    include: {
      units: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  return data;
});

export const getCourseProgress = cache(async (userId: string) => {
  const userProgress = await getUserProgress(userId);

  if (!userId || !userProgress?.activeCourseId) return null;

  const unitsInActiveCourse = await db.unit.findMany({
    where: { courseId: userProgress.activeCourseId },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        include: {
          challenges: {
            include: {
              challengeProgress: {
                where: { userId },
              },
            },
          },
        },
      },
    },
  });

  const allLessons = unitsInActiveCourse.flatMap((unit) => unit.lessons);

  const firstUncompletedLesson = allLessons.find((lesson) => {
    if (lesson.challenges.length === 0 )
      return true;

      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some((p) => !p.completed)
        );
      });
    });

  const activeLesson = firstUncompletedLesson || allLessons[0];  

  return {
    activeLesson,
    activeLessonId: activeLesson?.id,
  };
});

export const getLesson = cache(async (userId: string, id?: number) => {
  if (!userId) return null;

  const courseProgress = await getCourseProgress(userId);
  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) return null;

  const data = await db.lesson.findFirst({
    where: { id: lessonId },
    include: {
      challenges: {
        orderBy: { order: "asc" },
        include: {
          challengeOptions: true,
          challengeProgress: {
            where: { userId },
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((p) => p.completed);

    return { ...challenge, completed: !!completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async (userId: string) => {
  const courseProgress = await getCourseProgress(userId);

  if (!courseProgress?.activeLessonId) return 0;

  const lesson = await getLesson(userId, courseProgress.activeLessonId);

  if (!lesson) return 0;

  const completedChallenges = lesson.challenges.filter((c) => c.completed);
  const percentage = Math.round(
    (completedChallenges.length / lesson.challenges.length) * 100
  );

  return percentage;
});

const DAY_IN_MS = 86_400_000;

export const getUserSubscription = cache(async (userId: string) => {
    const data = await db.userSubscription.findUnique({
        where: { userId },
    });

    if (!data) return null;

    const isActive =
        data.stripePriceId &&
        data.stripeCurrentPeriodEnd?.getTime()! > Date.now();

    return { ...data, isActive: !!isActive };
});