import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  return (
    <section className="relative overflow-hidden py-20 px-6 sm:py-24 border-b border-border">
      {/* Premium Background Gradient Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-br from-[rgba(124,92,252,0.12)] via-[rgba(97,168,255,0.08)] to-transparent blur-3xl opacity-75" />
      </div>

      <div className="mx-auto max-w-[1440px] text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-4 leading-tight">
          Your next job search can feel a
          <br />
          lot less overwhelming
        </h2>

        {/* Subtitle */}
        <p className="mx-auto max-w-xl text-sm sm:text-base font-medium text-text-secondary mb-8 leading-relaxed">
          Set up your profile, upload your resume, and start finding matches in minutes.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-2 rounded-md bg-text-slate px-5 text-sm font-medium text-white hover:bg-text-darkest active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all shadow-sm"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full sm:w-auto h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-text-primary hover:bg-surface-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
