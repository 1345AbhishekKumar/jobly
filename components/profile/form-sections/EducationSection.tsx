import React from "react";

interface EducationSectionProps {
  eduDegree: string;
  setEduDegree: (val: string) => void;
  eduField: string;
  setEduField: (val: string) => void;
  eduInstitution: string;
  setEduInstitution: (val: string) => void;
  eduYear: string;
  setEduYear: (val: string) => void;
  disabled?: boolean;
}

export function EducationSection({
  eduDegree,
  setEduDegree,
  eduField,
  setEduField,
  eduInstitution,
  setEduInstitution,
  eduYear,
  setEduYear,
  disabled = false,
}: EducationSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-text-primary border-b border-border pb-2 uppercase tracking-wide">
        Education
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Highest Degree
          </label>
          <select
            value={eduDegree}
            onChange={(e) => setEduDegree(e.target.value)}
            disabled={disabled}
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          >
            <option value="High School">High School</option>
            <option value="Associate">Associate Degree</option>
            <option value="Bachelors">Bachelors Degree</option>
            <option value="Masters">Masters Degree</option>
            <option value="PhD">PhD / Doctorate</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Field of Study
          </label>
          <input
            type="text"
            value={eduField}
            onChange={(e) => setEduField(e.target.value)}
            disabled={disabled}
            placeholder="Computer Science"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Institution Name
          </label>
          <input
            type="text"
            value={eduInstitution}
            onChange={(e) => setEduInstitution(e.target.value)}
            disabled={disabled}
            placeholder="State University"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Graduation Year
          </label>
          <input
            type="text"
            value={eduYear}
            onChange={(e) => setEduYear(e.target.value)}
            disabled={disabled}
            placeholder="YYYY"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
