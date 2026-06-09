import { redirect } from "next/navigation";
import { createInsforgeServer } from "@/lib/insforge-server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

export default async function DashboardPage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

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

        {/* Profile Incomplete Banner */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-light rounded-xl text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary font-display">
                Profile Incomplete
              </h3>
              <p className="text-sm text-text-secondary mt-0.5">
                Complete your profile and upload your resume to unlock accurate, tailored job matching.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 text-xs font-semibold text-white hover:bg-accent-dark active:scale-[0.97] btn-interactive focus-ring shadow-sm shrink-0"
          >
            Complete Profile
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Jobs Found", value: "0", desc: "No job matches saved yet" },
            { label: "Avg. Match Rate", value: "0%", desc: "Requires complete profile" },
            { label: "Researched Companies", value: "0", desc: "No dossiers generated yet" },
            { label: "Jobs Saved This Week", value: "0", desc: "Start searching to find jobs" },
          ].map((stat, i) => (
            <div key={i} className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="text-4xl font-semibold text-text-primary tracking-tight font-display mt-2">
                {stat.value}
              </div>
              <p className="text-xs text-text-muted mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Lower Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-1 bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-lg font-semibold text-text-primary font-display mb-4">
              Recent Activity
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center text-center p-6 text-text-muted">
              <svg className="h-10 w-10 text-text-muted/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No activity recorded yet</p>
              <p className="text-xs mt-1">Actions you perform will show up in this timeline</p>
            </div>
          </div>

          {/* Analytics Placeholder */}
          <div className="lg:col-span-2 bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col h-[400px]">
            <h3 className="text-lg font-semibold text-text-primary font-display mb-4">
              Job Match Analytics
            </h3>
            <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-text-muted border-2 border-dashed border-border rounded-xl">
              <svg className="h-12 w-12 text-text-muted/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
              <h4 className="font-semibold text-text-primary text-sm font-display">
                No Analytics Data
              </h4>
              <p className="text-xs mt-1 max-w-[320px]">
                Search for job postings and score matches to see score distribution and search history charts.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
