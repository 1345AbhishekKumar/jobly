import React from "react";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

interface JobFitInsightsProps {
  match_reason?: string;
  matched_skills?: string[];
  missing_skills?: string[];
}

export function JobFitInsights({
  match_reason,
  matched_skills,
  missing_skills,
}: JobFitInsightsProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-accent border-b border-border pb-3">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-base font-semibold text-text-primary tracking-tight font-display">
          AI Match Insights
        </h2>
      </div>

      {match_reason && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Why you match
          </h3>
          <p className="text-sm text-text-primary leading-relaxed">
            {match_reason}
          </p>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-border">
        {/* Matched Skills */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Matched Skills ({matched_skills?.length || 0})
            </span>
          </div>
          {matched_skills && matched_skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {matched_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-success-lightest px-2.5 py-0.5 text-xs font-medium text-success-foreground border border-success-light/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No matching skills identified.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-accent">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              Skills Gaps ({missing_skills?.length || 0})
            </span>
          </div>
          {missing_skills && missing_skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {missing_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-accent border border-accent-light/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-text-muted">No skills gaps identified.</p>
          )}
        </div>
      </div>
    </div>
  );
}
