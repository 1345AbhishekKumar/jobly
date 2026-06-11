# Memory — Adzuna Job Discovery (Feature 10)

Last updated: June 11, 2026

## What was built

- **Adzuna API Client**: Created [adzuna.ts](file:///d:/MyProjects/ongoing_Projects/jobly/lib/adzuna.ts) to perform regional job searches via `api.adzuna.com/v1/api/jobs/{country}/search/1` with credentials, query keywords, and mandatory IT category filter.
- **NVIDIA GPT Matcher**: Created [matcher.ts](file:///d:/MyProjects/ongoing_Projects/jobly/agent/matcher.ts) using NVIDIA's `openai/gpt-oss-120b` model to evaluate compatibility between candidate profile and Adzuna job snippet, returning structured score, reason, matched and missing skills.
- **Search Orchestration**: Created [adzuna.ts](file:///d:/MyProjects/ongoing_Projects/jobly/agent/adzuna.ts) to coordinate search runs, write agent logs, insert jobs with correct profile matching records into the DB (using `insforge.database.from()`), and trigger PostHog analytics events.
- **Discovery Endpoint**: Created [route.ts](file:///d:/MyProjects/ongoing_Projects/jobly/app/api/agent/find/route.ts) API route protecting queries with user authentication and invoking orchestrator.
- **Frontend Integration**: Updated [FindJobsClient.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/components/find-jobs/FindJobsClient.tsx) to handle database jobs, call the discovery route, manage searching overlay, and handle search errors gracefully. Updated [page.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/app/find-jobs/page.tsx) to query database jobs and pass them down.
- **PostHog Server Helper**: Created [posthog-server.ts](file:///d:/MyProjects/ongoing_Projects/jobly/lib/posthog-server.ts) to safely instantiate PostHog server client with local fallback.

## Decisions made

- **NVIDIA Model Integration**: Configured model parameter to use NVIDIA's `openai/gpt-oss-120b` model with `integrate.api.nvidia.com/v1` base URL.
- **Manual JSON Markdown Clean-up**: Implemented regex/string manipulation to strip out markdown wraps before `JSON.parse` since `gpt-oss-120b` does not guarantee json schema output mode native formatting.
- **Database Client Access Path**: Used `insforge.database.from()` to query database tables instead of `insforge.from()` which was throwing type errors.
- **Regional Mapping**: Mapped locations matching UK, Canada, Australia to `gb`, `ca`, `au` regional endpoints respectively, defaulting to `us`.

## Problems solved

- **InsForge Database Client Path Type Error**: Resolved Next.js compile errors by correcting client database call routes from `insforge.from(...)` to `insforge.database.from(...)`.
- **discoverJobs Type Signature Error**: Fixed compilation error by declaring optional `strongJobsCount?: number` in the `discoverJobs` promise type signature.

## Current state

- Feature 10 is 100% complete and fully wired to the UI.
- Next.js production build compiles successfully with 0 TypeScript/Turbopack errors.

## Next session starts with

- **Feature 11 (Filter + Sort + Pagination)**: Wire the client-side text filtering, match strength filtering, and sorting select options to react on real database data instead of current list sub-slices.

## Open questions

- None.
