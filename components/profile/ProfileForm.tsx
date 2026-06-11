"use client";

import React, { useState, useTransition } from "react";
import { saveProfile } from "@/actions/profile";
import { CompletionIndicator } from "./CompletionIndicator";
import { ResumeUpload } from "./ResumeUpload";

interface ProfileFormProps {
  initialProfile: any;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [email] = useState(initialProfile?.email || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [location, setLocation] = useState(initialProfile?.location || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile?.linkedin_url || "");
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolio_url || "");
  const [workAuthorization, setWorkAuthorization] = useState(initialProfile?.work_authorization || "citizen");

  const [currentTitle, setCurrentTitle] = useState(initialProfile?.current_title || "");
  const [experienceLevel, setExperienceLevel] = useState(initialProfile?.experience_level || "junior");
  const [yearsExperience, setYearsExperience] = useState<string>(
    initialProfile?.years_experience !== null && initialProfile?.years_experience !== undefined
      ? String(initialProfile.years_experience)
      : ""
  );

  // Skills tag state
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  // Industries tag state
  const [industries, setIndustries] = useState<string[]>(initialProfile?.industries || []);
  const [industryInput, setIndustryInput] = useState("");

  // Work Experience state (array of up to 3 roles)
  const [workExperience, setWorkExperience] = useState<any[]>(
    Array.isArray(initialProfile?.work_experience) && initialProfile.work_experience.length > 0
      ? initialProfile.work_experience
      : [
          {
            company: "Vercel",
            jobTitle: "Frontend Engineer",
            startDate: "January 2022",
            endDate: "",
            current: true,
            responsibilities: "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
          },
        ]
  );

  // Education state (we store as a single-element array in DB for simplicity)
  const initialEdu = Array.isArray(initialProfile?.education) && initialProfile.education[0]
    ? initialProfile.education[0]
    : { degree: "High School", field: "Computer Science", institution: "E.g. State University", year: "YYYY" };

  const [eduDegree, setEduDegree] = useState(initialEdu.degree || "High School");
  const [eduField, setEduField] = useState(initialEdu.field || "");
  const [eduInstitution, setEduInstitution] = useState(initialEdu.institution || "");
  const [eduYear, setEduYear] = useState(initialEdu.year || "");

  // Job Preferences state
  const [jobTitlesSeeking, setJobTitlesSeeking] = useState<string>(
    Array.isArray(initialProfile?.job_titles_seeking)
      ? initialProfile.job_titles_seeking.join(", ")
      : "Frontend Engineer, React Developer"
  );
  const [remotePreference, setRemotePreference] = useState(initialProfile?.remote_preference || "any");
  const [salaryExpectation, setSalaryExpectation] = useState(initialProfile?.salary_expectation || "");
  const [preferredLocations, setPreferredLocations] = useState<string>(
    Array.isArray(initialProfile?.preferred_locations)
      ? initialProfile.preferred_locations.join(", ")
      : ""
  );
  const [coverLetterTone, setCoverLetterTone] = useState(initialProfile?.cover_letter_tone || "formal");
  const [resumePdfUrl, setResumePdfUrl] = useState<string | null>(initialProfile?.resume_pdf_url || null);

  // Tag inputs helper functions
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

  // Work experience helpers
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

  const updateWorkRole = (index: number, field: string, value: any) => {
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

  // Profile completion calculation logic
  const calculateCompletenessMetrics = () => {
    const missingFields: string[] = [];
    let filledCount = 0;

    if (fullName.trim()) filledCount++; else missingFields.push("FULL_NAME");
    if (phone.trim()) filledCount++; else missingFields.push("PHONE");
    if (location.trim()) filledCount++; else missingFields.push("LOCATION");
    if (currentTitle.trim()) filledCount++; else missingFields.push("CURRENT_TITLE");
    if (experienceLevel.trim()) filledCount++; else missingFields.push("EXPERIENCE_LEVEL");
    if (yearsExperience.trim()) filledCount++; else missingFields.push("YEARS_EXPERIENCE");
    if (skills.length > 0) filledCount++; else missingFields.push("SKILLS");
    if (workExperience.length > 0 && workExperience.some(role => role.company && role.jobTitle)) filledCount++; else missingFields.push("WORK_EXPERIENCE");
    if (eduField.trim() || eduInstitution.trim()) filledCount++; else missingFields.push("EDUCATION");
    if (jobTitlesSeeking.trim()) filledCount++; else missingFields.push("JOB_PREFERENCES");

    const percentage = Math.round((filledCount / 10) * 100);
    return {
      percentage,
      missingFields,
    };
  };

  const { percentage, missingFields } = calculateCompletenessMetrics();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Format fields
    const parsedYears = yearsExperience.trim() ? parseInt(yearsExperience, 10) : null;
    const skillsArray = skills;
    const industriesArray = industries;
    const parsedJobTitles = jobTitlesSeeking
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    const parsedPreferredLocs = preferredLocations
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const educationArray = [
      {
        degree: eduDegree,
        field: eduField,
        institution: eduInstitution,
        year: eduYear,
      },
    ];

    startTransition(async () => {
      try {
        const result = await saveProfile({
          full_name: fullName,
          phone,
          location,
          current_title: currentTitle,
          experience_level: experienceLevel,
          years_experience: parsedYears,
          skills: skillsArray,
          industries: industriesArray,
          work_experience: workExperience,
          education: educationArray,
          job_titles_seeking: parsedJobTitles,
          remote_preference: remotePreference,
          preferred_locations: parsedPreferredLocs,
          salary_expectation: salaryExpectation,
          cover_letter_tone: coverLetterTone,
          linkedin_url: linkedinUrl,
          portfolio_url: portfolioUrl,
          work_authorization: workAuthorization,
          resume_pdf_url: resumePdfUrl,
        });

        if (result.success) {
          setStatus({ success: true, message: "Profile saved successfully!" });
        } else {
          setStatus({ success: false, message: result.message || "Failed to save profile." });
        }
      } catch (err) {
        setStatus({ success: false, message: "An unexpected error occurred." });
        console.error(err);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Completion Indicator */}
      <CompletionIndicator percentage={percentage} missingFields={missingFields} />

      {/* 2. Resume Upload Component */}
      <ResumeUpload
        initialResumeUrl={resumePdfUrl}
        onUploadSuccess={(url) => setResumePdfUrl(url)}
        onExtractStart={() => {
          setStatus({ success: true, message: "Extracting resume details... Please wait." });
        }}
        onExtractSuccess={(data) => {
          if (data.full_name) setFullName(data.full_name);
          if (data.phone) setPhone(data.phone);
          if (data.location) setLocation(data.location);
          if (data.linkedin_url) setLinkedinUrl(data.linkedin_url);
          if (data.portfolio_url) setPortfolioUrl(data.portfolio_url);
          if (data.work_authorization) setWorkAuthorization(data.work_authorization);
          if (data.current_title) setCurrentTitle(data.current_title);
          if (data.experience_level) setExperienceLevel(data.experience_level);
          if (data.years_experience !== undefined && data.years_experience !== null) {
            setYearsExperience(String(data.years_experience));
          }
          if (Array.isArray(data.skills)) setSkills(data.skills);
          if (Array.isArray(data.industries)) setIndustries(data.industries);
          if (Array.isArray(data.work_experience)) setWorkExperience(data.work_experience);
          if (Array.isArray(data.education) && data.education[0]) {
            const edu = data.education[0];
            if (edu.degree) setEduDegree(edu.degree);
            if (edu.field) setEduField(edu.field);
            if (edu.institution) setEduInstitution(edu.institution);
            if (edu.year) setEduYear(edu.year);
          }
          if (Array.isArray(data.job_titles_seeking)) setJobTitlesSeeking(data.job_titles_seeking.join(", "));
          if (data.remote_preference) setRemotePreference(data.remote_preference);
          if (data.salary_expectation) setSalaryExpectation(data.salary_expectation);
          if (Array.isArray(data.preferred_locations)) setPreferredLocations(data.preferred_locations.join(", "));
          if (data.cover_letter_tone) setCoverLetterTone(data.cover_letter_tone);

          setStatus({ success: true, message: "AI extraction successful! Please review and save your profile." });
        }}
        onExtractError={(msg) => {
          setStatus({ success: false, message: msg });
        }}
      />

      {/* 3. Status Alert banner */}
      {status && (
        <div
          className={`p-4 rounded-xl border ${
            status.success
              ? "bg-success-lightest border-success-light text-success-foreground"
              : "bg-red-50 border-red-200 text-error"
          }`}
        >
          <p className="text-sm font-semibold">{status.message}</p>
        </div>
      )}

      {/* 4. Profile Form Card */}
      <form onSubmit={handleSave} className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-8">
        <div>
          <h3 className="text-base font-semibold text-text-primary font-display">
            Profile Information
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            This context is used to accurately represent you in agent interactions.
          </p>
        </div>

        {/* PERSONAL INFO SECTION */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text-primary border-b border-border pb-2 uppercase tracking-wide">
            Personal Info
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Faizan Ali"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-text-secondary cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Portfolio / GitHub
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Work Authorization
              </label>
              <select
                value={workAuthorization}
                onChange={(e) => setWorkAuthorization(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              >
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Visa Required</option>
              </select>
            </div>
          </div>
        </div>

        {/* PROFESSIONAL INFO SECTION */}
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
                placeholder="Add a skill"
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary active:scale-[0.98] btn-interactive focus-ring shadow-sm"
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
                    className="text-text-muted hover:text-error focus:outline-none ml-1 text-sm font-bold"
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
                placeholder="E.g. FinTech, Healthcare"
                className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
              <button
                type="button"
                onClick={addIndustry}
                className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-primary hover:bg-surface-secondary active:scale-[0.98] btn-interactive focus-ring shadow-sm"
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
                    className="text-text-muted hover:text-error focus:outline-none ml-1 text-sm font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* WORK EXPERIENCE SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="text-sm font-bold text-text-primary uppercase tracking-wide">
              Work Experience
            </h4>
            {workExperience.length < 3 && (
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
                {workExperience.length > 1 && (
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
                          className="rounded text-accent focus:ring-accent"
                        />
                        Currently working here
                      </label>
                    </div>
                    <input
                      type="text"
                      disabled={role.current}
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
                    placeholder="Built Next.js features and optimized web vitals..."
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION SECTION */}
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
                placeholder="YYYY"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>
          </div>
        </div>

        {/* JOB PREFERENCES SECTION */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-text-primary border-b border-border pb-2 uppercase tracking-wide">
            Job Preferences
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Job Titles Seeking
              </label>
              <input
                type="text"
                value={jobTitlesSeeking}
                onChange={(e) => setJobTitlesSeeking(e.target.value)}
                placeholder="Frontend Engineer, React Developer"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Remote Preference
              </label>
              <select
                value={remotePreference}
                onChange={(e) => setRemotePreference(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              >
                <option value="any">Any</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Salary Expectation (Optional)
              </label>
              <input
                type="text"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
                placeholder="E.g. $120k+"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Preferred Locations (Optional)
              </label>
              <input
                type="text"
                value={preferredLocations}
                onChange={(e) => setPreferredLocations(e.target.value)}
                placeholder="New York, London"
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder-text-muted focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">
                Cover Letter Tone
              </label>
              <select
                value={coverLetterTone}
                onChange={(e) => setCoverLetterTone(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition-all"
              >
                <option value="formal">Formal & Professional</option>
                <option value="casual">Friendly & Casual</option>
                <option value="enthusiastic">Enthusiastic & Driven</option>
              </select>
            </div>
          </div>
        </div>

        {/* Form Submission Button */}
        <div className="flex justify-center pt-4 border-t border-border">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto min-w-[200px] flex h-11 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-white hover:bg-accent-dark active:scale-[0.98] btn-interactive focus-ring shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving Profile...
              </span>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
