import React, { useState } from "react";

interface ProfessionalInfoSectionProps {
  currentTitle: string;
  setCurrentTitle: (val: string) => void;
  experienceLevel: string;
  setExperienceLevel: (val: string) => void;
  yearsExperience: string;
  setYearsExperience: (val: string) => void;
  skills: string[];
  setSkills: (val: string[]) => void;
  industries: string[];
  setIndustries: (val: string[]) => void;
  disabled?: boolean;
}

export function ProfessionalInfoSection({
  currentTitle,
  setCurrentTitle,
  experienceLevel,
  setExperienceLevel,
  yearsExperience,
  setYearsExperience,
  skills,
  setSkills,
  industries,
  setIndustries,
  disabled = false,
}: ProfessionalInfoSectionProps) {
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addIndustry = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = industryInput.trim();
    if (clean && !industries.includes(clean)) {
      setIndustries([...industries, clean]);
      setIndustryInput("");
    }
  };

  const removeIndustry = (industry: string) => {
    setIndustries(industries.filter((i) => i !== industry));
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-text-primary border-b border-border pb-2 uppercase tracking-wide">
        Professional Info
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
            Current/Recent Job Title
          </label>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            disabled={disabled}
            placeholder="Frontend Engineer"
            className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              disabled={disabled}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
              Years of Experience
            </label>
            <input
              type="number"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              disabled={disabled}
              placeholder="4"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Skills Input */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
          Skills
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill(e);
              }
            }}
            disabled={disabled}
            placeholder="Add a skill"
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
          <button
            type="button"
            onClick={addSkill}
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary active:scale-[0.98] btn-interactive focus-ring shadow-sm disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-dark border border-border-muted"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                disabled={disabled}
                className="text-text-muted hover:text-error focus:outline-none ml-1 text-sm font-bold disabled:opacity-50"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Industries Worked In */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">
          Industries Worked In (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={industryInput}
            onChange={(e) => setIndustryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addIndustry(e);
              }
            }}
            disabled={disabled}
            placeholder="E.g. FinTech, Healthcare"
            className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
          />
          <button
            type="button"
            onClick={addIndustry}
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary active:scale-[0.98] btn-interactive focus-ring shadow-sm disabled:opacity-50"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {industries.map((industry) => (
            <span
              key={industry}
              className="inline-flex items-center gap-1 rounded bg-surface-muted px-2.5 py-1 text-xs font-semibold text-text-dark border border-border-muted"
            >
              {industry}
              <button
                type="button"
                onClick={() => removeIndustry(industry)}
                disabled={disabled}
                className="text-text-muted hover:text-error focus:outline-none ml-1 text-sm font-bold disabled:opacity-50"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
