import React from "react";

interface JobPreferencesSectionProps {
  jobTitlesSeeking: string;
  setJobTitlesSeeking: (val: string) => void;
  remotePreference: string;
  setRemotePreference: (val: string) => void;
  salaryExpectation: string;
  setSalaryExpectation: (val: string) => void;
  preferredLocations: string;
  setPreferredLocations: (val: string) => void;
  coverLetterTone: string;
  setCoverLetterTone: (val: string) => void;
  disabled?: boolean;
}

export function JobPreferencesSection({
  jobTitlesSeeking,
  setJobTitlesSeeking,
  remotePreference,
  setRemotePreference,
  salaryExpectation,
  setSalaryExpectation,
  preferredLocations,
  setPreferredLocations,
  coverLetterTone,
  setCoverLetterTone,
  disabled = false,
}: JobPreferencesSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-text-primary border-b border-border pb-2 uppercase tracking-wide">
        Job Preferences
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Job Titles Seeking
          </label>
          <input
            type="text"
            value={jobTitlesSeeking}
            onChange={(e) => setJobTitlesSeeking(e.target.value)}
            disabled={disabled}
            placeholder="Frontend Engineer, React Developer"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Remote Preference
          </label>
          <select
            value={remotePreference}
            onChange={(e) => setRemotePreference(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          >
            <option value="any">Any</option>
            <option value="remote">Remote</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Salary Expectation (Optional)
          </label>
          <input
            type="text"
            value={salaryExpectation}
            onChange={(e) => setSalaryExpectation(e.target.value)}
            disabled={disabled}
            placeholder="E.g. $120k+"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Preferred Locations (Optional)
          </label>
          <input
            type="text"
            value={preferredLocations}
            onChange={(e) => setPreferredLocations(e.target.value)}
            disabled={disabled}
            placeholder="New York, London"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Cover Letter Tone
          </label>
          <select
            value={coverLetterTone}
            onChange={(e) => setCoverLetterTone(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          >
            <option value="formal">Formal & Professional</option>
            <option value="casual">Friendly & Casual</option>
            <option value="enthusiastic">Enthusiastic & Driven</option>
          </select>
        </div>
      </div>
    </div>
  );
}
