"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const AXIS_TICK = { fill: "#6a7282", fontSize: 11, fontWeight: 500 } as const;
const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  borderColor: "#e7eaf3",
  borderRadius: "8px",
  fontSize: "12px",
  boxShadow: "0px 1px 3px rgba(0,0,0,0.05)",
} as const;
const TOOLTIP_LABEL = { fontWeight: 600, color: "#101828" } as const;

interface ChartDataPoint {
  date?: string;
  day?: string;
  count: number;
}

interface MatchScoreRange {
  range: string;
  count: number;
}

interface MatchScoreChartProps {
  mounted: boolean;
  data: MatchScoreRange[];
}

interface JobsFoundChartProps {
  mounted: boolean;
  data: ChartDataPoint[];
}

interface CompanyResearchChartProps {
  mounted: boolean;
  data: ChartDataPoint[];
}

export function MatchScoreChart({ mounted, data }: MatchScoreChartProps) {
  const hasData = data && data.some((d) => d.count > 0);

  return (
    <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[420px]">
      <div>
        <h3 className="text-base font-semibold text-text-primary font-display">
          Match Score Distribution
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Distribution of discovered job matches across different compatibility ranges.
        </p>
      </div>
      
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4 border border-dashed border-border-secondary rounded-xl bg-surface-secondary/10 p-6">
          <div className="w-12 h-12 rounded-full bg-surface-secondary/50 flex items-center justify-center mb-3 text-text-secondary">
            <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary">No match data available</p>
          <p className="text-xs text-text-secondary mt-1 max-w-[260px]">
            Jobs will be categorized by score ranges here once the matcher agent runs successfully.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[280px] w-full mt-4 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="95%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(124, 92, 252, 0.03)" }}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL}
                />
                <Bar dataKey="count" fill="#7c5cfc" radius={[6, 6, 0, 0]} maxBarSize={55} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] w-full bg-surface-secondary/40 animate-pulse rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}

export function JobsFoundChart({ mounted, data }: JobsFoundChartProps) {
  const hasData = data && data.some((d) => d.count > 0);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[360px]">
      <div>
        <h3 className="text-base font-semibold text-text-primary font-display">
          Jobs Found Over Time
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Number of jobs fetched and scored by the matcher agent in the last 30 days.
        </p>
      </div>
      
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4 border border-dashed border-border-secondary rounded-xl bg-surface-secondary/10 p-6">
          <div className="w-12 h-12 rounded-full bg-surface-secondary/50 flex items-center justify-center mb-3 text-text-secondary">
            <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary">No search activity recorded</p>
          <p className="text-xs text-text-secondary mt-1 max-w-[260px]">
            Jobs found by the agent will be mapped daily over a 30-day timeline.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[220px] w-full mt-4 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="95%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="jobsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={TOOLTIP_LABEL} />
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
      )}
    </div>
  );
}

export function CompanyResearchChart({ mounted, data }: CompanyResearchChartProps) {
  const hasData = data && data.some((d) => d.count > 0);

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col h-[360px]">
      <div>
        <h3 className="text-base font-semibold text-text-primary font-display">
          Company Research Activity
        </h3>
        <p className="text-xs text-text-secondary mt-1">
          Detailed company dossiers compiled by the research agent this week.
        </p>
      </div>

      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4 border border-dashed border-border-secondary rounded-xl bg-surface-secondary/10 p-6">
          <div className="w-12 h-12 rounded-full bg-surface-secondary/50 flex items-center justify-center mb-3 text-text-secondary">
            <svg className="w-6 h-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 018.716 5.253M12 3a9.003 9.003 0 00-8.716 5.253M12 9.75h.008v.008H12V9.75z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-primary">No research compiled yet</p>
          <p className="text-xs text-text-secondary mt-1 max-w-[260px]">
            Trigger company research from any job posting detail page to see stats here.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-[220px] w-full mt-4 flex items-center justify-center">
          {mounted ? (
            <ResponsiveContainer width="100%" height="95%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={AXIS_TICK} />
                <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(94, 76, 255, 0.02)" }}
                  contentStyle={TOOLTIP_STYLE}
                  labelStyle={TOOLTIP_LABEL}
                />
                <Bar dataKey="count" fill="#5e4cff" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] w-full bg-surface-secondary/40 animate-pulse rounded-lg" />
          )}
        </div>
      )}
    </div>
  );
}
