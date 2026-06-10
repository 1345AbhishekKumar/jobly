"use server";

import { createInsforgeServer } from "@/lib/insforge-server";
import { PDFParse } from "pdf-parse";
import { extractResumeWithNvidiaAI, ExtractedProfile } from "@/lib/nvidia";

export interface ExtractionResult {
  success: boolean;
  message?: string;
  data?: ExtractedProfile;
}

export async function extractProfileFromResume(): Promise<ExtractionResult> {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    // 1. Fetch existing profile to get the actual resume URL
    const { data: profile, error: dbError } = await insforge.database
      .from("profiles")
      .select("resume_pdf_url")
      .eq("id", user.id)
      .maybeSingle();

    if (dbError || !profile?.resume_pdf_url) {
      console.error("Failed to fetch profile resume URL:", dbError);
      return { success: false, message: "No resume found. Please upload a resume first." };
    }

    // Parse the key
    let key = `${user.id}/resume.pdf`; // fallback
    try {
      const urlObj = new URL(profile.resume_pdf_url);
      const objectsPrefix = "/objects/";
      const objectsIndex = urlObj.pathname.indexOf(objectsPrefix);
      if (objectsIndex !== -1) {
        const encodedKey = urlObj.pathname.substring(objectsIndex + objectsPrefix.length);
        key = decodeURIComponent(encodedKey);
      }
    } catch (err) {
      console.warn("Failed to parse resume storage URL:", err);
    }

    // Download the PDF file using the actual key
    const { data: blob, error: downloadError } = await insforge.storage
      .from("resumes")
      .download(key);

    if (downloadError || !blob) {
      console.error("Failed to download resume from storage:", downloadError);
      return { success: false, message: "No resume found. Please upload a resume first." };
    }

    // 2. Convert Blob to Buffer for pdf-parse
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Extract text from PDF
    let text = "";
    let parser: PDFParse | null = null;
    try {
      parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text || "";
    } catch (err) {
      console.error("pdf-parse error:", err);
      return { success: false, message: "Could not extract text from this PDF. Please try a different file." };
    } finally {
      if (parser) {
        try {
          await parser.destroy();
        } catch (destroyErr) {
          console.error("Error destroying PDFParse instance:", destroyErr);
        }
      }
    }

    // 4. Validate extracted text
    const cleanText = text.trim();
    if (!cleanText || cleanText.length < 50) {
      return { success: false, message: "Could not extract text from this PDF. Please try a different file." };
    }

    // 5. Call NVIDIA API to extract structured details
    const extractedData = await extractResumeWithNvidiaAI(cleanText);

    return { success: true, data: extractedData };
  } catch (error: any) {
    console.error("Error in extractProfileFromResume server action:", error);
    return { success: false, message: error.message || "An unexpected error occurred during extraction." };
  }
}
