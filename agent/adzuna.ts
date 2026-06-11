import { createInsforgeServer } from "@/lib/insforge-server";
import { searchJobs } from "@/lib/adzuna";
import { scoreJobAgainstProfile } from "./matcher";
import { createPostHogServer } from "@/lib/posthog-server";

async function logAgentMessage(
  insforge: Awaited<ReturnType<typeof createInsforgeServer>>,
  runId: string,
  userId: string,
  message: string,
  level: "info" | "success" | "warning" | "error",
  jobId: string | null = null
) {
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

export async function discoverJobs(
  userId: string,
  jobTitle: string,
  location: string
): Promise<{ success: boolean; jobsFoundCount?: number; strongJobsCount?: number; error?: string }> {
  const insforge = await createInsforgeServer();
  const posthog = createPostHogServer();

  let runId = "";
  try {
    // 1. Create agent run record
    const { data: run, error: runError } = await insforge
      .database.from("agent_runs")
      .insert([
        {
          user_id: userId,
          status: "running",
          job_title_searched: jobTitle,
          location_searched: location,
          jobs_found: 0,
          started_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (runError || !run) {
      throw new Error(`Failed to create agent run: ${runError?.message || "Unknown error"}`);
    }

    runId = run.id;

    // Log start
    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Started Adzuna job search for "${jobTitle}" in "${location}"`,
      "info"
    );

    // Track event
    posthog.capture({
      distinctId: userId,
      event: "job_search_started",
      properties: { userId, jobTitle, location },
    });

    // 2. Load candidate profile
    const { data: profile, error: profileError } = await insforge
      .database.from("profiles")
      .select("current_title, experience_level, years_experience, skills")
      .eq("id", userId)
      .single();

    if (profileError) {
      await logAgentMessage(
        insforge,
        runId,
        userId,
        `Warning: Could not fetch user profile details: ${profileError.message}. Matching may be less accurate.`,
        "warning"
      );
    }

    // 3. Country detection
    let country = "us";
    const locLower = location.toLowerCase();
    if (locLower.includes("london") || locLower.includes("uk") || locLower.includes("united kingdom") || locLower.includes("gb")) {
      country = "gb";
    } else if (locLower.includes("canada") || locLower.includes("ca")) {
      country = "ca";
    } else if (locLower.includes("australia") || locLower.includes("au")) {
      country = "au";
    }

    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Querying Adzuna API for country: ${country.toUpperCase()}`,
      "info"
    );

    // 4. Fetch jobs from Adzuna
    const adzunaJobs = await searchJobs(jobTitle, location, country);
    
    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Adzuna returned ${adzunaJobs.length} jobs. Starting scoring and save loop.`,
      "info"
    );

    let successfullySavedJobs = 0;
    let strongJobsCount = 0;

    // 5. Score and save each job
    for (const job of adzunaJobs) {
      try {
        // Run GPT compatibility matcher
        const scored = await scoreJobAgainstProfile(
          job.title,
          job.description,
          profile || {}
        );

        if (scored.matchScore >= 70) {
          strongJobsCount++;
        }

        // Format salary range string
        let salaryStr: string | null = null;
        if (job.salary_min) {
          const minK = Math.round(job.salary_min / 1000);
          const maxK = job.salary_max ? Math.round(job.salary_max / 1000) : minK;
          salaryStr = minK === maxK ? `$${minK}k` : `$${minK}k - $${maxK}k`;
        }

        // Map contract type
        const jobType = job.contract_type === "contract" ? "contract" : "fulltime";

        const jobRecord = {
          user_id: userId,
          run_id: runId,
          source: "search", // Always 'search' for Adzuna
          source_url: job.redirect_url,
          external_apply_url: job.redirect_url,
          title: job.title,
          company: job.company?.display_name || "Unknown Company",
          location: job.location?.display_name || location,
          salary: salaryStr,
          job_type: jobType,
          about_role: job.description,
          responsibilities: [],
          requirements: [],
          nice_to_have: [],
          benefits: [],
          about_company: null,
          match_score: scored.matchScore,
          match_reason: scored.matchReason,
          matched_skills: scored.matchedSkills,
          missing_skills: scored.missingSkills,
          found_at: new Date().toISOString(),
        };

        // Insert job record
        const { error: saveError } = await insforge
           .database.from("jobs")
           .insert([jobRecord])
           .select()
           .single();

        if (saveError) {
          console.error("Failed to save job record:", saveError);
          await logAgentMessage(
            insforge,
            runId,
            userId,
            `Failed to save job "${job.title}" at "${jobRecord.company}": ${saveError.message}`,
            "warning"
          );
          continue;
        }

        successfullySavedJobs++;

        // Track job found event
        posthog.capture({
          distinctId: userId,
          event: "job_found",
          properties: {
            userId,
            source: "search",
            matchScore: scored.matchScore,
          },
        });

      } catch (jobErr) {
        console.error(`Error processing job ${job.title}:`, jobErr);
        await logAgentMessage(
          insforge,
          runId,
          userId,
          `Error processing job "${job.title}": ${String(jobErr)}`,
          "warning"
        );
      }
    }

    // 6. Update agent run record
    const { error: updateError } = await insforge
      .database.from("agent_runs")
      .update({
        status: "completed",
        jobs_found: successfullySavedJobs,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    if (updateError) {
      console.error("Failed to update agent run:", updateError);
    }

    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Adzuna job discovery completed. Discovered and scored ${successfullySavedJobs} jobs successfully.`,
      "success"
    );

    await posthog.shutdown();

    return { success: true, jobsFoundCount: successfullySavedJobs, strongJobsCount };

  } catch (error) {
    console.error("discoverJobs orchestrator failed:", error);

    // Try to update agent run status to failed
    if (runId) {
      try {
        await insforge
          .database.from("agent_runs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", runId);

        await logAgentMessage(
          insforge,
          runId,
          userId,
          `Job discovery failed: ${String(error)}`,
          "error"
        );
      } catch (updateErr) {
        console.error("Failed to update failed run status:", updateErr);
      }
    }

    await posthog.shutdown();
    return { success: false, error: String(error) };
  }
}
