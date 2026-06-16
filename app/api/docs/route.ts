export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "BinLingo API",
        version: "1.0.0",
        description: "API documentation for BinLingo language learning platform",
    },
    servers: [
        {
            url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        },
    ],
    paths: {
        "/api/auth/session": {
            post: {
                tags: ["Auth"],
                summary: "Create session cookie",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    idToken: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Session created" },
                    401: { description: "Unauthorized" },
                },
            },
            delete: {
                tags: ["Auth"],
                summary: "Delete session cookie",
                responses: {
                    200: { description: "Session deleted" },
                },
            },
        },
        "/api/courses": {
            get: {
                tags: ["Courses"],
                summary: "Get all courses",
                responses: {
                    200: { description: "List of courses" },
                    401: { description: "Unauthorized" },
                },
            },
            post: {
                tags: ["Courses"],
                summary: "Create a course",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    imageSrc: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Course created" },
                    401: { description: "Unauthorized" },
                },
            },
        },
        "/api/courses/{courseId}": {
            get: {
                tags: ["Courses"],
                summary: "Get course by ID",
                parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    200: { description: "Course found" },
                    404: { description: "Not found" },
                },
            },
            put: {
                tags: ["Courses"],
                summary: "Update course",
                parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    200: { description: "Course updated" },
                },
            },
            delete: {
                tags: ["Courses"],
                summary: "Delete course",
                parameters: [{ name: "courseId", in: "path", required: true, schema: { type: "integer" } }],
                responses: {
                    200: { description: "Course deleted" },
                },
            },
        },
        "/api/units": {
            get: { tags: ["Units"], summary: "Get all units", responses: { 200: { description: "List of units" } } },
            post: { tags: ["Units"], summary: "Create a unit", responses: { 200: { description: "Unit created" } } },
        },
        "/api/units/{unitId}": {
            get: { tags: ["Units"], summary: "Get unit by ID", parameters: [{ name: "unitId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Unit found" } } },
            put: { tags: ["Units"], summary: "Update unit", parameters: [{ name: "unitId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Unit updated" } } },
            delete: { tags: ["Units"], summary: "Delete unit", parameters: [{ name: "unitId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Unit deleted" } } },
        },
        "/api/lessons": {
            get: { tags: ["Lessons"], summary: "Get all lessons", responses: { 200: { description: "List of lessons" } } },
            post: { tags: ["Lessons"], summary: "Create a lesson", responses: { 200: { description: "Lesson created" } } },
        },
        "/api/lessons/{lessonId}": {
            get: { tags: ["Lessons"], summary: "Get lesson by ID", parameters: [{ name: "lessonId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Lesson found" } } },
            put: { tags: ["Lessons"], summary: "Update lesson", parameters: [{ name: "lessonId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Lesson updated" } } },
            delete: { tags: ["Lessons"], summary: "Delete lesson", parameters: [{ name: "lessonId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Lesson deleted" } } },
        },
        "/api/challenges": {
            get: { tags: ["Challenges"], summary: "Get all challenges", responses: { 200: { description: "List of challenges" } } },
            post: { tags: ["Challenges"], summary: "Create a challenge", responses: { 200: { description: "Challenge created" } } },
        },
        "/api/challenges/{challengeId}": {
            get: { tags: ["Challenges"], summary: "Get challenge by ID", parameters: [{ name: "challengeId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Challenge found" } } },
            put: { tags: ["Challenges"], summary: "Update challenge", parameters: [{ name: "challengeId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Challenge updated" } } },
            delete: { tags: ["Challenges"], summary: "Delete challenge", parameters: [{ name: "challengeId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Challenge deleted" } } },
        },
        "/api/challengeOptions": {
            get: { tags: ["Challenge Options"], summary: "Get all challenge options", responses: { 200: { description: "List of challenge options" } } },
            post: { tags: ["Challenge Options"], summary: "Create a challenge option", responses: { 200: { description: "Challenge option created" } } },
        },
        "/api/challengeOptions/{challengeOptionId}": {
            get: { tags: ["Challenge Options"], summary: "Get challenge option by ID", parameters: [{ name: "challengeOptionId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Challenge option found" } } },
            put: { tags: ["Challenge Options"], summary: "Update challenge option", parameters: [{ name: "challengeOptionId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Challenge option updated" } } },
            delete: { tags: ["Challenge Options"], summary: "Delete challenge option", parameters: [{ name: "challengeOptionId", in: "path", required: true, schema: { type: "integer" } }], responses: { 200: { description: "Challenge option deleted" } } },
        },
        "/api/hint": {
            post: {
                tags: ["AI"],
                summary: "Get AI hint for wrong answer",
                requestBody: {
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    question: { type: "string" },
                                    options: { type: "array", items: { type: "object" } },
                                    language: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Hint generated" },
                    401: { description: "Unauthorized" },
                },
            },
        },
        "/api/webhooks/stripe": {
            post: {
                tags: ["Stripe"],
                summary: "Stripe webhook handler",
                responses: {
                    200: { description: "Webhook processed" },
                    400: { description: "Invalid signature" },
                },
            },
        },
    },
};

export async function GET() {
    return NextResponse.json(swaggerSpec);
}