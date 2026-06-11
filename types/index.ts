export interface WorkExperience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
}

export interface Profile {
  id?: string;
  email?: string;
  full_name: string;
  phone: string;
  location: string;
  current_title: string;
  experience_level: string;
  years_experience: number | null;
  skills: string[];
  industries: string[];
  work_experience: WorkExperience[];
  education: Education[];
  job_titles_seeking: string[];
  remote_preference: string;
  preferred_locations: string[];
  salary_expectation: string;
  cover_letter_tone: string;
  linkedin_url: string;
  portfolio_url: string;
  work_authorization: string;
  resume_pdf_url?: string | null;
  is_complete?: boolean;
  updated_at?: string;
}
