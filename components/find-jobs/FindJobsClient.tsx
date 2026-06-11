"use client";

import React, { useState, useMemo } from "react";
import { INITIAL_JOBS } from "./mockJobs";
import { SearchForm } from "./SearchForm";
import { FilterSortBar } from "./FilterSortBar";
import { JobsTable } from "./JobsTable";
import { Pagination } from "./Pagination";

const ITEMS_PER_PAGE = 6;

export function FindJobsClient() {
  // Form search criteria
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  // Search/loading states
  const [isSearching, setIsSearching] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters & Sorting state
  const [textFilter, setTextFilter] = useState("");
  const [matchFilter, setMatchFilter] = useState<"all" | "strong" | "weak">("all");
  const [sortBy, setSortBy] = useState<"score" | "newest" | "oldest">("score");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
      setShowSuccessBanner(true);
      setCurrentPage(1);
    }, 1200);
  };

  // Reset simulated search
  const handleResetSearch = () => {
    setJobTitle("");
    setLocation("");
    setHasSearched(false);
    setShowSuccessBanner(false);
    setTextFilter("");
    setMatchFilter("all");
    setSortBy("score");
    setCurrentPage(1);
  };

  // Filter & Sort Jobs list
  const processedJobs = useMemo(() => {
    let result = [...INITIAL_JOBS];

    // If a search was run, simulate filtering by search inputs
    if (hasSearched) {
      if (jobTitle.trim()) {
        const titleQuery = jobTitle.toLowerCase();
        result = result.filter(
          (job) =>
            job.role.toLowerCase().includes(titleQuery) ||
            job.company.toLowerCase().includes(titleQuery)
        );
      }
      if (location.trim()) {
        const locQuery = location.toLowerCase();
        // Since mock data has locations implied, we filter some items to simulate real search logic
        if (locQuery.includes("remote")) {
          // Keep a subset of jobs representing remote jobs
          result = result.filter((_, idx) => idx % 2 === 0);
        } else {
          result = result.filter((_, idx) => idx % 3 === 0);
        }
      }
    }

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
  }, [hasSearched, jobTitle, location, textFilter, matchFilter, sortBy]);

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
    return processedJobs.filter((j) => j.matchScore >= 70).length;
  }, [processedJobs]);

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
        totalFound={processedJobs.length}
        strongFound={strongMatchesCount}
      />

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
