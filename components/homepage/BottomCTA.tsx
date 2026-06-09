import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function BottomCTA() {
  return (
    <section className="relative overflow-hidden py-20 px-6 sm:py-24 border-b border-border">
      {/* Premium Background Gradient Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-br from-accent/12 via-info/8 to-transparent blur-3xl opacity-75" />
      </div>

      <ScrollReveal>
        <div className="mx-auto max-w-[1440px] text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-primary mb-4 leading-tight">
            Your next job search can feel a
            <br className="hidden sm:inline" /> lot less overwhelming
          </h2>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-sm sm:text-base font-medium text-text-secondary mb-8 leading-relaxed">
            Stop fighting job boards. Connect your profile and analyze your first target role in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto h-11 items-center justify-center gap-2 rounded-md bg-text-slate px-5 text-sm font-medium text-white hover:bg-text-darkest active:scale-[0.97] btn-interactive focus-ring shadow-sm"
            >
              Scan Your Resume
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full sm:w-auto h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-text-primary hover:bg-surface-secondary active:scale-[0.97] btn-interactive focus-ring"
            >
              Paste a Job Link
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
