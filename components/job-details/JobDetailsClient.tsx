"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Extracted subcomponents
import { JobHeader } from "./JobHeader";
import { JobMetadata } from "./JobMetadata";
import { JobDescriptionContent } from "./JobDescriptionContent";
import { JobFitInsights } from "./JobFitInsights";
import { CompanyResearchPrep } from "./CompanyResearchPrep";

interface CompanyResearchDossier {
  companyOverview?: string;
  techStack?: string[];
  culture?: string[];
  whyThisRole?: string;
  yourEdge?: string[];
  gapsToAddress?: string[];
  smartQuestions?: string[];
  interviewPrep?: string[];
  sources?: string[];
}

interface JobDetailsClientProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
    job_type?: string;
    about_role?: string;
    responsibilities?: string[];
    requirements?: string[];
    nice_to_have?: string[];
    benefits?: string[];
    about_company?: string;
    match_score: number;
    match_reason?: string;
    matched_skills?: string[];
    missing_skills?: string[];
    company_research?: CompanyResearchDossier | null;
    source_url?: string;
    external_apply_url?: string;
    source?: string;
    found_at?: string;
    created_at?: string;
  };
}

export function JobDetailsClient({ job }: JobDetailsClientProps) {
  const router = useRouter();
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"company" | "fit" | "prep">("company");

  // Format Date Helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const formattedDate = formatDate(job.found_at || job.created_at);

  // Trigger Research Agent
  const handleResearchClick = async () => {
    setIsResearching(true);
    setResearchError(null);

    try {
      const res = await fetch("/api/agent/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to trigger research agent.");
      }

      router.refresh();
    } catch (err: unknown) {
      console.error("[JobDetailsClient] Research failed:", err);
      const errMsg = err instanceof Error ? err.message : "Could not complete research. The agent might be temporarily offline.";
      setResearchError(errMsg);
    } finally {
      setIsResearching(false);
    }
  };

  return (
    <div className="space-y-8 animate-hero-fade">
      {/* Back Link */}
      <div>
        <Link
          href="/find-jobs"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>
      </div>

      {/* Main Grid: Details (Left) + Match Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns (Span 2): Job Headers and Job Content */}
        <div className="lg:col-span-2 space-y-8">
          
          <JobHeader
            title={job.title}
            company={job.company}
            source={job.source}
            source_url={job.source_url}
            external_apply_url={job.external_apply_url}
            match_score={job.match_score}
          />

          <JobMetadata
            salary={job.salary}
            location={job.location}
            job_type={job.job_type}
            formattedDate={formattedDate}
          />

          <JobDescriptionContent
            company={job.company}
            about_role={job.about_role}
            responsibilities={job.responsibilities}
            requirements={job.requirements}
            nice_to_have={job.nice_to_have}
            benefits={job.benefits}
            about_company={job.about_company}
          />
        </div>

        {/* Right Column (Span 1): AI Insights & Company Research */}
        <div className="space-y-8">
          
          <JobFitInsights
            match_reason={job.match_reason}
            matched_skills={job.matched_skills}
            missing_skills={job.missing_skills}
          />

          <CompanyResearchPrep
            company={job.company}
            company_research={job.company_research}
            isResearching={isResearching}
            researchError={researchError}
            handleResearchClick={handleResearchClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

      </div>
    </div>
  );
}
