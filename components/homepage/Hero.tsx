import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-6 sm:pt-24 sm:pb-20">
      {/* Premium Background Gradient Mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-gradient-to-tr from-accent/15 via-info/10 to-transparent blur-3xl opacity-75" />
      </div>

      <div className="mx-auto max-w-[1440px] text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-text-primary mb-8 leading-[1.1] animate-hero-fade">
          Stop applying to black holes.
          <span className="block mt-2">Apply with structural leverage.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto max-w-2xl text-base sm:text-lg font-medium text-text-secondary mb-8 leading-relaxed animate-hero-fade delay-100">
          JobPilot parses your engineering profile, extracts company dossier insights, and
          scores matches based on hard tech-stack alignment. No wrapper spam. Just pure leverage.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-hero-fade delay-200">
          <Link
            href="/login"
            className="inline-flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-md bg-text-slate px-6 text-sm font-medium text-white hover:bg-text-darkest active:scale-[0.97] btn-interactive focus-ring shadow-sm"
          >
            Scan Your Resume
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-sm font-medium text-text-primary hover:bg-surface-secondary active:scale-[0.97] btn-interactive focus-ring"
          >
            Paste a Job Link
          </Link>
        </div>

        {/* Browser Mockup */}
        <div className="mx-auto max-w-[1024px] rounded-xl border border-border bg-surface shadow-2xl overflow-hidden animate-hero-fade delay-300 mockup-hover">
          {/* Browser Header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-secondary border-b border-border">
            {/* Window Controls */}
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-error/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-success/70" />
            </div>
            {/* Address Bar */}
            <div className="flex-1 max-w-sm mx-auto flex items-center justify-center h-6 rounded bg-surface border border-border text-[10px] text-text-muted font-mono">
              jobpilot.ai/dashboard
            </div>
          </div>

          {/* Browser Content */}
          <div className="relative aspect-[1024/576] w-full overflow-hidden bg-background">
            <Image
              src="/images/dashboard-demo.png"
              alt="JobPilot Dashboard Preview"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
