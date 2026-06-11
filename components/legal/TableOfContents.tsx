"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (sections.length === 0) return;

    // Set initial active section
    setActiveId(sections[0].id);

    const callback = (entries: IntersectionObserverEntry[]) => {
      // Find entries that are intersecting
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // Sort by their position on screen or select the first intersecting one
        const entry = visibleEntries[0];
        setActiveId(entry.target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: "-80px 0px -60% 0px", // Accurately triggers near top of page below navbar
      threshold: 0,
    });

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // Offset for sticky navbar + spacing
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      
      // Update browser hash silently
      window.history.pushState(null, "", `#${id}`);
    }
  };

  return (
    <nav className="space-y-1" aria-label="Table of contents">
      {sections.map((section) => {
        const isActive = activeId === section.id;
        return (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => handleClick(e, section.id)}
            className={`block py-2 text-sm font-medium transition-all duration-150 border-l-2 focus-ring rounded-r-md px-3 ${
              isActive
                ? "bg-accent-light/60 text-accent border-accent font-semibold"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary border-transparent"
            }`}
          >
            {section.title}
          </a>
        );
      })}
    </nav>
  );
}
