import Image from "next/image";

export function Testimonial() {
  return (
    <section className="w-full bg-surface-secondary py-20 px-6 sm:py-24 border-t border-b border-border">
      <div className="mx-auto max-w-[1440px] text-center">
        {/* Category Header */}
        <span className="block text-xs font-semibold uppercase tracking-widest text-accent mb-6">
          Success Stories
        </span>

        {/* Quote */}
        <blockquote className="mx-auto max-w-3xl text-xl sm:text-2xl font-semibold text-text-primary leading-relaxed mb-8">
          &ldquo;I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.&rdquo;
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center justify-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border-light bg-surface">
            <Image
              src="/images/user-icon.png"
              alt="Tom Wilson Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-text-primary leading-tight">
              Tom Wilson
            </div>
            <div className="text-xs font-medium text-text-secondary">
              Junior Developer
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
