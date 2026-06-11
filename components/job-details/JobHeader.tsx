import React from "react";
import { Building2, ExternalLink } from "lucide-react";
import { MATCH_THRESHOLD } from "@/lib/utils";

interface JobHeaderProps {
  title: string;
  company: string;
  source?: string;
  source_url?: string;
  external_apply_url?: string;
  match_score: number;
}

export function JobHeader({
  title,
  company,
  source,
  source_url,
  external_apply_url,
  match_score,
}: JobHeaderProps) {
  const score = match_score || 0;
  let scoreBarColor = "bg-success"; // Green (>= 90%)
  let scoreBadgeBg = "bg-success-lightest text-success-foreground border-success-light";

  if (score < MATCH_THRESHOLD) {
    scoreBarColor = "bg-warning"; // Orange (< MATCH_THRESHOLD)
    scoreBadgeBg = "bg-warning/10 text-warning border-warning/20";
  } else if (score < 90) {
    scoreBarColor = "bg-info-dark"; // Blue (MATCH_THRESHOLD - 89%)
    scoreBadgeBg = "bg-info-lightest text-info-dark border-info-light";
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-border bg-surface-secondary text-text-slate-medium shadow-sm">
            <Building2 className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight font-display leading-tight">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-base font-semibold text-text-secondary">
                {company}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              {source === "search" ? (
                <span className="inline-flex items-center rounded-md bg-info-lightest px-2.5 py-0.5 text-xs font-semibold text-info-dark border border-info-light">
                  LinkedIn
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-surface-secondary border border-border px-2.5 py-0.5 text-xs font-semibold text-text-secondary">
                  URL
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {source_url && (
            <a
              href={source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-surface border border-border px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface-secondary btn-interactive focus-ring shadow-sm"
            >
              View Job Post
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <a
            href={external_apply_url || source_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark btn-interactive focus-ring shadow-sm"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${scoreBadgeBg}`}>
            {score}% Match
          </div>
          <div className="h-2 w-32 md:w-48 overflow-hidden rounded-full bg-border-light">
            <div className={`h-full rounded-full ${scoreBarColor}`} style={{ width: `${score}%` }}></div>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Analyzed by JobPilot Matching Engine
        </p>
      </div>
    </div>
  );
}
