export interface Job {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  salary: string;
  source: "LinkedIn" | "URL";
  dateFound: string;
}
