"use client";

import { useState } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function Features() {
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);

  const features1 = [
    {
      title: "Interactive Company Intelligence Dossier",
      description: "No more digging through stale Crunchbase pages. JobPilot reads the company's engineering blog, maps their active tech stack, and summarizes their roadmap. Know what the team is shipping before you talk to the recruiter.",
    },
    {
      title: "Reverse-Engineered Match Analysis",
      description: "Understand exactly how an ATS views your profile. See a direct semantic breakdown of skill alignment, missing keywords, and stack overlaps. No black-box scores—just direct, actionable adjustments.",
    },
    {
      title: "The Job Tracker That Thinks",
      description: "Automatically extract application deadlines, contact names, and referral paths from any job page. A command center that keeps your pipelines warm without manual entry.",
    },
  ];

  const features2 = [
    {
      title: "Fine-Grained Stack Filtering",
      description: "Filter out ghost jobs, agencies, and roles with misaligned tech stacks. Set rules like 'Only Rust or Go' or 'No third-party recruiters' and let JobPilot filter the noise out of your feed.",
    },
    {
      title: "Context-Aware Resume Tailoring",
      description: "Highlight your relevant projects for each role without writing a fake cover letter. Generate structured bullet points that map your actual history to their job description, preserving total technical honesty.",
    },
    {
      title: "InsForge Backend Reliability",
      description: "Your profile, search logs, and resume data are fully encrypted. Built on top of enterprise PostgreSQL architecture, guaranteeing complete privacy and zero data scraping.",
    },
  ];

  return (
    <div className="w-full bg-surface py-20 px-6 sm:py-24">
      <div className="mx-auto max-w-[1440px] flex flex-col gap-28 md:gap-32">
        {/* Section 1: Manage Your Job Search */}
        <ScrollReveal>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Text and Feature Items */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary leading-tight">
                Reclaim Your
                <br />
                Application Leverage
              </h2>
              <div className="flex flex-col gap-4">
                {features1.map((item, idx) => {
                  const isActive = activeTab1 === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab1(idx)}
                      className={`text-left p-4 border transition-all duration-200 rounded-lg btn-interactive active:scale-[0.97] focus-ring ${
                        isActive
                          ? "border-accent/30 bg-accent-muted/40 shadow-sm"
                          : "border-transparent hover:bg-surface-secondary/60"
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <span className={`text-sm font-bold mt-0.5 ${
                          isActive ? "text-accent" : "text-text-muted"
                        }`}>
                          0{idx + 1}
                        </span>
                        <div>
                          <h3 className={`text-base font-bold mb-1 transition-colors duration-200 ${
                            isActive ? "text-accent" : "text-text-primary"
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium text-text-secondary leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Mockup Image */}
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-xl border border-border bg-surface-secondary shadow-lg aspect-[580/380] w-full">
                {/* Fade/scale/blur transitions between tab-specific mockups */}
                <div className={`absolute inset-0 tab-panel-transition ${activeTab1 === 0 ? "tab-panel-active z-10" : "tab-panel-inactive z-0"}`}>
                  <Image
                    src="/images/jobs-lists.png"
                    alt="Jobs List Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={`absolute inset-0 tab-panel-transition ${activeTab1 === 1 ? "tab-panel-active z-10" : "tab-panel-inactive z-0"}`}>
                  <Image
                    src="/images/dashboard-demo.png"
                    alt="Company Insights Mockup"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={`absolute inset-0 tab-panel-transition ${activeTab1 === 2 ? "tab-panel-active z-10" : "tab-panel-inactive z-0"}`}>
                  <Image
                    src="/images/jobs-lists.png"
                    alt="Application Tracker Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 2: Apply With More Confidence */}
        <ScrollReveal>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left: Terminal Mockup Image (Desktop first order swap) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-xl border border-border bg-surface-secondary shadow-lg aspect-[580/380] w-full">
                {/* Fade/scale/blur transitions between tab-specific mockups */}
                <div className={`absolute inset-0 tab-panel-transition ${activeTab2 === 0 ? "tab-panel-active z-10" : "tab-panel-inactive z-0"}`}>
                  <Image
                    src="/images/jobs-lists.png"
                    alt="Match Score Preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={`absolute inset-0 tab-panel-transition ${activeTab2 === 1 ? "tab-panel-active z-10" : "tab-panel-inactive z-0"}`}>
                  <Image
                    src="/images/agnet-log.png"
                    alt="Agent Log Mockup"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className={`absolute inset-0 tab-panel-transition ${activeTab2 === 2 ? "tab-panel-active z-10" : "tab-panel-inactive z-0"}`}>
                  <Image
                    src="/images/dashboard-demo.png"
                    alt="Focus on Right Roles Mockup"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Right: Text and Feature Items */}
            <div className="lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary leading-tight">
                Developer-First
                <br />
                Alignment Engine
              </h2>
              <div className="flex flex-col gap-4">
                {features2.map((item, idx) => {
                  const isActive = activeTab2 === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab2(idx)}
                      className={`text-left p-4 border transition-all duration-200 rounded-lg btn-interactive active:scale-[0.97] focus-ring ${
                        isActive
                          ? "border-accent/30 bg-accent-muted/40 shadow-sm"
                          : "border-transparent hover:bg-surface-secondary/60"
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <span className={`text-sm font-bold mt-0.5 ${
                          isActive ? "text-accent" : "text-text-muted"
                        }`}>
                          0{idx + 1}
                        </span>
                        <div>
                          <h3 className={`text-base font-bold mb-1 transition-colors duration-200 ${
                            isActive ? "text-accent" : "text-text-primary"
                          }`}>
                            {item.title}
                          </h3>
                          <p className="text-sm font-medium text-text-secondary leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
