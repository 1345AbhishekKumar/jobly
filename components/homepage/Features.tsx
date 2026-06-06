"use client";

import { useState } from "react";
import Image from "next/image";

export function Features() {
  const [activeTab1, setActiveTab1] = useState(0);
  const [activeTab2, setActiveTab2] = useState(0);

  const features1 = [
    {
      title: "Find jobs that actually fit",
      description: "Search by title and location or paste a job link. Get matched roles you can quickly scan.",
    },
    {
      title: "Know the Company Before You Apply",
      description: "Stop guessing what a company is about. JobPilot browses their site and gives you everything you need to apply with confidence.",
    },
    {
      title: "Keep track of every application",
      description: "Keep a clear view of every job you've found, tailored. Your activity and progress all stay in one simple place.",
    },
  ];

  const features2 = [
    {
      title: "Understand your match score",
      description: "See how your profile lines up with each role before you apply. Get a clear breakdown of what fits and what's missing.",
    },
    {
      title: "AI-Powered Job Matching",
      description: "Stop guessing which jobs are worth applying to. JobPilot scores every role against your actual skills so you focus on the ones that matter.",
    },
    {
      title: "Focus on the right roles",
      description: "Filter out low fit jobs and stay on the ones that actually matter. Spend less time sorting and more time applying.",
    },
  ];

  return (
    <div className="w-full bg-surface py-20 px-6 sm:py-24">
      <div className="mx-auto max-w-[1440px] flex flex-col gap-28 md:gap-32">
        {/* Section 1: Manage Your Job Search */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Text and Feature Items */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
              Manage Your Job Search
              <br />
              With Ease
            </h2>
            <div className="flex flex-col gap-4">
              {features1.map((item, idx) => {
                const isActive = activeTab1 === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab1(idx)}
                    className={`text-left p-4 border transition-all duration-200 ease-out rounded-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-accent/30 bg-accent-muted bg-opacity-40 shadow-sm"
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
                        <h3 className={`text-base font-bold mb-1 transition-colors ${
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
            <div className="relative overflow-hidden rounded-xl border border-border-light bg-surface-secondary shadow-lg aspect-[580/380] w-full">
              <Image
                src="/images/jobs-lists.png"
                alt="Jobs List Mockup"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Apply With More Confidence */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Terminal Mockup Image (Desktop first order swap) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-xl border border-border-light bg-surface-secondary shadow-lg aspect-[580/380] w-full">
              <Image
                src="/images/agnet-log.png"
                alt="Agent Log Mockup"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right: Text and Feature Items */}
          <div className="lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
              Apply With More
              <br />
              Confidence, Every Time
            </h2>
            <div className="flex flex-col gap-4">
              {features2.map((item, idx) => {
                const isActive = activeTab2 === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab2(idx)}
                    className={`text-left p-4 border transition-all duration-200 ease-out rounded-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                      isActive
                        ? "border-accent/30 bg-accent-muted bg-opacity-40 shadow-sm"
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
                        <h3 className={`text-base font-bold mb-1 transition-colors ${
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
      </div>
    </div>
  );
}
