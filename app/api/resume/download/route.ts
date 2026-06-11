import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function GET() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Fetch existing profile to get the actual resume URL
  const { data: profile, error: dbError } = await insforge.database
    .from("profiles")
    .select("resume_pdf_url")
    .eq("id", user.id)
    .maybeSingle();

  if (dbError || !profile?.resume_pdf_url) {
    console.error("Failed to fetch profile resume URL:", dbError);
    return new Response("Resume URL not found in profile", { status: 404 });
  }

  // Parse the key and filename
  let key = `${user.id}/resume.pdf`; // fallback
  let filename = "resume.pdf";
  try {
    const urlObj = new URL(profile.resume_pdf_url);
    const objectsPrefix = "/objects/";
    const objectsIndex = urlObj.pathname.indexOf(objectsPrefix);
    if (objectsIndex !== -1) {
      let encodedKey = urlObj.pathname.substring(objectsIndex + objectsPrefix.length);
      encodedKey = decodeURIComponent(encodedKey);
      if (encodedKey.startsWith("resumes/")) {
        key = encodedKey.substring("resumes/".length);
      } else {
        key = encodedKey;
      }
      filename = key.substring(key.lastIndexOf("/") + 1);
    }
  } catch (err) {
    console.warn("Failed to parse resume storage URL:", err);
  }

  // Download the file using the actual key
  const { data: blob, error } = await insforge.storage
    .from("resumes")
    .download(key);

  if (error || !blob) {
    console.error("Failed to download resume from storage:", error);
    return new Response("Resume not found or failed to retrieve", { status: 404 });
  }

  // Stream the PDF back to the browser
  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store, max-age=0, must-revalidate",
    },
  });
}
