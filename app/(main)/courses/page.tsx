export const dynamic = "force-dynamic";

import { getCourses, getUserProgress } from "@/lib/queries";
import { List } from "./list";
import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

const CoursesPage = async () => {
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

  const [courses, userProgress] = await Promise.all([
    getCourses(),
    userId ? getUserProgress(userId) : Promise.resolve(null),
  ]);

  return (
    <div className="h-full max-w-[912px] px-3 mx-auto">
      <h1 className="text-2xl font-bold text-neutral-700">
        Language Courses
      </h1>
      <List
        courses={courses}
        activeCourseId={userProgress?.activeCourseId}
      />
    </div>
  );
};

export default CoursesPage;