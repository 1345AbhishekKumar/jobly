import React from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { Job } from "./types";
import { MATCH_THRESHOLD } from "@/lib/utils";

interface JobsTableProps {
  jobs: Job[];
  formatDate: (dateStr: string) => string;
}

export function JobsTable({ jobs, formatDate }: JobsTableProps) {
  // Render score bar and color matching reference image
  const renderScoreBar = (score: number) => {
    let barColor = "bg-success"; // Green (>= 90%)
    if (score < MATCH_THRESHOLD) {
      barColor = "bg-warning"; // Orange (< MATCH_THRESHOLD)
    } else if (score < 90) {
      barColor = "bg-info-dark"; // Blue (MATCH_THRESHOLD - 89%)
    }

    return (
      <div className="flex items-center gap-3">
        {/* Short pill progress bar matching reference mockup */}
        <div className="h-2 w-10 overflow-hidden rounded-full bg-border">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${score}%` }}></div>
        </div>
        <span className="text-sm font-semibold text-text-primary font-display">{score}%</span>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface-secondary text-[11px] font-bold uppercase tracking-wider text-text-slate-medium font-display">
              <th className="py-4 px-6 font-semibold">Company</th>
              <th className="py-4 px-4 font-semibold">Match Score</th>
              <th className="py-4 px-4 font-semibold">Salary Est.</th>
              <th className="py-4 px-4 font-semibold">Source</th>
              <th className="py-4 px-6 font-semibold">Date Found</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <tr
                  key={job.id}
                  className="group hover:bg-surface-secondary transition-colors"
                >
                  {/* COMPANY & ROLE */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {/* SQUIRCLE ICON MATCHING SCREENSHOT */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-border bg-surface-secondary text-text-slate-medium shadow-sm group-hover:bg-white transition-colors">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <Link
                          href={`/find-jobs/${job.id}`}
                          className="font-bold text-text-darkest hover:text-accent focus:outline-none transition-colors"
                        >
                          {job.company}
                        </Link>
                        <span className="text-[13px] text-text-secondary font-medium">
                          {job.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* MATCH SCORE */}
                  <td className="py-4 px-4 align-middle">
                    {renderScoreBar(job.matchScore)}
                  </td>

                  {/* SALARY EST. */}
                  <td className="py-4 px-4 font-medium text-text-dark align-middle">
                    {job.salary}
                  </td>

                  {/* SOURCE BADGES */}
                  <td className="py-4 px-4 align-middle">
                    {job.source === "LinkedIn" ? (
                      <span className="inline-flex items-center rounded-md bg-info-lightest px-2.5 py-1 text-xs font-semibold text-info-dark border border-info-light">
                        LinkedIn
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-surface-secondary border border-border px-2.5 py-1 text-xs font-semibold text-text-secondary">
                        URL
                      </span>
                    )}
                  </td>

                  {/* DATE FOUND */}
                  <td className="py-4 px-6 text-xs text-text-muted align-middle">
                    {formatDate(job.dateFound)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Building2 className="h-8 w-8 text-text-muted" />
                    <p className="font-semibold text-text-primary">No jobs found</p>
                    <p className="text-xs text-text-secondary">
                      Try searching for a different title or resetting filters.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
