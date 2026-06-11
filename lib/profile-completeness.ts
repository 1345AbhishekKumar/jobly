import { Profile, Education, WorkExperience } from "@/types";

// Helper to calculate completeness percentage and missing fields list
// Unifies calculations between actions/profile.ts, app/dashboard/page.tsx, and ProfileForm.tsx
export function calculateCompleteness(profile: Partial<Profile>) {
  const missingFields: string[] = [];
  let filledCount = 0;

  if (profile.full_name?.trim()) filledCount++; else missingFields.push("FULL_NAME");
  if (profile.phone?.trim()) filledCount++; else missingFields.push("PHONE");
  if (profile.location?.trim()) filledCount++; else missingFields.push("LOCATION");
  if (profile.current_title?.trim()) filledCount++; else missingFields.push("CURRENT_TITLE");
  if (profile.experience_level?.trim()) filledCount++; else missingFields.push("EXPERIENCE_LEVEL");
  
  if (
    profile.years_experience !== null &&
    profile.years_experience !== undefined &&
    String(profile.years_experience) !== ""
  ) {
    filledCount++;
  } else {
    missingFields.push("YEARS_EXPERIENCE");
  }
  
  if (profile.skills && profile.skills.length > 0) filledCount++; else missingFields.push("SKILLS");
  
  if (
    profile.work_experience &&
    profile.work_experience.length > 0 &&
    profile.work_experience.some((r: WorkExperience) => r.company && r.jobTitle)
  ) {
    filledCount++;
  } else {
    missingFields.push("WORK_EXPERIENCE");
  }
  
  if (profile.education && profile.education.length > 0) {
    const hasEdu = profile.education.some((e: Education) => e.degree || e.field || e.institution);
    if (hasEdu) filledCount++; else missingFields.push("EDUCATION");
  } else {
    missingFields.push("EDUCATION");
  }
  
  if (profile.job_titles_seeking && profile.job_titles_seeking.length > 0) filledCount++; else missingFields.push("JOB_PREFERENCES");

  const percentage = Math.round((filledCount / 10) * 100);
  return {
    isComplete: percentage === 100,
    completionPercentage: percentage,
    missingFields,
  };
}
