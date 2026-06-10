"use client";

import React from "react";

interface CompletionIndicatorProps {
  percentage: number;
  missingFields: string[];
}

export function CompletionIndicator({
  percentage,
  missingFields,
}: CompletionIndicatorProps) {
  // SVG Circle calculations
  const radius = 32;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Choose progress ring color: red/orange if incomplete, accent/purple if complete
  const ringColor = percentage === 100 ? "stroke-accent" : "stroke-error";

  // Friendly display names for missing field tags
  const fieldDisplayMap: Record<string, string> = {
    FULL_NAME: "Name",
    PHONE: "Phone",
    LOCATION: "Location",
    CURRENT_TITLE: "Job Title",
    EXPERIENCE_LEVEL: "Experience Level",
    YEARS_EXPERIENCE: "Years of Experience",
    SKILLS: "Skills",
    WORK_EXPERIENCE: "Work Experience",
    EDUCATION: "Education",
    JOB_PREFERENCES: "Job Preferences",
  };

  const isComplete = percentage === 100;

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        {/* Warning / Success Icon */}
        <div className={`p-1 mt-0.5 shrink-0 ${isComplete ? "text-success" : "text-error"}`}>
          {isComplete ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          )}
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <div>
            <h3 className="text-base font-semibold text-text-primary font-display">
              {isComplete ? "Profile looks great!" : "Profile needs attention"}
            </h3>
            <p className="text-sm text-text-secondary mt-1 max-w-xl">
              {isComplete
                ? "Your profile is fully configured. You are ready to start finding tailored job matches."
                : "Complete the missing fields to improve your chance of getting tailored matches and generating quality resumes."}
            </p>
          </div>

          {/* Missing Field Tags */}
          {missingFields.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {missingFields.map((field) => (
                <span
                  key={field}
                  className="inline-flex items-center rounded bg-surface-muted px-2 py-0.5 text-xs font-semibold text-error uppercase tracking-wider border border-border-light"
                >
                  {fieldDisplayMap[field] || field}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progress Ring */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="h-24 w-24 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-border-light fill-transparent"
            strokeWidth={strokeWidth}
          />
          {/* Foreground progress circle */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`${ringColor} fill-transparent transition-all duration-500 ease-in-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-bold text-text-primary font-display">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
