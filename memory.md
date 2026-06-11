# Memory — Company Research Agent (Feature 13)

Last updated: June 11, 2026

## What was built

- **Feature 13 (Company Research Agent)**:
  - Created [research.ts](file:///d:/MyProjects/ongoing_Projects/jobly/agent/research.ts) background crawler agent using Playwright Chromium to scrape company websites, discover sub-pages, and synthesize a dossier using the `openai/gpt-oss-120b` model.
  - Created [route.ts](file:///d:/MyProjects/ongoing_Projects/jobly/app/api/agent/research/route.ts) POST API endpoint to authenticate users, run research, save the dossier to the database, and fire the `company_researched` PostHog event.
  - Reorganized the Company Research dossier UI in [JobDetailsClient.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/components/job-details/JobDetailsClient.tsx) into a compact tabbed interface ("Company", "My Fit", and "Prep Guide"), reducing vertical height by ~65%.

## Decisions made

- **Playwright and Browser Sandbox Args**: Configured Playwright Chromium launch with standard sandboxing bypass arguments (`--no-sandbox`, `--disable-setuid-sandbox`, `--disable-dev-shm-usage`) to avoid local and serverless execution failures.
- **Timeout Protection**: Enforced a 20-second timeout on the Playwright scraping phase using `Promise.race`. If the crawler hangs or is blocked, the agent catches the rejection and proceeds with fallback AI synthesis.
- **Graceful Fallback**: The agent is designed to always return a valid dossier. If scraping fails or gets blocked, it performs synthesis using the job description and candidate profile alone.

## Problems solved

- **Mocking Request Scope in Tests**: Resolved "cookies called outside a request scope" errors during unit testing by mocking the InsForge SSR server client module with a direct SDK client.
- **PostgreSQL UUID Casting Errors (22P02)**: Implemented regex UUID format validation on the `id` parameter inside [page.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/app/find-jobs/[id]/page.tsx) to bypass DB queries and prevent server console errors when invalid paths are hit.

## Current state

- Feature 13 is 100% complete and fully verified.
- Next.js production build (`bun run build`) compiles successfully.

## Next session starts with

- **Feature 14 (Dashboard Page — Full UI)**: Build the dashboard page UI rendering 4 stat cards (Total Jobs Found, Avg. Match Rate, Companies Researched, Cover Letters Generated), a Recent Activity list, and analytics chart placeholders.

## Open questions

- None.
