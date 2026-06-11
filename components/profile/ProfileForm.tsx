"use client";

import React, { useState, useTransition } from "react";
import { saveProfile } from "@/actions/profile";
import { CompletionIndicator } from "./CompletionIndicator";
import { ResumeUpload } from "./ResumeUpload";

import { Profile, WorkExperience } from "@/types";
import { calculateCompleteness } from "@/lib/profile-completeness";

// Extracted subsections
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { ProfessionalInfoSection } from "./form-sections/ProfessionalInfoSection";
import { WorkExperienceSection } from "./form-sections/WorkExperienceSection";
import { EducationSection } from "./form-sections/EducationSection";
import { JobPreferencesSection } from "./form-sections/JobPreferencesSection";

interface ProfileFormProps {
  initialProfile: Partial<Profile> | null;
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

  // Skills and Industries tag states
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills || []);
  const [industries, setIndustries] = useState<string[]>(initialProfile?.industries || []);

  // Work Experience state (array of up to 3 roles)
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(
    Array.isArray(initialProfile?.work_experience) && initialProfile.work_experience.length > 0
      ? (initialProfile.work_experience as WorkExperience[])
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

  // Education state
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

  // Form parsing for completeness calculation and save payload
  const parsedYears = yearsExperience.trim() ? parseInt(yearsExperience, 10) : null;
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

  // Profile completion calculation logic using unified helper
  const { completionPercentage: percentage, missingFields } = calculateCompleteness({
    full_name: fullName,
    phone,
    location,
    current_title: currentTitle,
    experience_level: experienceLevel,
    years_experience: parsedYears,
    skills,
    work_experience: workExperience,
    education: educationArray,
    job_titles_seeking: parsedJobTitles,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    startTransition(async () => {
      try {
        const result = await saveProfile({
          full_name: fullName,
          phone,
          location,
          current_title: currentTitle,
          experience_level: experienceLevel,
          years_experience: parsedYears,
          skills,
          industries,
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
      <CompletionIndicator percentage={percentage} missingFields={missingFields} />

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

      <form onSubmit={handleSave} className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-8">
        <div>
          <h3 className="text-base font-semibold text-text-primary font-display">
            Profile Information
          </h3>
          <p className="text-xs text-text-secondary mt-1">
            This context is used to accurately represent you in agent interactions.
          </p>
        </div>

        <PersonalInfoSection
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          phone={phone}
          setPhone={setPhone}
          location={location}
          setLocation={setLocation}
          linkedinUrl={linkedinUrl}
          setLinkedinUrl={setLinkedinUrl}
          portfolioUrl={portfolioUrl}
          setPortfolioUrl={setPortfolioUrl}
          workAuthorization={workAuthorization}
          setWorkAuthorization={setWorkAuthorization}
          disabled={isPending}
        />

        <ProfessionalInfoSection
          currentTitle={currentTitle}
          setCurrentTitle={setCurrentTitle}
          experienceLevel={experienceLevel}
          setExperienceLevel={setExperienceLevel}
          yearsExperience={yearsExperience}
          setYearsExperience={setYearsExperience}
          skills={skills}
          setSkills={setSkills}
          industries={industries}
          setIndustries={setIndustries}
          disabled={isPending}
        />

        <WorkExperienceSection
          workExperience={workExperience}
          setWorkExperience={setWorkExperience}
          disabled={isPending}
        />

        <EducationSection
          eduDegree={eduDegree}
          setEduDegree={setEduDegree}
          eduField={eduField}
          setEduField={setEduField}
          eduInstitution={eduInstitution}
          setEduInstitution={setEduInstitution}
          eduYear={eduYear}
          setEduYear={setEduYear}
          disabled={isPending}
        />

        <JobPreferencesSection
          jobTitlesSeeking={jobTitlesSeeking}
          setJobTitlesSeeking={setJobTitlesSeeking}
          remotePreference={remotePreference}
          setRemotePreference={setRemotePreference}
          salaryExpectation={salaryExpectation}
          setSalaryExpectation={setSalaryExpectation}
          preferredLocations={preferredLocations}
          setPreferredLocations={setPreferredLocations}
          coverLetterTone={coverLetterTone}
          setCoverLetterTone={setCoverLetterTone}
          disabled={isPending}
        />

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
