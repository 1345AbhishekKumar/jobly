import React from "react";
import { Sparkles, Globe, Loader2, Terminal, Users, Target, HelpCircle, BookOpen } from "lucide-react";

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

interface CompanyResearchPrepProps {
  company: string;
  company_research?: CompanyResearchDossier | null;
  isResearching: boolean;
  researchError: string | null;
  handleResearchClick: () => Promise<void>;
  activeTab: "company" | "fit" | "prep";
  setActiveTab: (val: "company" | "fit" | "prep") => void;
}

export function CompanyResearchPrep({
  company,
  company_research,
  isResearching,
  researchError,
  handleResearchClick,
  activeTab,
  setActiveTab,
}: CompanyResearchPrepProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 text-text-primary">
          <Globe className="h-5 w-5 text-accent" />
          <h2 className="text-base font-semibold text-text-primary tracking-tight font-display">
            Company Research
          </h2>
        </div>
        {company_research && (
          <span className="inline-flex items-center rounded-md bg-accent-light px-2 py-0.5 text-xs font-semibold text-accent border border-accent-light">
            Agent Ready
          </span>
        )}
      </div>

      {researchError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium">
          {researchError}
        </div>
      )}

      {!company_research ? (
        <div className="space-y-4 py-2">
          <p className="text-sm text-text-secondary leading-relaxed">
            Let our AI agent visit {company}&apos;s website to research their tech stack, engineering culture, and strategic priorities. It will then prepare custom interview prep and outline your edge.
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
        <div className="space-y-4 pt-1">
          <div className="flex p-1 bg-surface-secondary border border-border rounded-lg mb-2">
            <button
              onClick={() => setActiveTab("company")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "company"
                  ? "bg-surface text-accent shadow-sm border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Company
            </button>
            <button
              onClick={() => setActiveTab("fit")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "fit"
                  ? "bg-surface text-accent shadow-sm border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              My Fit
            </button>
            <button
              onClick={() => setActiveTab("prep")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === "prep"
                  ? "bg-surface text-accent shadow-sm border border-border"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Prep Guide
            </button>
          </div>

          <div className="divide-y divide-border space-y-4">
            {activeTab === "company" && (
              <div className="space-y-4 animate-fade-in">
                {company_research.companyOverview && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Company Overview
                    </h3>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {company_research.companyOverview}
                    </p>
                  </div>
                )}

                {company_research.techStack && company_research.techStack.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Terminal className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Tech Stack
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {company_research.techStack.map((tech) => (
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

                {company_research.culture && company_research.culture.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <Users className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Culture & Values
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {company_research.culture.map((val, idx) => (
                        <li key={idx} className="leading-relaxed">{val}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "fit" && (
              <div className="space-y-4 animate-fade-in">
                {company_research.whyThisRole && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Strategic Importance of Role
                    </h3>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {company_research.whyThisRole}
                    </p>
                  </div>
                )}

                {company_research.yourEdge && company_research.yourEdge.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-success">
                      <Target className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Your Edge
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {company_research.yourEdge.map((edge, idx) => (
                        <li key={idx} className="leading-relaxed">{edge}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {company_research.gapsToAddress && company_research.gapsToAddress.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-accent">
                      <HelpCircle className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                        Addressing Skills Gaps
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {company_research.gapsToAddress.map((gap, idx) => (
                        <li key={idx} className="leading-relaxed">{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "prep" && (
              <div className="space-y-4 animate-fade-in">
                {company_research.interviewPrep && company_research.interviewPrep.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <BookOpen className="h-4 w-4" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">
                        Interview Prep
                      </h3>
                    </div>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {company_research.interviewPrep.map((prep, idx) => (
                        <li key={idx} className="leading-relaxed">{prep}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {company_research.smartQuestions && company_research.smartQuestions.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                      Questions to Ask Them
                    </h3>
                    <ul className="list-disc pl-4 text-xs text-text-primary space-y-1.5">
                      {company_research.smartQuestions.map((q, idx) => (
                        <li key={idx} className="leading-relaxed font-medium text-text-dark">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {company_research.sources && company_research.sources.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-border text-[10px] text-text-muted">
                    <span className="font-semibold uppercase tracking-wider">Researched Pages</span>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
                      {company_research.sources.map((src, idx) => (
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
      )}
    </div>
  );
}
