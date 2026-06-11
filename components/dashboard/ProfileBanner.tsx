import React from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ProfileBannerProps {
  completionPercentage: number;
  missingFields: string[];
}

const FIELD_LABELS: Record<string, string> = {
  FULL_NAME: "Full Name",
  PHONE: "Phone Number",
  LOCATION: "Location",
  CURRENT_TITLE: "Current Job Title",
  EXPERIENCE_LEVEL: "Experience Level",
  YEARS_EXPERIENCE: "Years of Experience",
  SKILLS: "Skills",
  WORK_EXPERIENCE: "Work Experience",
  EDUCATION: "Education details",
  JOB_PREFERENCES: "Job Preferences",
};

function getReadableField(field: string): string {
  return FIELD_LABELS[field] ?? field.replace("_", " ");
}

export function ProfileBanner({
  completionPercentage,
  missingFields,
}: ProfileBannerProps) {
  return (
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
  );
}
