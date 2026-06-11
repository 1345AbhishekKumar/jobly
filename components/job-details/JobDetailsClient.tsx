"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Users,
  Target,
  HelpCircle,
  BookOpen,
  Globe,
  Loader2
} from "lucide-react";
import { MATCH_THRESHOLD } from "@/lib/utils";

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

  // Match score visual styling matching system guidelines
  const score = job.match_score || 0;
  let scoreBarColor = "bg-success"; // Green (>= 90%)
  let scoreBadgeBg = "bg-success-lightest text-success-foreground border-success-light";
  
  if (score < MATCH_THRESHOLD) {
    scoreBarColor = "bg-warning"; // Orange (< MATCH_THRESHOLD)
    scoreBadgeBg = "bg-warning/10 text-warning border-warning/20";
  } else if (score < 90) {
    scoreBarColor = "bg-info-dark"; // Blue (MATCH_THRESHOLD - 89%)
    scoreBadgeBg = "bg-info-lightest text-info-dark border-info-light";
  }

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

  // Trigger Research Agent (Feature 13 API route)
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

      // Refresh the page data from the server (which will fetch the newly populated company_research jsonb)
      router.refresh();
    } catch (err: any) {
      console.error("[JobDetailsClient] Research failed:", err);
      setResearchError(
        err.message || "Could not complete research. The agent might be temporarily offline."
      );
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
          
          {/* Header Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex items-start gap-4">
                {/* Squircle logo wrapper */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] border border-border bg-surface-secondary text-text-slate-medium shadow-sm">
                  <Building2 className="h-7 w-7" />
                </div>
                
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-semibold text-text-primary tracking-tight font-display leading-tight">
                    {job.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-base font-semibold text-text-secondary">
                      {job.company}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                    {job.source === "search" ? (
                      <span className="inline-flex items-center rounded-md bg-info-lightest px-2.5 py-0.5 text-xs font-semibold text-info-dark border border-info-light">
                        LinkedIn
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-surface-secondary border border-border px-2.5 py-0.5 text-xs font-semibold text-text-secondary">
                        URL
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {job.source_url && (
                  <a
                    href={job.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-surface border border-border px-4 py-2 text-sm font-semibold text-text-primary hover:bg-surface-secondary btn-interactive focus-ring shadow-sm"
                  >
                    View Job Post
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <a
                  href={job.external_apply_url || job.source_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark btn-interactive focus-ring shadow-sm"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Score Bar and Match percentage inside Header */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${scoreBadgeBg}`}>
                  {score}% Match
                </div>
                <div className="h-2 w-32 md:w-48 overflow-hidden rounded-full bg-border-light">
                  <div className={`h-full rounded-full ${scoreBarColor}`} style={{ width: `${score}%` }}></div>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Analyzed by JobPilot Matching Engine
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-text-muted">
                <DollarSign className="h-4 w-4 text-text-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Salary Est.</span>
              </div>
              <p className="text-sm font-semibold text-text-primary">
                {job.salary || "Not disclosed"}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-text-muted">
                <MapPin className="h-4 w-4 text-text-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Location</span>
              </div>
              <p className="text-sm font-semibold text-text-primary capitalize">
                {job.location || "Remote"}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-text-muted">
                <Briefcase className="h-4 w-4 text-text-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Job Type</span>
              </div>
              <p className="text-sm font-semibold text-text-primary capitalize">
                {job.job_type === "fulltime" ? "Full-time" : job.job_type === "parttime" ? "Part-time" : job.job_type || "Contract"}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm space-y-1.5">
              <div className="flex items-center gap-2 text-text-muted">
                <Calendar className="h-4 w-4 text-text-secondary" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Date Found</span>
              </div>
              <p className="text-sm font-semibold text-text-primary">
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-text-primary tracking-tight font-display border-b border-border pb-3">
              Job Details
            </h2>

            {/* About the Role */}
            {job.about_role && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-text-primary font-display">
                  About the Role
                </h3>
                <p className="text-sm text-text-primary leading-relaxed max-w-[75ch]">
                  {job.about_role}
                </p>
              </div>
            )}

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary font-display">
                  Key Responsibilities
                </h3>
                <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
                  {job.responsibilities.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary font-display">
                  Requirements
                </h3>
                <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
                  {job.requirements.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nice to Have */}
            {job.nice_to_have && job.nice_to_have.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary font-display">
                  Nice to Have / Preferred Qualifications
                </h3>
                <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
                  {job.nice_to_have.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary font-display">
                  Benefits & Perks
                </h3>
                <ul className="list-disc pl-5 text-sm text-text-primary space-y-2 max-w-[75ch]">
                  {job.benefits.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* About the Company */}
            {job.about_company && (
              <div className="space-y-2 pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-text-primary font-display">
                  About {job.company}
                </h3>
                <p className="text-sm text-text-primary leading-relaxed max-w-[75ch]">
                  {job.about_company}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Columns (Span 1): AI Insights & Company Research */}
        <div className="space-y-8">
          
          {/* AI Match Insights */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-accent border-b border-border pb-3">
              <Sparkles className="h-5 w-5" />
              <h2 className="text-base font-semibold text-text-primary tracking-tight font-display">
                AI Match Insights
              </h2>
            </div>

            {/* Reasoning Paragraph */}
            {job.match_reason && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Why you match
                </h3>
                <p className="text-sm text-text-primary leading-relaxed">
                  {job.match_reason}
                </p>
              </div>
            )}

            {/* Skills Comparison */}
            <div className="space-y-4 pt-4 border-t border-border">
              {/* Matched Skills */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Matched Skills ({job.matched_skills?.length || 0})
                  </span>
                </div>
                {job.matched_skills && job.matched_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {job.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-success-lightest px-2.5 py-0.5 text-xs font-medium text-success-foreground border border-success-light/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No matching skills identified.</p>
                )}
              </div>

              {/* Missing Skills */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-accent">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    Skills Gaps ({job.missing_skills?.length || 0})
                  </span>
                </div>
                {job.missing_skills && job.missing_skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {job.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-accent-muted px-2.5 py-0.5 text-xs font-medium text-accent border border-accent-light/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-text-muted">No skills gaps identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Research Agent Card */}
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-text-primary">
                <Globe className="h-5 w-5 text-accent" />
                <h2 className="text-base font-semibold text-text-primary tracking-tight font-display">
                  Company Research
                </h2>
              </div>
              {job.company_research && (
                <span className="inline-flex items-center rounded-md bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent border border-accent-light">
                  Agent Ready
                </span>
              )}
            </div>

            {/* Error Banner */}
            {researchError && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
                {researchError}
              </div>
            )}

            {/* Rendering based on state */}
            {!job.company_research ? (
              // Empty State
              <div className="space-y-4 py-2">
                <p className="text-sm text-text-secondary leading-relaxed">
                  Let our AI agent visit {job.company}'s website to research their tech stack, engineering culture, and strategic priorities. It will then prepare custom interview prep and outline your edge.
                </p>

                <button
                  type="button"
                  onClick={handleResearchClick}
                  disabled={isResearching}
                  className="w-full inline-flex h-10 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:bg-accent/70 btn-interactive focus-ring shadow-sm transition-all"
                >
                  {isResearching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Researching Company...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Research Company
                    </>
                  )}
                </button>
              </div>
            ) : (
              // Populated Research State (Premium Dossier View)
              <div className="space-y-6 divide-y divide-border pt-1">
                
                {/* Company Overview */}
                {job.company_research.companyOverview && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Company Overview
                    </h3>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {job.company_research.companyOverview}
                    </p>
                  </div>
                )}

                {/* Tech Stack */}
                {job.company_research.techStack && job.company_research.techStack.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Terminal className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Tech Stack
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.company_research.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center rounded-md bg-surface-secondary border border-border px-2 py-0.5 text-xs font-medium text-text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Culture */}
                {job.company_research.culture && job.company_research.culture.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Users className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Culture & Values
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {job.company_research.culture.map((val, idx) => (
                        <li key={idx} className="leading-relaxed">{val}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Why This Role */}
                {job.company_research.whyThisRole && (
                  <div className="space-y-2 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Strategic Importance of Role
                    </h3>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {job.company_research.whyThisRole}
                    </p>
                  </div>
                )}

                {/* Your Edge */}
                {job.company_research.yourEdge && job.company_research.yourEdge.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-success">
                      <Target className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Your Edge
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {job.company_research.yourEdge.map((edge, idx) => (
                        <li key={idx} className="leading-relaxed">{edge}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gaps to Address */}
                {job.company_research.gapsToAddress && job.company_research.gapsToAddress.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-accent">
                      <HelpCircle className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Addressing Skills Gaps
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {job.company_research.gapsToAddress.map((gap, idx) => (
                        <li key={idx} className="leading-relaxed">{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Interview Prep */}
                {job.company_research.interviewPrep && job.company_research.interviewPrep.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <BookOpen className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Interview Prep
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {job.company_research.interviewPrep.map((prep, idx) => (
                        <li key={idx} className="leading-relaxed">{prep}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Smart Questions */}
                {job.company_research.smartQuestions && job.company_research.smartQuestions.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Questions to Ask Them
                    </h3>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {job.company_research.smartQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed font-medium text-text-dark">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sources */}
                {job.company_research.sources && job.company_research.sources.length > 0 && (
                  <div className="space-y-2 pt-4 text-[10px] text-text-muted">
                    <span className="font-semibold uppercase tracking-wider">Researched Pages</span>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                      {job.company_research.sources.map((src, idx) => (
                        <a
                          key={idx}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-accent truncate max-w-[200px]"
                        >
                          {src}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
