"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Percent,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

// TypeScript props type matching server layout parameters
interface DashboardContentProps {
  isProfileComplete: boolean;
  completionPercentage: number;
  missingFields: string[];
  stats: {
    totalJobsFound: number;
    avgMatchRate: number;
    companiesResearchedCount: number;
    jobsThisWeekCount: number;
  };
  recentActivities: {
    title: string;
    time: string;
    desc: string;
    dotColor: string;
  }[];
}

export function DashboardContent({
  isProfileComplete,
  completionPercentage,
  missingFields,
  stats,
  recentActivities
}: DashboardContentProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch for Recharts responsive containers
  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock data for charts
  const jobsFoundData = [
    { day: "Mon", count: 3 },
    { day: "Tue", count: 6 },
    { day: "Wed", count: 4 },
    { day: "Thu", count: 9 },
    { day: "Fri", count: 12 },
    { day: "Sat", count: 2 },
    { day: "Sun", count: 3 }
  ];

  const matchScoreData = [
    { range: "50-60%", count: 2 },
    { range: "60-70%", count: 4 },
    { range: "70-80%", count: 12 },
    { range: "80-90%", count: 8 },
    { range: "90-100%", count: 2 }
  ];

  const resumeTailoringData = [
    { day: "Mon", tailored: 1 },
    { day: "Tue", tailored: 3 },
    { day: "Wed", tailored: 2 },
    { day: "Thu", tailored: 5 },
    { day: "Fri", tailored: 4 },
    { day: "Sat", tailored: 0 },
    { day: "Sun", tailored: 1 }
  ];

  // Helper to map missing field keys to readable text
  const getReadableField = (field: string) => {
    switch (field) {
      case "FULL_NAME": return "Full Name";
      case "PHONE": return "Phone Number";
      case "LOCATION": return "Location";
      case "CURRENT_TITLE": return "Current Job Title";
      case "EXPERIENCE_LEVEL": return "Experience Level";
      case "YEARS_EXPERIENCE": return "Years of Experience";
      case "SKILLS": return "Skills";
      case "WORK_EXPERIENCE": return "Work Experience";
      case "EDUCATION": return "Education details";
      case "JOB_PREFERENCES": return "Job Preferences";
      default: return field.replace("_", " ");
    }
  };

  return (
    <div className="space-y-8 animate-hero-fade">
      {/* 1. Profile Incomplete Banner */}
      {!isProfileComplete && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Completion ring */}
            <div className="relative flex items-center justify-center shrink-0 w-16 h-16 rounded-full bg-accent-light text-accent">
              <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-accent/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-accent"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="text-sm font-semibold font-display text-accent-dark">
                {completionPercentage}%
              </span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-text-primary font-display flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Complete Your Profile to Unlock AI Tailoring
              </h3>
              <p className="text-sm text-text-secondary max-w-[70ch]">
                Upload your resume and complete missing sections to enable accurate job match analysis, custom interview dossier research, and resume tailoring.
              </p>
              {missingFields.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider mr-1">Missing:</span>
                  {missingFields.slice(0, 4).map((field) => (
                    <span
                      key={field}
                      className="inline-flex items-center rounded-md bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent border border-accent/20"
                    >
                      {getReadableField(field)}
                    </span>
                  ))}
                  {missingFields.length > 4 && (
                    <span className="text-xs text-text-muted">
                      +{missingFields.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <Link
            href="/profile"
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-5 text-sm font-medium text-white hover:bg-accent-dark active:scale-[0.97] btn-interactive focus-ring shadow-sm shrink-0"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Jobs Found",
            value: String(stats.totalJobsFound),
            trend: stats.totalJobsFound > 0 ? `+${stats.totalJobsFound} total` : "0 total",
            trendUp: true,
            timeframe: "lifetime",
            icon: Briefcase,
            bgColor: "bg-blue-500/10 text-blue-600"
          },
          {
            label: "Avg. Match Rate",
            value: `${stats.avgMatchRate}%`,
            trend: stats.avgMatchRate >= 70 ? "Good match" : stats.avgMatchRate > 0 ? "Needs improvement" : "No score",
            trendUp: stats.avgMatchRate >= 70,
            timeframe: "overall",
            icon: Percent,
            bgColor: "bg-emerald-500/10 text-emerald-600"
          },
          {
            label: "Researched Companies",
            value: String(stats.companiesResearchedCount),
            trend: stats.companiesResearchedCount > 0 ? `+${stats.companiesResearchedCount} dossier` : "0 dossier",
            trendUp: true,
            timeframe: "generated",
            icon: Building2,
            bgColor: "bg-purple-500/10 text-purple-600"
          },
          {
            label: "Jobs Saved This Week",
            value: String(stats.jobsThisWeekCount),
            trend: stats.jobsThisWeekCount > 0 ? `+${stats.jobsThisWeekCount} saved` : "0 saved",
            trendUp: true,
            timeframe: "last 7 days",
            icon: FileText,
            bgColor: "bg-amber-500/10 text-amber-600"
          }
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-surface rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="text-3xl font-semibold text-text-primary tracking-tight font-display mt-3">
              {stat.value}
            </div>

            <div className="flex items-center gap-1.5 mt-2.5">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  stat.trendUp
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "bg-red-500/10 text-red-700"
                }`}
              >
                {stat.trendUp ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.trend}
              </span>
              <span className="text-xs text-text-muted">
                {stat.timeframe}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Lower Dashboard Section (Activity + Score Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity (Timeline list) */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-5 border-b border-border pb-3">
            <h3 className="text-base font-semibold text-text-primary font-display flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-text-secondary" />
              Recent Activity
            </h3>
            <span className="text-xs font-medium text-text-muted">Live Stream</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {recentActivities.length > 0 ? (
              <div className="relative border-l-2 border-border pl-4 ml-2.5 space-y-6">
                {recentActivities.map((activity, idx) => (
                  <div key={idx} className="relative space-y-1">
                    {/* Timeline dot */}
                    <span className={`absolute -left-[23px] top-1.5 flex h-2.5 w-2.5 rounded-full ring-4 ${activity.dotColor}`} />
                    
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold text-text-primary leading-tight">
                        {activity.title}
                      </h4>
                      <span className="text-[10px] text-text-muted shrink-0">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary leading-normal">
                      {activity.desc}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center text-center p-6 text-text-muted h-full">
                <svg className="h-10 w-10 text-text-muted/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">No activity recorded yet</p>
                <p className="text-xs mt-1">Actions you perform will show up in this timeline</p>
              </div>
            )}
          </div>
        </div>

        {/* Match Score Distribution (Recharts bar chart) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[420px]">
          <div>
            <h3 className="text-base font-semibold text-text-primary font-display">
              Match Score Distribution
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Distribution of discovered job matches across different compatibility ranges.
            </p>
          </div>

          <div className="flex-1 min-h-[280px] w-full mt-4 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="95%">
                <BarChart data={matchScoreData} margin={{ top: 20, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
                  <XAxis
                    dataKey="range"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6a7282", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6a7282", fontSize: 11, fontWeight: 500 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(124, 92, 252, 0.03)" }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e7eaf3",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0px 1px 3px rgba(0,0,0,0.05)"
                    }}
                    labelStyle={{ fontWeight: 600, color: "#101828" }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#7c5cfc"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={55}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] w-full bg-surface-secondary/40 animate-pulse rounded-lg" />
            )}
          </div>
        </div>
      </div>

      {/* 4. Upper Charts Grid (Activity details side-by-side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs Found Over Time (Recharts area/line chart) */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[360px]">
          <div>
            <h3 className="text-base font-semibold text-text-primary font-display">
              Jobs Found Over Time
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Number of jobs fetched and scored by the matcher agent this week.
            </p>
          </div>

          <div className="flex-1 min-h-[220px] w-full mt-4 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="95%">
                <AreaChart data={jobsFoundData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="jobsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6a7282", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6a7282", fontSize: 11, fontWeight: 500 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e7eaf3",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0px 1px 3px rgba(0,0,0,0.05)"
                    }}
                    labelStyle={{ fontWeight: 600, color: "#101828" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#7c5cfc"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#jobsColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] w-full bg-surface-secondary/40 animate-pulse rounded-lg" />
            )}
          </div>
        </div>

        {/* Resume Tailoring Activity (Recharts bar chart) */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[360px]">
          <div>
            <h3 className="text-base font-semibold text-text-primary font-display">
              Resume Tailoring Activity
            </h3>
            <p className="text-xs text-text-secondary mt-1">
              Customized resumes generated and downloaded by day of the week.
            </p>
          </div>

          <div className="flex-1 min-h-[220px] w-full mt-4 flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="95%">
                <BarChart data={resumeTailoringData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6a7282", fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6a7282", fontSize: 11, fontWeight: 500 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(94, 76, 255, 0.02)" }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e7eaf3",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0px 1px 3px rgba(0,0,0,0.05)"
                    }}
                    labelStyle={{ fontWeight: 600, color: "#101828" }}
                  />
                  <Bar
                    dataKey="tailored"
                    fill="#5e4cff"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] w-full bg-surface-secondary/40 animate-pulse rounded-lg" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
