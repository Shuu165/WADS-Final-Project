import { adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

const adminIds = [
    "yno2aKlwvce3UZ4JSWyPyxVAK3B2",
];

export const isAdmin = async () => {
    try {
        const session = (await cookies()).get("session")?.value;
        if (!session) return false;

        const decoded = await adminAuth.verifySessionCookie(session);
        return adminIds.indexOf(decoded.uid) !== -1;
    } catch {
        return false;
    }
};