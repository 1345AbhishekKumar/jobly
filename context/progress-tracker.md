# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 5 — Dashboard
**Last completed:** 13 Company Research Agent
**Next:** 14 Dashboard Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [x] 07 AI Profile Extraction from Resume
- [x] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [x] 09 Find Jobs Page — Full UI
- [x] 10 Adzuna Job Discovery
- [x] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [x] 12 Job Details Page — Full UI
- [x] 13 Company Research Agent

### Phase 5 — Dashboard

- [x] 14 Dashboard Page — Full UI
- [x] 15 Stats Bar — Real Data
- [x] 16 Recent Activity — Real Data
- [] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- **Phase 1, Feature 01 (Homepage)**: Created highly modular components under `components/layout/` (`Navbar`, `Footer`) and `components/homepage/` (`Hero`, `Features`, `Testimonial`, `BottomCTA`). The layout integrates custom gradient meshes mimicking the Figma visual assets, using clean typography tokens defined in `globals.css` (Tailwind CSS v4). Added interactive React states to highlight different features in Section 1 and Section 2.
- **Phase 4, Feature 13 (Company Research Agent)**: Implemented background crawler agent in `agent/research.ts` using Playwright Chromium headless browsing. GPT-4o analyzes crawled page texts, candidate profile data, and job description, then synthesizes a comprehensive 9-field dossier saved to `jobs.company_research` jsonb.
- **Phase 5, Features 14-16 (Dashboard Page & Wiring)**: Created client-side component `DashboardContent.tsx` using `recharts` for Jobs Found, Match Score, and Resume Tailoring visualizations. Integrated server-side queries in `app/dashboard/page.tsx` to calculate real statistics and aggregate timelines from `agent_runs` and `jobs` tables. Timestamps are formatted server-side to prevent Next.js client hydration mismatch.

---

## Notes

- Homepage routes are wired up to `/login`, `/dashboard`, and `/profile`. Direct assets are loaded from `public/` folder.
- Test script exclusions (`test-*.ts`) added to TSConfig to prevent Next.js compilation issues from root test runner scripts.
