import { AdzunaJob } from "@/lib/adzuna";

export interface ScoredJob {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
  missingSkills: string[];
}

export type { AdzunaJob };
