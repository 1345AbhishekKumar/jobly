import React from "react";
import { WorkExperience } from "@/types";

interface WorkExperienceSectionProps {
  workExperience: WorkExperience[];
  setWorkExperience: (val: WorkExperience[]) => void;
  disabled?: boolean;
}

export function WorkExperienceSection({
  workExperience,
  setWorkExperience,
  disabled = false,
}: WorkExperienceSectionProps) {
  const addWorkRole = () => {
    if (workExperience.length >= 3) return;
    setWorkExperience([
      ...workExperience,
      {
        company: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        current: false,
        responsibilities: "",
      },
    ]);
  };

  const removeWorkRole = (index: number) => {
    setWorkExperience(workExperience.filter((_, i) => i !== index));
  };

  const updateWorkRole = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    setWorkExperience(
      workExperience.map((role, i) => {
        if (i === index) {
          const updatedRole = { ...role, [field]: value };
          if (field === "current" && value === true) {
            updatedRole.endDate = "";
          }
          return updatedRole;
        }
        return role;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          Work Experience
        </h4>
        {workExperience.length < 3 && !disabled && (
          <button
            type="button"
            onClick={addWorkRole}
            className="text-xs font-bold text-accent hover:text-accent-dark focus:outline-none flex items-center gap-1"
          >
            + Add role
          </button>
        )}
      </div>

      <div className="space-y-6">
        {workExperience.map((role, index) => (
          <div
            key={index}
            className="relative bg-surface rounded-xl border border-border p-4 shadow-sm space-y-4"
          >
            {workExperience.length > 1 && !disabled && (
              <button
                type="button"
                onClick={() => removeWorkRole(index)}
                className="absolute top-4 right-4 text-xs font-bold text-error hover:opacity-80"
              >
                Remove
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={role.company}
                  onChange={(e) => updateWorkRole(index, "company", e.target.value)}
                  disabled={disabled}
                  placeholder="Company"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  value={role.jobTitle}
                  onChange={(e) => updateWorkRole(index, "jobTitle", e.target.value)}
                  disabled={disabled}
                  placeholder="Job Title"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="text"
                  required
                  value={role.startDate}
                  onChange={(e) => updateWorkRole(index, "startDate", e.target.value)}
                  disabled={disabled}
                  placeholder="E.g. January 2022"
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
                    End Date
                  </label>
                  <label className="flex items-center gap-1 text-xs font-medium text-text-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={role.current || false}
                      onChange={(e) => updateWorkRole(index, "current", e.target.checked)}
                      disabled={disabled}
                      className="rounded text-accent focus:ring-accent"
                    />
                    Currently working here
                  </label>
                </div>
                <input
                  type="text"
                  disabled={role.current || disabled}
                  value={role.endDate}
                  onChange={(e) => updateWorkRole(index, "endDate", e.target.value)}
                  placeholder={role.current ? "---------- ----" : "E.g. Present, Dec 2024"}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted disabled:bg-surface-muted disabled:text-text-secondary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Key Responsibilities
              </label>
              <textarea
                rows={3}
                value={role.responsibilities}
                onChange={(e) => updateWorkRole(index, "responsibilities", e.target.value)}
                disabled={disabled}
                placeholder="Built Next.js features and optimized web vitals..."
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
