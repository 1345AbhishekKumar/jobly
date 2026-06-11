import React from "react";
import { DollarSign, MapPin, Briefcase, Calendar } from "lucide-react";

interface JobMetadataProps {
  salary?: string;
  location: string;
  job_type?: string;
  formattedDate: string;
}

export function JobMetadata({
  salary,
  location,
  job_type,
  formattedDate,
}: JobMetadataProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-text-muted">
          <DollarSign className="h-4 w-4 text-text-secondary" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Salary Est.</span>
        </div>
        <p className="text-sm font-semibold text-text-primary">
          {salary || "Not disclosed"}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-text-muted">
          <MapPin className="h-4 w-4 text-text-secondary" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Location</span>
        </div>
        <p className="text-sm font-semibold text-text-primary capitalize">
          {location || "Remote"}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-text-muted">
          <Briefcase className="h-4 w-4 text-text-secondary" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Job Type</span>
        </div>
        <p className="text-sm font-semibold text-text-primary capitalize">
          {job_type === "fulltime" ? "Full-time" : job_type === "parttime" ? "Part-time" : job_type || "Contract"}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-text-muted">
          <Calendar className="h-4 w-4 text-text-secondary" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Date Found</span>
        </div>
        <p className="text-sm font-semibold text-text-primary">
          {formattedDate}
        </p>
      </div>
    </div>
  );
}
