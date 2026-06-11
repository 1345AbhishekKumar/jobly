import { createInsforgeServer } from "@/lib/insforge-server";
import { openai } from "@/lib/nvidia";
import { createPostHogServer } from "@/lib/posthog-server";
import { logAgentMessage } from "./research/logger";
import { resolveHomepageUrl, scrapeCompanyDetails } from "./research/scraper";

export interface CompanyResearchDossier {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
}

export async function researchCompany(
  userId: string,
  jobId: string
): Promise<{ success: boolean; dossier?: CompanyResearchDossier; error?: string }> {
  console.log(`[Research Agent] Starting research run. Job: ${jobId}, User: ${userId}`);
  const insforge = await createInsforgeServer();
  const posthog = createPostHogServer();

  let runId = "";
  let companyNameForPostHog = "Unknown";
  let resolvedSources: string[] = [];

  try {
    // 1. Fetch Job from DB
    console.log("[Research Agent] Fetching job details from database...");
    const { data: job, error: jobError } = await insforge.database
      .from("jobs")
      .select("*")
      .eq("id", jobId)
      .eq("user_id", userId)
      .single();

    if (jobError || !job) {
      throw new Error(`Job not found or unauthorized: ${jobError?.message || "Unknown error"}`);
    }

    companyNameForPostHog = job.company;
    console.log(`[Research Agent] Job fetched. Company: ${job.company}, Title: ${job.title}`);

    // 2. Create agent run record for visibility
    console.log("[Research Agent] Creating agent run record...");
    const { data: run, error: runError } = await insforge.database
      .from("agent_runs")
      .insert([
        {
          user_id: userId,
          status: "running",
          job_title_searched: `Research: ${job.company}`,
          location_searched: "Website Scraper",
          jobs_found: 0,
          started_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (runError || !run) {
      throw new Error(`Failed to create agent run record: ${runError?.message || "Unknown error"}`);
    }

    runId = run.id;
    console.log(`[Research Agent] Agent run created. Run ID: ${runId}`);

    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Triggered research agent for "${job.company}" (${job.title})`,
      "info",
      jobId
    );

    // 3. Fetch User Profile details
    console.log("[Research Agent] Fetching user profile...");
    const { data: profile, error: profileError } = await insforge.database
      .from("profiles")
      .select("current_title, experience_level, years_experience, skills, work_experience")
      .eq("id", userId)
      .single();

    if (profileError) {
      await logAgentMessage(
        insforge,
        runId,
        userId,
        `Could not retrieve candidate profile: ${profileError.message}. Synthesizing with limited candidate data.`,
        "warning",
        jobId
      );
    } else {
      console.log(`[Research Agent] Profile fetched. Skills: ${profile?.skills?.join(", ")}`);
    }

    // 4. Resolve domain name
    const { resolvedUrl, sources } = await resolveHomepageUrl(job.company, job.source_url, job.external_apply_url);
    resolvedSources = sources;

    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Resolved homepage URL to: ${resolvedUrl}`,
      "info",
      jobId
    );

    // 5. Scrape using deep BrowserScraper module
    const { collectedResearch, sources: scrapedSources } = await scrapeCompanyDetails(
      resolvedUrl,
      async (message, level) => {
        await logAgentMessage(insforge, runId, userId, message, level, jobId);
      }
    );

    // Merge homepage and scraped subpages into resolvedSources
    resolvedSources = scrapedSources;

    // 6. Synthesize Company Research Dossier using gpt-oss-120b
    console.log("[Research Agent] Initiating synthesis call to NVIDIA API...");
    await logAgentMessage(
      insforge,
      runId,
      userId,
      "Synthesizing customized company dossier with gpt-oss-120b...",
      "info",
      jobId
    );

    const systemPrompt = `You are a sharp career strategist preparing a candidate to apply for a specific role.
You are given (a) research collected from the company's own website, (b) the job posting,
and (c) the candidate's profile. Produce a concise, concrete briefing that gives this
specific candidate an edge for this specific role.

Rules:
1. Ground every company claim in the provided research or job posting. Never invent funding, customers, headcount, or facts. If research was thin, infer carefully from the job posting and say what's inferred.
2. Be specific to THIS candidate. Connect their actual skills and past work to this company's stack, product, and values. No generic advice that would apply to anyone.
3. Turn the candidate's missing skills into a strategy: how to frame the gap honestly and what adjacent experience to lean on.
4. Talking points and questions must reference real things from the research, the kind of detail that signals the candidate did their homework.
5. Keep every item tight: one or two sentences. No fluff.
6. The JSON schema must strictly contain these fields:
   - "companyOverview": string (brief overview of the company, product, and market positioning)
   - "techStack": array of strings (technologies, languages, tools, frameworks mentioned or inferred)
   - "culture": array of strings (key values, work styles, engineering culture)
   - "whyThisRole": string (strategic importance of this role within the company/project context)
   - "yourEdge": array of strings (specific candidate traits, matching skills, or experience that give them an edge)
   - "gapsToAddress": array of strings (actionable advice on framing skills gaps or missing requirements constructively)
   - "smartQuestions": array of strings (insightful, specific questions to ask the interviewer showing deep prep)
   - "interviewPrep": array of strings (customized topics, skills, or stories the candidate should prepare)
   - "sources": array of strings (URLs used in the research)

Return ONLY a valid JSON object. Do not include markdown wrappers (like \`\`\`json), explanations, or leading/trailing text.`;

    const userPrompt = `COMPANY RESEARCH (from website):
${collectedResearch || "No direct website content could be extracted. Use the company name and job posting details to synthesize."}

JOB POSTING:
Company: ${job.company}
Title: ${job.title}
Location: ${job.location}
Salary: ${job.salary || "N/A"}
Description: ${job.about_role || "N/A"}
Responsibilities: ${job.responsibilities?.join("; ") || "N/A"}
Requirements: ${job.requirements?.join("; ") || "N/A"}
Matched Skills: ${job.matched_skills?.join(", ") || "N/A"}
Missing Skills: ${job.missing_skills?.join(", ") || "N/A"}

CANDIDATE PROFILE:
Current Title: ${profile?.current_title || "N/A"}
Experience Level: ${profile?.experience_level || "N/A"}
Years of Experience: ${profile?.years_experience || "N/A"}
Candidate Skills: ${profile?.skills?.join(", ") || "N/A"}
Candidate Work History: ${JSON.stringify(profile?.work_experience || [])}`;

    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2500,
    });

    let content = completion.choices[0]?.message?.content?.trim() || "";
    console.log(`[Research Agent] Received model response. Content length: ${content.length}`);
    
    if (content.startsWith("```json")) {
      content = content.substring(7);
    } else if (content.startsWith("```")) {
      content = content.substring(3);
    }
    if (content.endsWith("```")) {
      content = content.substring(0, content.length - 3);
    }
    content = content.trim();

    let dossier: CompanyResearchDossier;
    try {
      const parsed = JSON.parse(content);
      dossier = {
        companyOverview: typeof parsed.companyOverview === "string" ? parsed.companyOverview : `Overview of ${job.company}`,
        techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
        culture: Array.isArray(parsed.culture) ? parsed.culture : [],
        whyThisRole: typeof parsed.whyThisRole === "string" ? parsed.whyThisRole : `Critical role for ${job.company}`,
        yourEdge: Array.isArray(parsed.yourEdge) ? parsed.yourEdge : [],
        gapsToAddress: Array.isArray(parsed.gapsToAddress) ? parsed.gapsToAddress : [],
        smartQuestions: Array.isArray(parsed.smartQuestions) ? parsed.smartQuestions : [],
        interviewPrep: Array.isArray(parsed.interviewPrep) ? parsed.interviewPrep : [],
        sources: Array.isArray(parsed.sources) && parsed.sources.length > 0 ? parsed.sources : resolvedSources,
      };
      console.log("[Research Agent] Dossier parsed successfully.");
    } catch (parseErr) {
      console.error("[Research Agent] Failed to parse dossier JSON:", parseErr);
      await logAgentMessage(
        insforge,
        runId,
        userId,
        "Failed to parse dossier JSON from model. Generating fallback dossier.",
        "warning",
        jobId
      );
      
      dossier = {
        companyOverview: `${job.company} is a leading organization seeking a talented ${job.title} to join their team in ${job.location}.`,
        techStack: job.requirements || [],
        culture: ["Collaborative", "Tech-driven", "Results-oriented"],
        whyThisRole: `This role presents a great opportunity to apply ${job.matched_skills?.join(", ") || "software"} skills to impact ${job.company}'s goals.`,
        yourEdge: [`Experience matching key requirements for ${job.title}.`],
        gapsToAddress: [`Prepare to discuss how you've quickly learned new tools in the past to address: ${job.missing_skills?.join(", ") || "missing requirements"}.`],
        smartQuestions: [`What are the immediate priorities for the ${job.title} joining the team?`],
        interviewPrep: [`Review the job responsibilities and practice explaining matching projects.`],
        sources: resolvedSources,
      };
    }

    // 7. Save to DB
    console.log("[Research Agent] Saving dossier to jobs table...");
    const { error: saveError } = await insforge.database
      .from("jobs")
      .update({
        company_research: dossier
      })
      .eq("id", jobId)
      .eq("user_id", userId);

    if (saveError) {
      throw new Error(`Failed to save company research to database: ${saveError.message}`);
    }
    console.log("[Research Agent] Dossier saved successfully.");

    // 8. Complete Agent Run
    console.log("[Research Agent] Completing agent run record...");
    await insforge.database
      .from("agent_runs")
      .update({
        status: "completed",
        jobs_found: 1,
        completed_at: new Date().toISOString(),
      })
      .eq("id", runId);

    await logAgentMessage(
      insforge,
      runId,
      userId,
      `Company research for "${job.company}" completed successfully. Dossier saved.`,
      "success",
      jobId
    );

    posthog.capture({
      distinctId: userId,
      event: "company_researched",
      properties: { userId, jobId, company: job.company },
    });

    await posthog.shutdown();
    console.log("[Research Agent] Complete.");

    return { success: true, dossier };

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Research Agent] Fatal error occurred:", error);

    if (runId) {
      try {
        await insforge.database
          .from("agent_runs")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
          })
          .eq("id", runId);

        await logAgentMessage(
          insforge,
          runId,
          userId,
          `Company research failed: ${errorMsg}`,
          "error",
          jobId
        );
      } catch (dbErr) {
        console.error("Failed to write failure status to DB:", dbErr);
      }
    }

    posthog.capture({
      distinctId: userId,
      event: "company_research_failed",
      properties: { userId, jobId, company: companyNameForPostHog, error: errorMsg },
    });

    await posthog.shutdown();

    return { success: false, error: errorMsg };
  }
}
