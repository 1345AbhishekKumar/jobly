"use client";

import React, { useState, useEffect } from "react";
import { ProfileBanner } from "./ProfileBanner";
import { StatsGrid } from "./StatsGrid";
import { RecentActivity } from "./RecentActivity";
import {
  MatchScoreChart,
  JobsFoundChart,
  ResumeTailoringChart,
} from "./ChartsSection";

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
  recentActivities,
}: DashboardContentProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch for Recharts responsive containers
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="space-y-8 animate-hero-fade">
      {/* 1. Profile Incomplete Banner */}
      {!isProfileComplete && (
        <ProfileBanner
          completionPercentage={completionPercentage}
          missingFields={missingFields}
        />
      )}

      {/* 2. KPI Stats Grid */}
      <StatsGrid
        totalJobsFound={stats.totalJobsFound}
        avgMatchRate={stats.avgMatchRate}
        companiesResearchedCount={stats.companiesResearchedCount}
        jobsThisWeekCount={stats.jobsThisWeekCount}
      />

      {/* 3. Activity Timeline + Match Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <RecentActivity activities={recentActivities} />
        <MatchScoreChart mounted={mounted} />
      </div>

      {/* 4. Jobs Found Over Time + Resume Tailoring charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <JobsFoundChart mounted={mounted} />
        <ResumeTailoringChart mounted={mounted} />
      </div>
    </div>
  );
}
