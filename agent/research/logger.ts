import { createInsforgeServer } from "@/lib/insforge-server";

export async function logAgentMessage(
  insforge: Awaited<ReturnType<typeof createInsforgeServer>>,
  runId: string,
  userId: string,
  message: string,
  level: "info" | "success" | "warning" | "error",
  jobId: string | null = null
) {
  console.log(`[Agent Log - ${level.toUpperCase()}] ${message}`);
  try {
    await insforge.database.from("agent_logs").insert([
      {
        run_id: runId,
        user_id: userId,
        message,
        level,
        job_id: jobId,
        created_at: new Date().toISOString(),
      }
    ]);
  } catch (err) {
    console.error("Failed to write agent log:", err);
  }
}
