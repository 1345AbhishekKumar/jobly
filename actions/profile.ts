"use server";

import { revalidatePath } from "next/cache";
import { createInsforgeServer } from "@/lib/insforge-server";

// Helper to calculate completeness percentage and missing fields list
function calculateCompleteness(profile: any) {
  const missingFields: string[] = [];
  let filledCount = 0;

  if (profile.full_name?.trim()) filledCount++; else missingFields.push("FULL_NAME");
  if (profile.phone?.trim()) filledCount++; else missingFields.push("PHONE");
  if (profile.location?.trim()) filledCount++; else missingFields.push("LOCATION");
  if (profile.current_title?.trim()) filledCount++; else missingFields.push("CURRENT_TITLE");
  if (profile.experience_level?.trim()) filledCount++; else missingFields.push("EXPERIENCE_LEVEL");
  if (profile.years_experience !== null && profile.years_experience !== undefined && profile.years_experience !== "") filledCount++; else missingFields.push("YEARS_EXPERIENCE");
  if (profile.skills && profile.skills.length > 0) filledCount++; else missingFields.push("SKILLS");
  if (profile.work_experience && profile.work_experience.length > 0) filledCount++; else missingFields.push("WORK_EXPERIENCE");
  
  if (profile.education && profile.education.length > 0) {
    const hasEdu = profile.education.some((e: any) => e.degree || e.institution);
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

export async function saveProfile(formData: {
  full_name: string;
  phone: string;
  location: string;
  current_title: string;
  experience_level: string;
  years_experience: number | null;
  skills: string[];
  industries: string[];
  work_experience: any[];
  education: any[];
  job_titles_seeking: string[];
  remote_preference: string;
  preferred_locations: string[];
  salary_expectation: string;
  cover_letter_tone: string;
  linkedin_url: string;
  portfolio_url: string;
  work_authorization: string;
  resume_pdf_url?: string | null;
}) {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Calculate completeness metrics
  const { isComplete, completionPercentage } = calculateCompleteness(formData);

  const profileData = {
    full_name: formData.full_name,
    phone: formData.phone,
    location: formData.location,
    current_title: formData.current_title,
    experience_level: formData.experience_level,
    years_experience: formData.years_experience,
    skills: formData.skills,
    industries: formData.industries,
    work_experience: formData.work_experience,
    education: formData.education,
    job_titles_seeking: formData.job_titles_seeking,
    remote_preference: formData.remote_preference,
    preferred_locations: formData.preferred_locations,
    salary_expectation: formData.salary_expectation,
    cover_letter_tone: formData.cover_letter_tone,
    linkedin_url: formData.linkedin_url,
    portfolio_url: formData.portfolio_url,
    work_authorization: formData.work_authorization,
    resume_pdf_url: formData.resume_pdf_url,
    is_complete: isComplete,
    updated_at: new Date().toISOString(),
  };

  // Check if profile already exists
  const { data: existing } = await insforge.database
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  let error = null;

  if (existing) {
    // Update existing profile
    const { error: updateError } = await insforge.database
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);
    error = updateError;
  } else {
    // Insert new profile
    const { error: insertError } = await insforge.database
      .from("profiles")
      .insert([{
        id: user.id,
        email: user.email,
        ...profileData
      }]);
    error = insertError;
  }

  if (error) {
    console.error("Failed to save profile:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function uploadResume(formData: FormData) {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("resume") as File;
  if (!file) {
    return { success: false, message: "No file provided" };
  }

  // Fetch existing profile to get the old resume URL
  const { data: profile } = await insforge.database
    .from("profiles")
    .select("resume_pdf_url")
    .eq("id", user.id)
    .maybeSingle();

  // Delete the old file if it exists in the database
  if (profile?.resume_pdf_url) {
    try {
      const urlObj = new URL(profile.resume_pdf_url);
      const objectsPrefix = "/objects/";
      const objectsIndex = urlObj.pathname.indexOf(objectsPrefix);
      if (objectsIndex !== -1) {
        let encodedKey = urlObj.pathname.substring(objectsIndex + objectsPrefix.length);
        encodedKey = decodeURIComponent(encodedKey);
        let oldKey = encodedKey;
        if (encodedKey.startsWith("resumes/")) {
          oldKey = encodedKey.substring("resumes/".length);
        }
        await insforge.storage.from("resumes").remove(oldKey);
      }
    } catch (err) {
      console.warn("Failed to delete old resume from storage:", err);
    }
  }

  // Also remove the target path explicitly just in case using the original name
  const fileName = `${user.id}/${file.name}`;
  try {
    await insforge.storage.from("resumes").remove(fileName);
  } catch (err) {
    // Ignore error if it doesn't exist
  }

  const { data: uploadData, error: uploadError } = await insforge.storage
    .from("resumes")
    .upload(fileName, file);

  if (uploadError || !uploadData) {
    console.error("Failed to upload resume to storage:", uploadError);
    return { success: false, message: uploadError?.message || "Upload failed" };
  }

  // Update profile with the new resume PDF URL, or insert if it doesn't exist
  let dbError;
  if (profile) {
    const { error } = await insforge.database
      .from("profiles")
      .update({
        resume_pdf_url: uploadData.url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    dbError = error;
  } else {
    const { error } = await insforge.database
      .from("profiles")
      .insert([{
        id: user.id,
        email: user.email,
        resume_pdf_url: uploadData.url,
        is_complete: false,
        updated_at: new Date().toISOString(),
      }]);
    dbError = error;
  }

  if (dbError) {
    console.error("Failed to update profile resume URL:", dbError);
    return { success: false, message: dbError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true, url: uploadData.url };
}
