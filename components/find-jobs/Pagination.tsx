import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  totalItems,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-surface-secondary">
      <span className="text-xs text-text-secondary font-medium">
        Showing{" "}
        <span className="font-bold text-text-primary">
          {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}
        </span>{" "}
        to{" "}
        <span className="font-bold text-text-primary">
          {Math.min(totalItems, currentPage * itemsPerPage)}
        </span>{" "}
        of <span className="font-bold text-text-primary">{totalItems}</span> results
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:bg-surface-secondary disabled:opacity-50 active:scale-95 transition-all focus-ring cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold transition-all cursor-pointer focus-ring ${
                  currentPage === page
                    ? "bg-accent text-white shadow-sm"
                    : "border border-border bg-surface text-text-secondary hover:bg-surface-secondary"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-text-secondary hover:bg-surface-secondary disabled:opacity-50 active:scale-95 transition-all focus-ring cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
