"use client";

import React, { useState, useEffect } from "react";
import { ProfileBanner } from "./ProfileBanner";
import { StatsGrid } from "./StatsGrid";
import { RecentActivity } from "./RecentActivity";
import {
  MatchScoreChart,
  JobsFoundChart,
  CompanyResearchChart,
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
  jobsFoundData: { date?: string; count: number }[];
  matchScoreData: { range: string; count: number }[];
  companyResearchData: { day?: string; count: number }[];
}

export function DashboardContent({
  isProfileComplete,
  completionPercentage,
  missingFields,
  stats,
  recentActivities,
  jobsFoundData,
  matchScoreData,
  companyResearchData,
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
        <MatchScoreChart mounted={mounted} data={matchScoreData} />
      </div>

      {/* 4. Jobs Found Over Time + Company Research charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <JobsFoundChart mounted={mounted} data={jobsFoundData} />
        <CompanyResearchChart mounted={mounted} data={companyResearchData} />
      </div>
    </div>
  );
}
