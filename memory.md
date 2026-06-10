# Memory — Database Schema Setup (Feature 04)

Last updated: 2026-06-10T21:15:30+05:30

## What was built

- **Database Tables**: Created the `profiles`, `agent_runs`, `jobs`, and `agent_logs` tables in PostgreSQL on the InsForge backend.
- **Row Level Security (RLS)**: Enabled RLS on all 4 tables and created 12 policies to ensure user data isolation (`auth.uid() = id` / `auth.uid() = user_id`).
- **Storage Buckets**: Created a private, authenticated-access-only `resumes` storage bucket.
- **InsForge MCP Server**: Installed the InsForge MCP server (`insforge`) to manage backend infrastructure.

## Decisions made

- **User Isolation**: Used native InsForge Auth `auth.uid()` to filter tables based on the authenticated user's ID.
- **Storage Scope**: Resume PDFs will be stored securely at `resumes/{user_id}/resume.pdf` under private access.
- **Reserved Schema Fields**: `jobs.source` allows `'search'` and `'url'` to future-proof manual job imports, even though manual URL entry is currently out-of-scope for the frontend.

## Problems solved

- **InsForge MCP Integration**: Resolved access to the InsForge backend by installing the InsForge MCP server via `@insforge/install` with the project API key and URL, allowing schema execution and verification directly from the agent using MCP tools.

## Current state

- **Backend Foundation Complete**: The database schema is fully initialized, verified, and ready. Storage bucket `resumes` is set up.
- **Next Phase Readiness**: The backend is configured, and we can proceed to Phase 1's frontend, auth, and analytics features.

## Next session starts with

- **Phase 1, Feature 01 (Homepage UI)**: Build the complete homepage layout (Navbar, Hero, Dashboard preview image, Value propositions, Testimonials, Footer) in `app/page.tsx`.
- **Phase 1, Feature 02 (Auth)**: Wire up the Google & GitHub OAuth sign-in flow.
- **Phase 1, Feature 03 (PostHog)**: Set up PostHog tracking.

## Open questions

- None.
