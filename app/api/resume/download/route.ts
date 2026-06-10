import { NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";

export async function GET() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Download the file from the resumes bucket
  // Path is resumes/{user_id}/resume.pdf
  const { data: blob, error } = await insforge.storage
    .from("resumes")
    .download(`${user.id}/resume.pdf`);

  if (error || !blob) {
    console.error("Failed to download resume from storage:", error);
    return new Response("Resume not found or failed to retrieve", { status: 404 });
  }

  // Stream the PDF back to the browser
  return new Response(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
    },
  });
}
