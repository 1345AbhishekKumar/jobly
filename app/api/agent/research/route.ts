import { NextRequest, NextResponse } from "next/server";
import { createInsforgeServer } from "@/lib/insforge-server";
import { researchCompany } from "@/agent/research";

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer();
    const { data: { user } } = await insforge.auth.getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { jobId } = body;

    if (!jobId || typeof jobId !== "string" || !jobId.trim()) {
      return NextResponse.json(
        { success: false, error: "Job ID is required" },
        { status: 400 }
      );
    }

    const result = await researchCompany(user.id, jobId.trim());

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to research company" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: result.dossier });
  } catch (error) {
    console.error("[api/agent/research] Endpoint failed:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
