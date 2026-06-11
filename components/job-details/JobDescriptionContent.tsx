import React from "react";

interface JobDescriptionContentProps {
  company: string;
  about_role?: string;
  responsibilities?: string[];
  requirements?: string[];
  nice_to_have?: string[];
  benefits?: string[];
  about_company?: string;
}

export function JobDescriptionContent({
  company,
  about_role,
  responsibilities,
  requirements,
  nice_to_have,
  benefits,
  about_company,
}: JobDescriptionContentProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <h2 className="text-base font-semibold text-text-primary tracking-tight font-display border-b border-border pb-3">
        Job Details
      </h2>

      {about_role && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-text-primary font-display">
            About the Role
          </h3>
          <p className="text-sm text-text-primary leading-relaxed max-w-[75ch]">
            {about_role}
          </p>
        </div>
      )}

      {responsibilities && responsibilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary font-display">
            Key Responsibilities
          </h3>
          <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
            {responsibilities.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {requirements && requirements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary font-display">
            Requirements
          </h3>
          <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
            {requirements.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {nice_to_have && nice_to_have.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary font-display">
            Nice to Have / Preferred Qualifications
          </h3>
          <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
            {nice_to_have.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {benefits && benefits.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-text-primary font-display">
            Benefits & Perks
          </h3>
          <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
            {benefits.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {about_company && (
        <div className="space-y-2 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-text-primary font-display">
            About {company}
          </h3>
          <p className="text-sm text-text-primary leading-relaxed max-w-[75ch]">
            {about_company}
          </p>
        </div>
      )}
    </div>
  );
}
