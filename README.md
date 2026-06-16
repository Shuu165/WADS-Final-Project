# Final Project – Web Application Development and Security

**Course Code:** COMP6703001  
**Course Name:** Web Application Development and Security  
**Institution:** BINUS University International

---

## 1. Project Information

**Project Title:** BinLingo

**Project Domain:** Language Learning Web Application

**Class:** L4AC

**Group Members:**

| Name | Student ID | Role | GitHub Username |
|------|-----------|------|-----------------|
| Farrell Raffelino Sunarman | 2802503476 | Full-Stack Developer | Shuu165 |
| Muhammad Ryan Ismail Putra | 2802522733 | Full-Stack Developer | muhammadRyanismail |

---

## 2. Instructor & Repository Access

This repository must be shared with:

- **Instructor:** Ida Bagus Kerthyayana Manuaba
  - Email: imanuaba@binus.edu
  - GitHub: bagzcode
- **Instructor Assistant:** Juwono
  - Email: juwono@binus.edu
  - GitHub: Juwono136

---

## 3. Project Overview

### 3.1 Problem Statement

Language learning is often perceived as tedious and inaccessible, with traditional methods lacking engagement and immediate feedback. Many learners struggle to stay motivated without gamification, real-time correction, or AI-powered assistance. There is a need for an interactive, accessible, and engaging language learning platform that leverages modern AI to provide contextual help and conversational practice.

**Target Users:** Students, language enthusiasts, and anyone who wants to learn a new language in a fun and gamified way.

### 3.2 Solution Overview

BinLingo is a Duolingo-inspired language learning web application that gamifies the language learning experience through:

- Structured lesson modules with quizzes and challenges
- A hearts/lives system that encourages careful answering
- XP points and quests to drive engagement
- An AI-powered hint system that explains wrong answers contextually
- An AI conversation practice feature for real-world language use
- A subscription model for unlimited hearts via Stripe

**AI is used in two core features:**
1. **AI Hint System** — When a user answers incorrectly, Gemini AI provides a contextual hint explaining the correct answer with word-by-word translation breakdown
2. **AI Conversation Practice** — A chat modal where users practice conversation in their target language with real-time grammar corrections

---

## 4. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, TypeScript, Tailwind CSS, shadcn/ui) |
| Backend | Node.js via Next.js API Routes |
| API | REST API (GET, POST, PUT, DELETE) |
| Database | PostgreSQL with Prisma 7 (Prisma Compute) |
| Auth | Firebase Auth (email/password + Google OAuth) |
| AI | Google Gemini 2.5 Flash |
| Payments | Stripe (subscription) |
| Containerization | Docker + Docker Compose |
| Deployment | VPS + Cloudflare |
| Version Control | GitHub |

---

## 5. System Architecture

### 5.1 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                      │
│         Next.js 16 App Router (React, Tailwind)          │
│   Firebase Auth SDK │ Zustand State │ shadcn/ui Components│
└─────────────────┬───────────────────────────────────────┘
                  │ HTTPS (Cloudflare)
┌─────────────────▼───────────────────────────────────────┐
│                    NEXT.JS SERVER                         │
│                  (Docker Container)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Server Pages│  │  API Routes  │  │ Server Actions │  │
│  │ (SSR/RSC)   │  │ /api/*       │  │ (mutations)    │  │
│  └─────────────┘  └──────┬───────┘  └───────┬────────┘  │
│                           │                  │            │
│  ┌────────────────────────▼──────────────────▼────────┐  │
│  │              Security Middleware Layer               │  │
│  │   CSRF Check │ Rate Limiting │ Input Sanitization   │  │
│  └────────────────────────┬───────────────────────────┘  │
└───────────────────────────┼─────────────────────────────┘
                            │
          ┌─────────────────┼──────────────────┐
          │                 │                  │
┌─────────▼──────┐ ┌────────▼───────┐ ┌───────▼────────┐
│  PostgreSQL DB │ │  Firebase Auth │ │  Gemini AI API │
│ (Prisma Compute│ │  (Admin SDK)   │ │  (Hints + Chat)│
└────────────────┘ └────────────────┘ └────────────────┘
          │
┌─────────▼──────┐
│  Stripe API    │
│  (Subscriptions│
└────────────────┘
```

### 5.2 Architecture Explanation

- **Frontend ↔ API:** The Next.js frontend communicates with API routes via HTTP. All requests go through CSRF validation and rate limiting middleware before reaching business logic.
- **API ↔ Database:** All database access is through Prisma ORM on the server side only. The frontend never directly accesses the database.
- **Security enforcement:** Authentication is handled via Firebase session cookies verified by Firebase Admin SDK on every server-side request. Role-based access (admin vs learner) is enforced at the API route level.
- **AI Integration:** API routes `/api/hint` and `/api/chat` call the Gemini API server-side, keeping the API key secure and never exposed to the client.

---

## 6. API Design

### 6.1 API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/session | Create session cookie from Firebase ID token | No |
| DELETE | /api/auth/session | Delete session cookie (logout) | No |
| GET | /api/courses | Get all courses | Yes (Admin) |
| POST | /api/courses | Create a course | Yes (Admin) |
| GET | /api/courses/:id | Get course by ID | Yes (Admin) |
| PUT | /api/courses/:id | Update course | Yes (Admin) |
| DELETE | /api/courses/:id | Delete course | Yes (Admin) |
| GET | /api/units | Get all units | Yes (Admin) |
| POST | /api/units | Create a unit | Yes (Admin) |
| GET | /api/units/:id | Get unit by ID | Yes (Admin) |
| PUT | /api/units/:id | Update unit | Yes (Admin) |
| DELETE | /api/units/:id | Delete unit | Yes (Admin) |
| GET | /api/lessons | Get all lessons | Yes (Admin) |
| POST | /api/lessons | Create a lesson | Yes (Admin) |
| GET | /api/lessons/:id | Get lesson by ID | Yes (Admin) |
| PUT | /api/lessons/:id | Update lesson | Yes (Admin) |
| DELETE | /api/lessons/:id | Delete lesson | Yes (Admin) |
| GET | /api/challenges | Get all challenges | Yes (Admin) |
| POST | /api/challenges | Create a challenge | Yes (Admin) |
| GET | /api/challenges/:id | Get challenge by ID | Yes (Admin) |
| PUT | /api/challenges/:id | Update challenge | Yes (Admin) |
| DELETE | /api/challenges/:id | Delete challenge | Yes (Admin) |
| GET | /api/challengeOptions | Get all challenge options | Yes (Admin) |
| POST | /api/challengeOptions | Create a challenge option | Yes (Admin) |
| GET | /api/challengeOptions/:id | Get option by ID | Yes (Admin) |
| PUT | /api/challengeOptions/:id | Update option | Yes (Admin) |
| DELETE | /api/challengeOptions/:id | Delete option | Yes (Admin) |
| POST | /api/hint | Get AI hint for wrong answer | Yes (User) |
| POST | /api/chat | Send message to AI tutor | Yes (User) |
| POST | /api/webhooks/stripe | Stripe subscription webhook | Stripe Signature |

### 6.2 API Documentation

Postman Collection: [BinLingo API Collection](https://www.postman.com)

Example request — Get AI Hint:
```json
POST /api/hint
{
  "question": "Which one means Hello?",
  "options": [
    { "text": "Halo", "correct": true },
    { "text": "Selamat tinggal", "correct": false }
  ],
  "language": "Indonesian"
}
```

Example response:
```json
{
  "hint": "\"Halo\" is correct because it is a direct loanword from the English \"Hello\". In Indonesian, it functions as a simple greeting."
}
```

---

## 7. Database Design

### 7.1 Database Choice

PostgreSQL was chosen for its reliability, strong typing, and excellent Prisma ORM support. It is hosted on Prisma Compute for managed, scalable database access with a direct connection URL for migrations.

### 7.2 Schema / Data Structure

```
Course (id, title, imageSrc)
  └── Unit (id, courseId, title, description, order)
        └── Lesson (id, unitId, title, order)
              └── Challenge (id, lessonId, type, question, order)
                    ├── ChallengeOption (id, challengeId, text, correct, imageSrc, audioSrc)
                    └── ChallengeProgress (id, userId, challengeId, completed)

UserProgress (userId, userName, userImageSrc, activeCourseId, hearts, points)
UserSubscription (id, userId, stripeCustomerId, stripeSubscriptionId, stripePriceId, stripeCurrentPeriodEnd)
```

---

## 8. AI Features

### 8.1 AI Feature List

| AI Feature | Purpose | AI Type |
|-----------|---------|---------|
| AI Hint System | Provides contextual explanation when a user answers incorrectly | NLP / Text Generation |
| AI Conversation Practice | Real-time conversation practice with grammar correction | NLP / Dialogue |

### 8.2 AI Integration Flow

**AI Hint System:**
1. User selects wrong answer and clicks "Hint"
2. Client sends question, options, and language to `/api/hint`
3. Server sanitizes input and builds a contextual prompt
4. Gemini API generates a word-by-word translation explanation
5. Response is displayed in a hint modal with markdown rendering
6. Limit: 3 hints per lesson session (local state, resets per lesson)

**AI Conversation Practice:**
1. User clicks "Practice Chat" button on learn page
2. Chat modal opens and auto-sends a greeting prompt to `/api/chat`
3. Gemini responds in the target language with English translation in parentheses
4. User replies in any language; Gemini corrects grammar mistakes inline using ✗ → ✓ format
5. Full conversation history is passed on each turn for context
6. Chat resets when modal is closed

---

## 9. Security Implementation

### 9.1 Authentication
Firebase Auth handles user authentication via email/password and Google OAuth. Upon login, a Firebase ID token is exchanged for a session cookie via `/api/auth/session`. The session cookie is verified server-side using Firebase Admin SDK (`adminAuth.verifySessionCookie()`) on every protected route and action.

### 9.2 Authorization
Role-based access is enforced via `lib/admin.ts`. Admin routes (`/api/courses`, `/api/units`, etc.) check `isAdmin()` before processing any request. Regular users can only access their own progress data. The admin panel at `/admin` is protected by admin role check.

### 9.3 Input Validation & Sanitization
All user inputs sent to AI features are sanitized using `isomorphic-dompurify` before being included in AI prompts. This prevents XSS and prompt injection attacks.

### 9.4 Protection Against OWASP Risks

| Risk | Mitigation |
|------|-----------|
| SQL Injection | Prisma ORM uses parameterized queries — raw SQL is never used |
| XSS | DOMPurify sanitizes all user inputs before processing |
| CSRF | Origin header validation on all POST endpoints via `lib/csrf.ts` |
| Broken Auth | Firebase session cookies are HttpOnly, Secure, with 5-day expiry |
| Rate Limiting | In-memory rate limiter on `/api/hint` (10/min), `/api/chat` (20/min), `/api/webhooks/stripe` (20/min) |

### 9.5 Secure API Key Handling
All API keys (Gemini, Stripe, Firebase Admin) are stored as environment variables and never exposed to the client. The Docker container receives them via `.env.production` created from GitHub Secrets during CI/CD. The `.env` file is in `.gitignore` and never committed to the repository.

---

## 10. Testing Documentation

### 10.1 Frontend Testing (Selected Key Cases)

| Test Case | Scenario | Expected Result | Status |
|-----------|----------|-----------------|--------|
| FE-01 | Load landing page as guest | Shows Get Started and Sign In buttons | Pass |
| FE-06 | Submit empty login form | Browser validation blocks submission | Pass |
| FE-08 | Submit wrong credentials | Shows "Incorrect email or password." | Pass |
| FE-09 | Submit correct credentials | Redirects to /learn | Pass |
| FE-16 | Register with short password | Shows "Password must be at least 6 characters." | Pass |
| FE-17 | Register with mismatched passwords | Shows "Passwords do not match." | Pass |
| FE-37 | Select correct answer | Green footer, progress increases | Pass |
| FE-38 | Select wrong answer | Red footer, heart decreases | Pass |
| FE-39 | Click hint on wrong answer | AI hint modal appears | Pass |
| FE-40 | Use all 3 hints | Button disabled, shows "No hints left" | Pass |
| FE-41 | Complete all challenges | Confetti, finish screen shown | Pass |
| FE-49 | Click Upgrade in shop | Redirects to Stripe checkout | Pass |
| FE-63 | Run out of hearts | Hearts modal opens | Pass |

### 10.2 Backend & API Testing

| Test Case | Endpoint | Input | Expected Output | Status |
|-----------|----------|-------|-----------------|--------|
| API-01 | GET /api/courses | Valid admin session | Array of 5 courses | Pass |
| API-02 | POST /api/courses | Valid body + admin session | Created course object | Pass |
| API-03 | GET /api/courses/1 | Valid admin session | Course object | Pass |
| API-04 | PUT /api/courses/1 | Updated body + admin session | Updated course object | Pass |
| API-05 | DELETE /api/courses/1 | Valid admin session | Deleted course object | Pass |
| API-06 | POST /api/hint | Valid question + options + language | Hint text string | Pass |
| API-07 | POST /api/chat | Valid message + history + language | AI reply string | Pass |
| API-08 | GET /api/courses | No session cookie | 401 Unauthorized | Pass |
| API-09 | POST /api/hint | No session cookie | 401 Unauthorized | Pass |
| API-10 | POST /api/hint | 11+ requests/min | 429 Too Many Requests | Pass |

### 10.3 Security Testing

| Test Case | Attack Type | Expected Behavior | Result |
|-----------|-------------|-------------------|--------|
| SEC-01 | XSS via chat: `<script>alert('xss')</script>` | Stripped by DOMPurify | Pass |
| SEC-02 | XSS via hint: `<img src=x onerror=alert(1)>` | Stripped by DOMPurify | Pass |
| SEC-04 | SQL Injection: `'; DROP TABLE users; --` | Prisma ORM blocks | Pass |
| SEC-06 | Prompt Injection via chat | Sanitized, treated as plain text | Pass |
| SEC-08 | Access /api/courses without session | Returns 401 | Pass |
| SEC-09 | Access admin route as regular user | Returns 401 | Pass |
| SEC-11 | Forged session cookie | Firebase rejects, returns 401 | Pass |
| SEC-12 | CSRF from evil.com origin | Returns 403 Forbidden | Pass |
| SEC-14 | Brute force /api/hint (11+ req/min) | Returns 429 | Pass |
| SEC-17 | Check client bundle for API keys | No keys found in frontend | Pass |

### 10.4 AI Functionality Testing

**AI Feature 1: Hint System**

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| AI-01 | Valid question + options + language | Contextual hint explaining correct answer | Pass |
| AI-02 | Empty question | Sanitized, generic response | Pass |
| AI-03 | Prompt injection in question | Sanitized, treated as plain text | Pass |
| AI-04 | No session cookie | 401 Unauthorized | Pass |
| AI-05 | Rate limit exceeded (11+ req/min) | 429 Too Many Requests | Pass |
| AI-06 | Gemini unavailable | Returns "No hint available." fallback | Pass |

**AI Feature 2: Conversation Practice**

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| AI-07 | Valid message in target language | Bilingual AI response | Pass |
| AI-08 | Grammar mistake in message | Inline ✗ → ✓ correction | Pass |
| AI-09 | Prompt injection in message | Sanitized, treated as conversation | Pass |
| AI-10 | No session cookie | 401 Unauthorized | Pass |
| AI-11 | Rate limit exceeded (21+ req/min) | 429 Too Many Requests | Pass |
| AI-12 | Gemini unavailable | Returns "Sorry, I couldn't respond." | Pass |

**Failure Handling:**
- Gemini unavailable → fallback strings returned via `??` operator
- Rate limit exceeded → 429 response
- Unauthenticated → 401 response
- Invalid/malicious input → sanitized by DOMPurify before processing

---

## 11. Deployment & Production Setup

### 11.1 Docker Setup

- ✅ Dockerfile included (multi-stage build, node:22-alpine, standalone output)
- ✅ docker-compose.yml included

The application is containerized using a multi-stage Docker build:
1. **deps** — installs npm dependencies
2. **builder** — generates Prisma client and builds Next.js
3. **runner** — minimal production image with only necessary files

### 11.2 Production Environment

- Environment variables managed via `.env.production` on the VPS
- `FIREBASE_PRIVATE_KEY` stored with escaped newlines
- Session cookies set with `httpOnly: true`, `secure: true`
- All API keys server-side only, never in client bundle
- HTTPS enforced via Cloudflare

### 11.3 Live Application URL

[https://e2526-wads-b4ac-03.csbihub.id](https://e2526-wads-b4ac-03.csbihub.id)

---

## 12. GitHub Contribution Summary

### Farrell Raffelino Sunarman (Shuu165)
- Features implemented: Full lesson/quiz flow, hearts system, AI hint system, AI conversation practice, shop, quests, leaderboard, Docker setup, CI/CD pipeline
- API endpoints handled: /api/courses, /api/units, /api/lessons, /api/challenges, /api/challengeOption, /api/hint, /api/chat, /api/auth/session, /api/webhooks/stripe
- Tests written: Frontend testing, AI functionality testing, security testing, API testing (Postman collection), backend testing
- Security work: Rate limiting, CSRF protection, XSS sanitization, session cookie configuration
- AI-related work: Gemini API integration for hint system and conversation practice

### Muhammad Ryan Ismail Putra (muhammadRyanismail)
- Features implemented: UI/UX Frontend Design
- Tests written: Frontend testing 
- AI-related work: Prompt Modals Engineer

---

## 13. AI Usage Disclosure

| AI Tool | Purpose | Parts Assisted |
|---------|---------|---------------|
| Google Gemini 2.5 Flash | Core AI feature — hint generation and conversation practice | Runtime AI responses in /api/hint and /api/chat |
| Claude (Anthropic) | Development assistance — code suggestions, debugging, architecture advice | API route structure, Docker configuration, security middleware, testing documentation |

All AI-generated code was reviewed, understood, and modified by the team before use.

---

## 14. Known Limitations & Future Improvements

### Current Limitations
- Hint system resets per lesson session (not persisted across sessions)
- Conversation practice does not include speech-to-text or pronunciation analysis
- Only 2 lessons seeded per language (Colors, Animals, Food, lessons, pending content)
- Rate limiting is in-memory (resets on server restart; not distributed across multiple instances)
- Stripe webhook requires running `stripe listen` in local development

### Future Improvements
- Pronunciation analysis using speech-to-text AI
- Adaptive lesson difficulty based on learner performance
- Progress tracking dashboard with detailed analytics
- Daily/weekly learning goals with streak system
- User profile and learning history page
- Persistent hint tracking across sessions
- Leaderboard with real-time updates

### AI Limitations & Risks
- Gemini responses are non-deterministic; same question may yield different hints
- Conversation practice AI may occasionally respond in English instead of target language
- Prompt injection is mitigated but not fully preventable at the AI model level
- AI hints are limited to languages Gemini has strong training data for

---

## 15. Final Declaration

We declare that:
- This project is our own work
- AI usage is disclosed honestly above
- All group members will try to understand the chaotic system

Signed by Group Members:
- Farrell Raffelino Sunarman
- Muhammad Ryan Ismail Putra

---

## 16. Setup

### Prerequisites
- Node.js 22+
- Docker & Docker Compose
- PostgreSQL database (or Prisma Compute URL)
- Firebase project with Auth enabled
- Stripe account
- Google Gemini API key

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Shuu165/WADS-Final-Project.git
cd WADS-Final-Project
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` with all required environment variables (see `.env.example`)

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Seed the database:
```bash
npx tsx scripts/seed.ts
```

6. Run development server:
```bash
npm run dev
```

### Running with Docker

```bash
# Copy and fill in environment variables
cp .env.example .env

# Build and run
docker compose up --build
```

---

## 17. Deployment Instructions

### Prerequisites on VPS
- Docker and Docker Compose installed
- SSH access to VPS

### Steps

1. SSH into the VPS:
```bash
ssh -p 3012 usergc28@e2526-wads-b4ac-03.csbihub.id
```

2. Navigate to the project directory:
```bash
cd ~/actions-runner/_work/WADS-Final-Project/WADS-Final-Project
```

3. Login to Docker Hub:
```bash
docker login -u yourdockerhubusername
```

4. Create `.env.production` with all environment variables:
```bash
nano .env.production
```

5. Pull the latest image:
```bash
docker pull yourdockerhubusername/bilingnus:latest
```

6. Start the container:
```bash
docker compose up -d
```

7. Verify it's running:
```bash
docker compose logs web --tail=20
```

### Updating the Application

When new code is pushed to Docker Hub:
```bash
docker pull yourdockerhubusername/bilingnus:latest
docker compose up -d --no-deps web
docker image prune -f
```

### Stripe Webhook (Production)

Set webhook URL in Stripe Dashboard to:
