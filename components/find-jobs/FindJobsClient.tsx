"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { SearchForm } from "./SearchForm";
import { FilterSortBar } from "./FilterSortBar";
import { JobsTable } from "./JobsTable";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 6;

interface FindJobsClientProps {
  initialJobs: any[];
}

export function FindJobsClient({ initialJobs }: FindJobsClientProps) {
  const router = useRouter();

  // Form search criteria
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  // Search/loading/error states
  const [isSearching, setIsSearching] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [latestRunResult, setLatestRunResult] = useState<{ total: number; strong: number } | null>(null);

  // Filters & Sorting state
  const [textFilter, setTextFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState<"all" | "strong" | "weak">("all");
  const [sortBy, setSortBy] = useState<"score" | "newest" | "oldest">("score");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Map database jobs to UI Jobs format
  const dbJobs = useMemo(() => {
    return initialJobs.map((dbJob) => ({
      id: dbJob.id,
      company: dbJob.company,
      role: dbJob.title,
      matchScore: dbJob.match_score,
      salary: dbJob.salary || "N/A",
      source: dbJob.source === "search" ? ("LinkedIn" as const) : ("URL" as const),
      dateFound: dbJob.found_at || dbJob.created_at || new Date().toISOString(),
    }));
  }, [initialJobs]);

  // Handle Search Submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    setLatestRunResult(null);

    try {
      const res = await fetch("/api/agent/find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          location: location.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to discover jobs.");
      }

      setLatestRunResult({
        total: result.data.jobsFoundCount || 0,
        strong: result.data.strongJobsCount || 0,
      });

      setHasSearched(true);
      setShowSuccessBanner(true);
      setCurrentPage(1);

      // Force Next.js to revalidate/refresh server page data
      router.refresh();
    } catch (err: any) {
      console.error("[FindJobsClient] Search failed:", err);
      setSearchError(err.message || "An unexpected error occurred during search.");
      setShowSuccessBanner(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Reset search form and state
  const handleResetSearch = () => {
    setJobTitle("");
    setLocation("");
    setHasSearched(false);
    setShowSuccessBanner(false);
    setSearchError(null);
    setLatestRunResult(null);
    setTextFilter("");
    setMatchFilter("all");
    setSortBy("score");
    setCurrentPage(1);
  };

  // Filter & Sort Jobs list
  const processedJobs = useMemo(() => {
    let result = [...dbJobs];

    // Filter by company/role text search input
    if (textFilter.trim()) {
      const query = textFilter.toLowerCase();
      result = result.filter(
        (job) =>
          job.company.toLowerCase().includes(query) ||
          job.role.toLowerCase().includes(query)
      );
    }

    // Filter by Match Score Strength
    if (matchFilter === "strong") {
      result = result.filter((job) => job.matchScore >= 70);
    } else if (matchFilter === "weak") {
      result = result.filter((job) => job.matchScore < 70);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "score") {
        return b.matchScore - a.matchScore;
      } else if (sortBy === "newest") {
        return new Date(b.dateFound).getTime() - new Date(a.dateFound).getTime();
      } else {
        return new Date(a.dateFound).getTime() - new Date(b.dateFound).getTime();
      }
    });

    return result;
  }, [dbJobs, textFilter, matchFilter, sortBy]);

  // Paginated jobs
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return processedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [processedJobs, currentPage]);

  const totalPages = Math.ceil(processedJobs.length / ITEMS_PER_PAGE) || 1;

  // Format Date Helper
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  // Derive counts for banner
  const strongMatchesCount = useMemo(() => {
    return dbJobs.filter((j) => j.matchScore >= 70).length;
  }, [dbJobs]);

  return (
    <div className="space-y-6">
      {/* Search Controls Card */}
      <SearchForm
        jobTitle={jobTitle}
        setJobTitle={setJobTitle}
        location={location}
        setLocation={setLocation}
        isSearching={isSearching}
        onSubmit={handleSearchSubmit}
        hasSearched={hasSearched}
        onReset={handleResetSearch}
        showSuccessBanner={showSuccessBanner}
        setShowSuccessBanner={setShowSuccessBanner}
        totalFound={latestRunResult ? latestRunResult.total : dbJobs.length}
        strongFound={latestRunResult ? latestRunResult.strong : strongMatchesCount}
      />

      {/* Error Banner */}
      {searchError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive animate-hero-fade">
          <p className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{searchError}</span>
          </p>
        </div>
      )}

      {/* Job List Section */}
      <div className="space-y-4">
        {/* Filtering & Sorting Controls Bar */}
        <FilterSortBar
          textFilter={textFilter}
          setTextFilter={(val) => {
            setTextFilter(val);
            setCurrentPage(1);
          }}
          matchFilter={matchFilter}
          setMatchFilter={(val) => {
            setMatchFilter(val);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          setSortBy={(val) => {
            setSortBy(val);
            setCurrentPage(1);
          }}
        />

        {/* Jobs Table & Pagination Container */}
        <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
          <JobsTable jobs={paginatedJobs} formatDate={formatDate} />

          {processedJobs.length > 0 && (
            <Pagination
              totalItems={processedJobs.length}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
