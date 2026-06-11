import { test, expect, mock } from "bun:test";

// Mock data for test
const mockJob = {
  id: "test-job-id",
  user_id: "test-user-id",
  title: "Senior Software Engineer",
  company: "Google",
  location: "Mountain View, CA",
  source_url: "https://about.google/stories/",
  external_apply_url: "https://about.google/stories/",
  matched_skills: ["React", "TypeScript", "Node.js"],
  missing_skills: ["Python"],
  about_role: "We are looking for a Senior Software Engineer to join our team.",
  responsibilities: ["Build amazing UIs", "Collaborate with cross-functional teams"],
  requirements: ["BS in Computer Science or equivalent", "5+ years of experience in React"],
};

const mockProfile = {
  current_title: "Frontend Engineer",
  experience_level: "senior",
  years_experience: 5,
  skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS"],
  work_experience: [
    {
      company: "Acme Corp",
      jobTitle: "Software Engineer",
      startDate: "2020-01",
      endDate: "2023-12",
      current: false,
      responsibilities: "Developed web applications.",
    }
  ],
};

const mockDatabase = {
  from: (table: string) => {
    return {
      select: () => {
        return {
          eq: (col: string, val: any) => {
            return {
              eq: (col2: string, val2: any) => {
                return {
                  single: async () => {
                    if (table === "jobs") {
                      return { data: mockJob, error: null };
                    }
                    return { data: null, error: new Error("Not found") };
                  }
                };
              },
              single: async () => {
                if (table === "profiles") {
                  return { data: mockProfile, error: null };
                }
                return { data: null, error: new Error("Not found") };
              }
            };
          }
        };
      },
      insert: (rows: any[]) => {
        return {
          select: () => {
            return {
              single: async () => {
                return { data: { id: "test-run-id" }, error: null };
              }
            };
          }
        };
      },
      update: (fields: any) => {
        return {
          eq: (col: string, val: any) => {
            return {
              eq: (col2: string, val2: any) => {
                console.log(`Database update complete for ${table}:`, fields);
                return Promise.resolve({ error: null });
              },
              // For run_id update
              then: (cb: any) => {
                console.log(`Database run status update for ${table}:`, fields);
                return cb({ error: null });
              }
            };
          }
        };
      }
    };
  }
};

const mockInsforgeClient = {
  database: mockDatabase,
  auth: {
    getCurrentUser: async () => {
      return { data: { user: { id: "test-user-id" } } };
    }
  }
};

mock.module("./lib/insforge-server", () => {
  return {
    createInsforgeServer: async () => {
      return mockInsforgeClient;
    },
  };
});

// Import research agent after mocking insforge-server
import { researchCompany } from "./agent/research";

test("researchCompany agent unit test", async () => {
  const userId = "test-user-id";
  const jobId = "test-job-id";

  console.log("Starting company research agent test...");
  const start = Date.now();
  const result = await researchCompany(userId, jobId);
  const duration = ((Date.now() - start) / 1000).toFixed(2);

  console.log(`Research completed in ${duration}s.`);
  console.log("Result success status:", result.success);

  if (result.success && result.dossier) {
    console.log("Dossier Overview:\n", result.dossier.companyOverview);
    console.log("Dossier Tech Stack:\n", result.dossier.techStack.join(", "));
    console.log("Dossier Culture:\n", result.dossier.culture.join(", "));
    console.log("Dossier Edge:\n", result.dossier.yourEdge.join(", "));
    console.log("Dossier Questions:\n", result.dossier.smartQuestions.join(", "));
    console.log("Dossier Sources:\n", result.dossier.sources.join(", "));
  } else {
    console.error("Research failed:", result.error);
  }

  expect(result.success).toBe(true);
}, 60000); // 60s timeout
