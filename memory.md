# Memory — Fix Serialization & Hydration Mismatch Issues

Last updated: June 11, 2026, 6:45 PM

## What was built

- **RSC Boundary Serialization Fixes:**
  - Modified [app/dashboard/page.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/app/dashboard/page.tsx) to discard the non-serializable `Date` object (`timestamp`) from the `recentActivities` array elements before passing it as a prop to the client component `<DashboardContent>`.
- **Pre-Rendered Server-Side Date Formatting:**
  - Modified [app/find-jobs/page.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/app/find-jobs/page.tsx) and [app/find-jobs/[id]/page.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/app/find-jobs/[id]/page.tsx) to pre-format dates on the server using UTC timezone formatting before passing them down to client components.
  - Updated [FindJobsClient.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/components/find-jobs/FindJobsClient.tsx) to receive `formattedDateFound` from the server, and added a `rawDateFound` field to allow robust sorting on the client without date-mismatch issues.
  - Simplified [JobsTable.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/components/find-jobs/JobsTable.tsx) and [JobDetailsClient.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/components/job-details/JobDetailsClient.tsx) to render the pre-formatted string directly and removed all client-side timezone-dependent formatting helper methods.

## Decisions made

- **UTC Server-Side Formatting:** Chose to format date strings on the server using a consistent timezone configuration (UTC) and pass static pre-rendered strings to the client. This guarantees 100% hydration consistency across different user timezones.
- **Raw Sorting Keys:** Retained the raw ISO timestamp string on the client as a sorting key (`rawDateFound`) to ensure sorting operates correctly regardless of visual formatting variations.
- **Retained Tailwind CSS v4:** Per developer instruction, kept Tailwind CSS v4 in the project configuration.

## Problems solved

- **RSC Serialization Warnings:** Fixed warnings/exceptions in Next.js 15+ / 16 caused by passing a `Date` object across Server-Client boundaries.
- **Eslint Unused Variables & Any Casting Rules:** Avoided typescript-eslint checks in [app/dashboard/page.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/app/dashboard/page.tsx) by using a type-safe `void` operator on the destructured `timestamp` variable, ensuring the lint checks pass warning-free.
- **React Hydration Mismatches:** Eliminated timezone-dependent differences in date formatting between server pre-renders and browser client hydration.

## Current state

- All date serialization and hydration issues are fully resolved.
- Linter (`eslint`) and compiler checks compile cleanly with zero errors or warnings.
- Production build compiles successfully.

## Next session starts with

- Review and optimize the search filtering logic in [FindJobsClient.tsx](file:///d:/MyProjects/ongoing_Projects/jobly/components/find-jobs/FindJobsClient.tsx) or continue with newly requested application features.

## Open questions

- None.
