import { openai } from "@/lib/nvidia";
import { ScoredJob } from "./types";

export async function scoreJobAgainstProfile(
  jobTitle: string,
  jobDescription: string,
  profile: {
    current_title?: string;
    experience_level?: string;
    years_experience?: number | null;
    skills?: string[];
  }
): Promise<ScoredJob> {
  const systemPrompt = `You are a precise job matching assistant. Your job is to compare a job's title and description snippet against a candidate's profile and evaluate the compatibility. You must return a single, valid JSON object matching the JSON schema below.

Required Rules:
1. Return ONLY the JSON object. Do not include any markdown wrappers (like \`\`\`json), explanation, or leading/trailing text.
2. The JSON schema must strictly contain these fields:
   - "matchScore": number (an integer between 0 and 100 representing how well the candidate matches the job)
   - "matchReason": string (a concise 1-paragraph explanation of the match, highlighting alignment or missing skills)
   - "matchedSkills": array of strings (skills/technologies mentioned in the job description that the candidate possesses)
   - "missingSkills": array of strings (required skills/technologies mentioned in the job description that the candidate lacks)

Candidate profile details to match against:
- Title: ${profile.current_title || "N/A"}
- Experience Level: ${profile.experience_level || "N/A"}
- Years of Experience: ${profile.years_experience || "N/A"}
- Candidate's Skills: ${profile.skills?.join(", ") || "N/A"}`;

  const userPrompt = `Job Title: ${jobTitle}
Job Description Snippet: ${jobDescription}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      top_p: 1,
      max_tokens: 1024,
      stream: false,
    });

    let content = completion.choices[0]?.message?.content?.trim() || "";

    if (!content) {
      throw new Error("NVIDIA API response did not contain content choices.");
    }

    // Clean up markdown wrappers if returned
    if (content.startsWith("```json")) {
      content = content.substring(7);
    } else if (content.startsWith("```")) {
      content = content.substring(3);
    }
    if (content.endsWith("```")) {
      content = content.substring(0, content.length - 3);
    }
    content = content.trim();

    const parsed = JSON.parse(content);

    return {
      matchScore: typeof parsed.matchScore === "number" ? parsed.matchScore : 50,
      matchReason: typeof parsed.matchReason === "string" ? parsed.matchReason : "Matching complete.",
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
    };
  } catch (error) {
    console.error("Failed to score job via NVIDIA API:", error);
    // Graceful fallback to avoid failing the whole run
    return {
      matchScore: 50,
      matchReason: "Failed to parse compatibility score from model. Defaulted to neutral match.",
      matchedSkills: [],
      missingSkills: [],
    };
  }
}
