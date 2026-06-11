import React from "react";
import { Search, ChevronDown } from "lucide-react";

interface FilterSortBarProps {
  textFilter: string;
  setTextFilter: (val: string) => void;
  matchFilter: "all" | "strong" | "weak";
  setMatchFilter: (val: "all" | "strong" | "weak") => void;
  sortBy: "score" | "newest" | "oldest";
  setSortBy: (val: "score" | "newest" | "oldest") => void;
}

export function FilterSortBar({
  textFilter,
  setTextFilter,
  matchFilter,
  setMatchFilter,
  sortBy,
  setSortBy
}: FilterSortBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Text Filter Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Filter by company or role..."
            value={textFilter}
            onChange={(e) => setTextFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-border bg-surface pl-9 pr-4 text-xs text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus-ring shadow-sm"
          />
        </div>

        {/* Filter Tabs / Selectors */}
        <div className="flex rounded-md border border-border bg-surface p-1 shadow-sm shrink-0">
          <button
            onClick={() => setMatchFilter("all")}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              matchFilter === "all"
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            All Matches
          </button>
          <button
            onClick={() => setMatchFilter("strong")}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              matchFilter === "strong"
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Strong Matches
          </button>
          <button
            onClick={() => setMatchFilter("weak")}
            className={`rounded px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              matchFilter === "weak"
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Weak Matches
          </button>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 self-end md:self-auto shadow-sm">
        <span className="text-xs text-text-secondary font-medium">Sort by:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "score" | "newest" | "oldest")}
            className="appearance-none h-9 rounded-md border border-border bg-surface pl-3 pr-8 text-xs font-semibold text-text-primary focus:border-accent focus:outline-none focus-ring cursor-pointer"
          >
            <option value="score">Match Score</option>
            <option value="newest">Newest Found</option>
            <option value="oldest">Oldest Found</option>
          </select>
          <ChevronDown className="absolute right-2 top-3 h-3 w-3 text-text-secondary pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
