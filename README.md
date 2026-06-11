# Jobly - AI-Powered Job Hunting Assistant

Jobly is a full stack AI-powered job hunting assistant designed to streamline and automate the most tedious parts of the job search process. The user sets up their profile once, uploads their resume, and the agent automatically discovers relevant jobs, scores them against the user's profile, and researches companies to provide a comprehensive dossier before the user even applies.

## The Problem It Solves

Job hunting is one of the most repetitive and time-consuming tasks a developer faces. Reading dozens of job descriptions, deciding if a role fits, researching each company from scratch — all of this before even clicking apply.

Jobly eliminates all of that preparation work. The agent finds the jobs, scores them intelligently against the user's actual skills, and researches each company so the user arrives at every application fully informed.

## Core Features

-   **AI Job Discovery:** Automatically finds and scores jobs from Adzuna using GPT-4o based on your profile.
-   **Automated Company Research:** Generates a detailed dossier on a company by browsing their public website, including tech stack, culture, and interview prep points.
-   **Smart Profile Management:** Create your profile manually or auto-fill it by uploading your resume. You can also generate a clean, professional PDF resume from your profile data.
-   **Insightful Dashboard:** Track your job search with stats on jobs found, average match rate, and companies researched, all powered by PostHog analytics.
-   **Detailed Job Views:** Get a complete breakdown of every job, including your match score, skill overlap, and AI-generated match reasoning.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth + DB + Storage | InsForge |
| AI Model | OpenAI GPT-4o |
| Cloud Browser | Playwright |
| Job Discovery | Adzuna API |
| Analytics | PostHog |
| Styling | Tailwind CSS + shadcn/ui |

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

