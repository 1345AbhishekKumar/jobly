import Image from "next/image";
import { ScrollReveal } from "@/components/common/ScrollReveal";

export function Testimonial() {
  return (
    <section className="w-full bg-surface-secondary py-20 px-6 sm:py-24 border-t border-b border-border">
      <ScrollReveal>
        <div className="mx-auto max-w-[1440px] text-center">
          {/* Category Header */}
          <span className="block text-xs font-semibold uppercase tracking-widest text-accent mb-6">
            Success Stories
          </span>

          {/* Quote */}
          <blockquote className="mx-auto max-w-3xl text-xl sm:text-2xl font-semibold text-text-primary leading-relaxed mb-8">
            &ldquo;I used to waste hours tweaking bullet points and tracking applications
            in spreadsheets. JobPilot did the company mapping in 15 seconds, helping me
            customize my approach. Had 3 tech-lead offers in 4 weeks. It feels like having
            an agent in your corner.&rdquo;
          </blockquote>

          {/* Author Info */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/user-icon.png"
              alt="Liam Vance Avatar"
              width={40}
              height={40}
              className="object-cover rounded-full border border-border-light bg-surface"
            />
            <div className="text-left">
              <div className="text-sm font-bold text-text-primary leading-tight">
                Liam Vance
              </div>
              <div className="text-xs font-medium text-text-secondary">
                Senior Infrastructure Engineer
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
