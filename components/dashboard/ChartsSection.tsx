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

const JOBS_FOUND_DATA = [
  { day: "Mon", count: 3 },
  { day: "Tue", count: 6 },
  { day: "Wed", count: 4 },
  { day: "Thu", count: 9 },
  { day: "Fri", count: 12 },
  { day: "Sat", count: 2 },
  { day: "Sun", count: 3 },
];

const MATCH_SCORE_DATA = [
  { range: "50-60%", count: 2 },
  { range: "60-70%", count: 4 },
  { range: "70-80%", count: 12 },
  { range: "80-90%", count: 8 },
  { range: "90-100%", count: 2 },
];

const RESUME_TAILORING_DATA = [
  { day: "Mon", tailored: 1 },
  { day: "Tue", tailored: 3 },
  { day: "Wed", tailored: 2 },
  { day: "Thu", tailored: 5 },
  { day: "Fri", tailored: 4 },
  { day: "Sat", tailored: 0 },
  { day: "Sun", tailored: 1 },
];

const AXIS_TICK = { fill: "#6a7282", fontSize: 11, fontWeight: 500 } as const;
const TOOLTIP_STYLE = {
  backgroundColor: "#ffffff",
  borderColor: "#e7eaf3",
  borderRadius: "8px",
  fontSize: "12px",
  boxShadow: "0px 1px 3px rgba(0,0,0,0.05)",
} as const;
const TOOLTIP_LABEL = { fontWeight: 600, color: "#101828" } as const;

interface MountedProp {
  mounted: boolean;
}

export function MatchScoreChart({ mounted }: MountedProp) {
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
      <div className="flex-1 min-h-[280px] w-full mt-4 flex items-center justify-center">
        {mounted ? (
          <ResponsiveContainer width="100%" height="95%">
            <BarChart
              data={MATCH_SCORE_DATA}
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
    </div>
  );
}

export function JobsFoundChart({ mounted }: MountedProp) {
  return (
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
            <AreaChart
              data={JOBS_FOUND_DATA}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="jobsColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7eaf3" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={AXIS_TICK} />
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
    </div>
  );
}

export function ResumeTailoringChart({ mounted }: MountedProp) {
  return (
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
            <BarChart
              data={RESUME_TAILORING_DATA}
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
              <Bar dataKey="tailored" fill="#5e4cff" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] w-full bg-surface-secondary/40 animate-pulse rounded-lg" />
        )}
      </div>
    </div>
  );
}
