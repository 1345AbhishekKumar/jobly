import { NextResponse } from "next/server";
import React from "react";
import { createInsforgeServer } from "@/lib/insforge-server";
import { generateResumeContent } from "@/lib/nvidia";
import { ResumePDFTemplate } from "@/components/profile/ResumePDFTemplate";
import { renderToBuffer } from "@react-pdf/renderer";
import { revalidatePath } from "next/cache";

export async function POST() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 1. Fetch the user's profile from the database
  const { data: profile, error: profileError } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    console.error("Failed to fetch profile:", profileError);
    return NextResponse.json(
      { success: false, message: "Please save your profile information first." },
      { status: 400 }
    );
  }

  if (!profile.full_name?.trim()) {
    return NextResponse.json(
      { success: false, message: "Please save your Full Name in your profile first." },
      { status: 400 }
    );
  }

  try {
    // 2. Call Nvidia gpt-oss-120b to generate/polish resume text
    const polishedContent = await generateResumeContent(profile);

    // 3. Render the PDF template to a Buffer
    const pdfBuffer = await renderToBuffer(
      React.createElement(ResumePDFTemplate, {
        profile: {
          full_name: profile.full_name,
          email: profile.email || user.email,
          phone: profile.phone,
          location: profile.location,
          linkedin_url: profile.linkedin_url,
          portfolio_url: profile.portfolio_url,
          skills: profile.skills,
          education: profile.education,
        },
        polished: polishedContent,
      }) as React.ReactElement
    );

    // 4. Clean up any existing resume in storage (to avoid auto-renaming)
    if (profile.resume_pdf_url) {
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

    const defaultKey = `${user.id}/resume.pdf`;
    try {
      await insforge.storage.from("resumes").remove(defaultKey);
    } catch {
      // Ignore
    }

    // 5. Upload the PDF buffer to InsForge storage
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], { type: "application/pdf" });

    const { data: uploadData, error: uploadError } = await insforge.storage
      .from("resumes")
      .upload(defaultKey, pdfBlob);

    if (uploadError || !uploadData) {
      console.error("Failed to upload generated resume to storage:", uploadError);
      return NextResponse.json(
        { success: false, message: uploadError?.message || "Failed to upload generated PDF." },
        { status: 500 }
      );
    }

    // 6. Update the profile row with the new resume URL
    const { error: dbError } = await insforge.database
      .from("profiles")
      .update({
        resume_pdf_url: uploadData.url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (dbError) {
      console.error("Failed to update profile resume URL:", dbError);
      return NextResponse.json(
        { success: false, message: dbError.message || "Failed to update profile with resume URL." },
        { status: 500 }
      );
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");
    return NextResponse.json({ success: true, url: uploadData.url });
  } catch (error: unknown) {
    console.error("Failed to generate resume:", error);
    const message = error instanceof Error ? error.message : "Failed to generate resume.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
