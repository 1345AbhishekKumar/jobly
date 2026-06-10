import OpenAI from "openai";

export interface ExtractedProfile {
  full_name?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  work_authorization?: "citizen" | "permanent_resident" | "visa_required";
  current_title?: string;
  experience_level?: "junior" | "mid" | "senior" | "lead";
  years_experience?: number;
  skills?: string[];
  industries?: string[];
  work_experience?: Array<{
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    current: boolean;
    responsibilities: string;
  }>;
  education?: Array<{
    degree: "High School" | "Associate" | "Bachelors" | "Masters" | "PhD";
    field: string;
    institution: string;
    year: string;
  }>;
  job_titles_seeking?: string[];
  remote_preference?: "any" | "remote" | "onsite" | "hybrid";
  salary_expectation?: string;
  preferred_locations?: string[];
  cover_letter_tone?: "formal" | "casual" | "enthusiastic";
}

const nvidiaApiKey = process.env.NVIDIA_API_KEY;

export const openai = new OpenAI({
  apiKey: nvidiaApiKey || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function extractResumeWithNvidiaAI(text: string): Promise<ExtractedProfile> {
  if (!nvidiaApiKey) {
    throw new Error("NVIDIA_API_KEY is not configured in environment variables.");
  }

  const systemPrompt = `You are a precise resume parser. Your job is to extract profile details from the raw text of a candidate's resume and return a single, valid JSON object matching the JSON schema below.

Required Rules:
1. Return ONLY the JSON object. Do not include any markdown wrappers (like \`\`\`json), explanation, or leading/trailing text.
2. The JSON schema must strictly contain these fields:
   - "full_name": string (candidate's full name)
   - "phone": string (phone number if found, otherwise empty string)
   - "location": string (city/state or city/country if found, otherwise empty string)
   - "linkedin_url": string (LinkedIn profile URL if found, otherwise empty string)
   - "portfolio_url": string (GitHub/personal site URL if found, otherwise empty string)
   - "work_authorization": string, must be one of: "citizen", "permanent_resident", "visa_required" (default to "citizen" if not specified)
   - "current_title": string (candidate's most recent or current job title)
   - "experience_level": string, must be one of: "junior", "mid", "senior", "lead" (estimate based on years/responsibilities)
   - "years_experience": number (total years of experience as an integer, e.g. 5)
   - "skills": array of strings (technical skills, tools, languages)
   - "industries": array of strings (e.g. "Software", "Fintech", "Healthcare", "E-commerce" based on work history)
   - "work_experience": array of objects representing up to 3 most recent work experiences, each containing:
     - "company": string
     - "jobTitle": string
     - "startDate": string (e.g., "January 2022")
     - "endDate": string (e.g., "Present" or "December 2023", or empty string if current is true)
     - "current": boolean (true if currently working here, false otherwise)
     - "responsibilities": string (summary paragraph or bullet points of achievements)
   - "education": array of up to 1 object representing the highest degree, containing:
     - "degree": string, must be one of: "High School", "Associate", "Bachelors", "Masters", "PhD" (map closest)
     - "field": string (e.g. "Computer Science")
     - "institution": string (school/university name)
     - "year": string (graduation year, e.g. "2020")
   - "job_titles_seeking": array of strings (job titles they are likely looking for based on history)
   - "remote_preference": string, must be one of: "any", "remote", "onsite", "hybrid" (default to "any")
   - "salary_expectation": string (e.g., "$120k+" if mentioned, otherwise empty string)
   - "preferred_locations": array of strings (based on target location or current location)
   - "cover_letter_tone": string, must be one of: "formal", "casual", "enthusiastic" (default to "formal")

Do not invent or fabricate details. Extract from the provided text. Make your best guess for enum fields if not explicitly specified.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Raw Resume Text:\n\n${text}` },
      ],
      temperature: 0.2,
      top_p: 1,
      max_tokens: 4096,
      stream: false,
      reasoning_effort: "high" as any,
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

    return JSON.parse(content) as ExtractedProfile;
  } catch (error) {
    console.error("Failed to parse or extract resume via NVIDIA API:", error);
    throw error;
  }
}
