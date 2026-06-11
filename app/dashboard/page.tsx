import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import Link from "next/link";
import { getDashboardChartsData } from "@/lib/posthogQuery";
import { calculateCompleteness } from "@/lib/profile-completeness";


// Helper to format timestamps to a relative format on the server
function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`;
  if (diffHr < 24) return `${diffHr} ${diffHr === 1 ? "hour" : "hours"} ago`;
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? "day" : "days"} ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  // Fetch the user's profile from InsForge DB
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // Determine profile completeness metrics
  let isProfileComplete = false;
  let completionPercentage = 0;
  let missingFields = [
    "FULL_NAME", "PHONE", "LOCATION", "CURRENT_TITLE",
    "EXPERIENCE_LEVEL", "YEARS_EXPERIENCE", "SKILLS",
    "WORK_EXPERIENCE", "EDUCATION", "JOB_PREFERENCES"
  ];

  if (profile) {
    const completeness = calculateCompleteness(profile);
    isProfileComplete = completeness.isComplete;
    completionPercentage = completeness.completionPercentage;
    missingFields = completeness.missingFields;
  }

  // Fetch jobs for stats calculation (and company research counts)
  const { data: jobs } = await insforge.database
    .from("jobs")
    .select("id, match_score, company_research, found_at")
    .eq("user_id", user.id);

  // Fetch recent agent runs
  const { data: recentRuns } = await insforge.database
    .from("agent_runs")
    .select("id, status, job_title_searched, jobs_found, completed_at, started_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(10);

  // Fetch recent jobs that have company research dossiers completed
  const { data: researchedJobs } = await insforge.database
    .from("jobs")
    .select("id, company, found_at")
    .eq("user_id", user.id)
    .not("company_research", "is", null)
    .order("found_at", { ascending: false })
    .limit(10);

  // Calculate real metrics
  const totalJobsFound = jobs ? jobs.length : 0;
  let avgMatchRate = 0;
  if (totalJobsFound > 0 && jobs) {
    const sum = jobs.reduce((acc: number, j: { match_score?: number | null }) => acc + (j.match_score || 0), 0);
    avgMatchRate = Math.round(sum / totalJobsFound);
  }

  const companiesResearchedCount = jobs
    ? jobs.filter((j: { company_research?: unknown }) => j.company_research !== null).length
    : 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const jobsThisWeekCount = jobs
    ? jobs.filter((j: { found_at?: string | null }) => new Date(j.found_at || "") >= oneWeekAgo).length
    : 0;

  // Merge, sort and format recent activities
  const activities: { title: string; time: string; desc: string; dotColor: string; timestamp: Date }[] = [];

  if (recentRuns) {
    recentRuns.forEach((run: { job_title_searched?: string | null; completed_at?: string | null; started_at?: string | null; jobs_found?: number | null; status?: string | null }) => {
      // Exclude research runs to avoid double-counting in timeline since we list them via researchedJobs
      if (run.job_title_searched?.startsWith("Research:")) {
        return;
      }
      const timestampStr = run.completed_at || run.started_at;
      if (timestampStr) {
        activities.push({
          title: `Found ${run.jobs_found || 0} jobs for '${run.job_title_searched}'`,
          time: formatRelativeTime(timestampStr),
          desc: `Search run completed ${run.status === "completed" ? "successfully" : "with errors"}.`,
          dotColor: "bg-blue-500 ring-blue-500/20",
          timestamp: new Date(timestampStr)
        });
      }
    });
  }

  if (researchedJobs) {
    researchedJobs.forEach((job: { company: string; found_at?: string | null }) => {
      const timestampStr = job.found_at;
      if (timestampStr) {
        activities.push({
          title: `Researched ${job.company}`,
          time: formatRelativeTime(timestampStr),
          desc: "Engineering team, tech stack, and interview dossier ready.",
          dotColor: "bg-emerald-500 ring-emerald-500/20",
          timestamp: new Date(timestampStr)
        });
      }
    });
  }

  // Sort activities by date descending
  activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const recentActivities = activities.slice(0, 5);

  // Fetch charts data from PostHog or DB fallback
  const { jobsFoundData, matchScoreData, companyResearchData } = await getDashboardChartsData(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-[1440px] px-6 py-8 space-y-8 animate-hero-fade">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary tracking-tight font-display">
              Dashboard
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              Welcome back! Here is a summary of your AI job assistant activity.
            </p>
          </div>
          <Link
            href="/find-jobs"
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 text-sm font-medium text-white hover:bg-accent-dark active:scale-[0.97] btn-interactive focus-ring shadow-sm self-start md:self-auto"
          >
            Find Jobs
          </Link>
        </div>

        {/* Dashboard Content Client Component (incorporates cards, timeline & recharts) */}
        <DashboardContent
          isProfileComplete={isProfileComplete}
          completionPercentage={completionPercentage}
          missingFields={missingFields}
          stats={{
            totalJobsFound,
            avgMatchRate,
            companiesResearchedCount,
            jobsThisWeekCount
          }}
          recentActivities={recentActivities}
          jobsFoundData={jobsFoundData}
          matchScoreData={matchScoreData}
          companyResearchData={companyResearchData}
        />
      </main>

      <Footer />
    </div>
  );
}
