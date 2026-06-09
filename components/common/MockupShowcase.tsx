import Image from "next/image";
import React from "react";

interface MockupShowcaseProps {
  src: string;
  alt: string;
  url?: string;             // Mock browser URL (defaults to "jobpilot.ai/dashboard")
  aspectRatio?: string;     // Wrapper aspect ratio (defaults to "aspect-[1024/576]")
  className?: string;       // Custom classes for outer container
  overlay?: React.ReactNode; // Optional overlay content
  hideHeader?: boolean;     // Hide browser header if the screenshot already has one
}

export function MockupShowcase({
  src,
  alt,
  url = "jobpilot.ai/dashboard",
  aspectRatio = "aspect-[1024/576]",
  className = "",
  overlay,
  hideHeader = false,
}: MockupShowcaseProps) {
  // Auto-hide header for dashboard-demo.png since it has a built-in browser mockup header
  const shouldHideHeader = hideHeader || src.includes("dashboard-demo.png");

  return (
    <div
      className={`w-full relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent/5 via-surface-secondary to-accent/10 shadow-lg hover:shadow-xl transition-all duration-500 ease-out group mockup-hover ${className}`}
    >
      {/* Browser Mockup Header */}
      {!shouldHideHeader && (
        <div className="flex items-center gap-2 px-4 py-3 bg-surface/50 border-b border-border backdrop-blur-md">
          {/* Window Controls */}
          <div className="flex gap-1.5 shrink-0">
            <span className="h-3 w-3 rounded-full bg-error/70" />
            <span className="h-3 w-3 rounded-full bg-warning/70" />
            <span className="h-3 w-3 rounded-full bg-success/70" />
          </div>
          {/* Address Bar */}
          <div className="flex-1 max-w-sm mx-auto flex items-center justify-center h-6 rounded bg-surface border border-border text-[10px] text-text-muted font-mono truncate px-4">
            {url}
          </div>
          {/* Spacer for alignment */}
          <div className="w-12 shrink-0 hidden sm:block" />
        </div>
      )}

      {/* Padded Canvas with Screenshot Floating inside */}
      <div className={`relative ${aspectRatio} w-full p-4 sm:p-8 md:p-10 flex items-center justify-center`}>
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border/80 shadow-xl group-hover:shadow-2xl transition-all duration-500 bg-surface">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.01]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          
          {/* Stunning inner overlay div placed inside/over the image */}
          {overlay && (
            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/10 rounded-2xl backdrop-blur-[1px]">
              <div className="m-auto w-full max-w-[280px] sm:max-w-xs md:max-w-md p-6 sm:p-8 rounded-2xl bg-surface/85 backdrop-blur-lg border border-white/20 shadow-2xl transition-all duration-300 hover:scale-[1.02] text-left">
                {overlay}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
