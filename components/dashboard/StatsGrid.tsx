import React from "react";
import {
  Briefcase,
  Percent,
  Building2,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface StatsGridProps {
  totalJobsFound: number;
  avgMatchRate: number;
  companiesResearchedCount: number;
  jobsThisWeekCount: number;
}

interface StatItem {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  timeframe: string;
  icon: React.ElementType;
  bgColor: string;
}

export function StatsGrid({
  totalJobsFound,
  avgMatchRate,
  companiesResearchedCount,
  jobsThisWeekCount,
}: StatsGridProps) {
  const stats: StatItem[] = [
    {
      label: "Total Jobs Found",
      value: String(totalJobsFound),
      trend: totalJobsFound > 0 ? `+${totalJobsFound} total` : "0 total",
      trendUp: true,
      timeframe: "lifetime",
      icon: Briefcase,
      bgColor: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Avg. Match Rate",
      value: `${avgMatchRate}%`,
      trend:
        avgMatchRate >= 70
          ? "Good match"
          : avgMatchRate > 0
          ? "Needs improvement"
          : "No score",
      trendUp: avgMatchRate >= 70,
      timeframe: "overall",
      icon: Percent,
      bgColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Researched Companies",
      value: String(companiesResearchedCount),
      trend:
        companiesResearchedCount > 0
          ? `+${companiesResearchedCount} dossier`
          : "0 dossier",
      trendUp: true,
      timeframe: "generated",
      icon: Building2,
      bgColor: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "Jobs Saved This Week",
      value: String(jobsThisWeekCount),
      trend:
        jobsThisWeekCount > 0 ? `+${jobsThisWeekCount} saved` : "0 saved",
      trendUp: true,
      timeframe: "last 7 days",
      icon: FileText,
      bgColor: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
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
            <span className="text-xs text-text-muted">{stat.timeframe}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
