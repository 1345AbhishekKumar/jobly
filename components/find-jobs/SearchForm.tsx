import React from "react";
import { Search, MapPin, Loader2, X, AlertCircle } from "lucide-react";

interface SearchFormProps {
  jobTitle: string;
  setJobTitle: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  isSearching: boolean;
  onSubmit: (e: React.FormEvent) => void;
  hasSearched: boolean;
  onReset: () => void;
  showSuccessBanner: boolean;
  setShowSuccessBanner: (val: boolean) => void;
  totalFound: number;
  strongFound: number;
}

export function SearchForm({
  jobTitle,
  setJobTitle,
  location,
  setLocation,
  isSearching,
  onSubmit,
  hasSearched,
  onReset,
  showSuccessBanner,
  setShowSuccessBanner,
  totalFound,
  strongFound
}: SearchFormProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-text-primary font-display mb-1">
        Automated Search & Discovery
      </h2>
      <p className="text-xs text-text-secondary mb-5">
        Enter a role title and location to trigger an agent job search. Discover matching roles, run AI compatibility checks, and view match scores.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-12">
          {/* Job Title Input */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label htmlFor="jobTitle" className="text-xs font-semibold text-text-dark tracking-wide uppercase">
              Job Title
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                id="jobTitle"
                type="text"
                placeholder="Frontend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus-ring"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label htmlFor="location" className="text-xs font-semibold text-text-dark tracking-wide uppercase">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
              <input
                id="location"
                type="text"
                placeholder="Remote, New York..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 rounded-md border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus-ring"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-3 flex items-end gap-3">
            <button
              type="submit"
              disabled={isSearching}
              className="flex-1 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white hover:bg-accent-dark active:scale-[0.98] transition-all disabled:opacity-75 focus-ring cursor-pointer shadow-sm"
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Find Jobs
                </>
              )}
            </button>

            {hasSearched && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface hover:bg-surface-secondary text-text-secondary active:scale-[0.98] transition-all focus-ring cursor-pointer"
                title="Reset Search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Success Banner */}
      {showSuccessBanner && (hasSearched || !jobTitle) && (
        <div className="mt-5 flex items-start justify-between rounded-lg border border-success-light bg-success-lightest p-4 text-success-dark animate-hero-fade">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-success-dark font-display">
                {hasSearched
                  ? `Found ${totalFound} jobs and saved ${strongFound} strong matches.`
                  : "Found 8 jobs and saved 4 strong matches."}
              </p>
              <p className="text-xs text-text-secondary">
                Our autonomous search agent completed matching. Click on any job to view tailorable assets.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSuccessBanner(false)}
            className="text-text-muted hover:text-text-secondary focus-ring rounded p-1 hover:bg-white/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
