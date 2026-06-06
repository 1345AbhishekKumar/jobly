# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Navbar
- **File Path**: `components/layout/Navbar.tsx`
- **Classes**:
  - Main container: `sticky top-0 z-50 h-16 w-full border-b border-border bg-surface px-6`
  - Inner wrapper: `mx-auto flex h-full max-w-[1440px] items-center justify-between`
  - Logo wrapper: `flex items-center gap-2`
  - Logo image container: `relative h-9 w-9 overflow-hidden rounded-[10px]`
  - Logo text: `text-[19px] font-bold leading-7 text-text-darkest`
  - Nav menu: `hidden md:flex items-center gap-8`
  - Nav links: `text-sm font-medium text-text-dark hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors px-1`
  - CTA button: `inline-flex h-10 items-center justify-center rounded-md bg-text-darkest px-4 text-sm font-medium text-white hover:bg-opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all`

### Footer
- **File Path**: `components/layout/Footer.tsx`
- **Classes**:
  - Main container: `w-full border-t border-border bg-surface px-6 py-8 mt-auto`
  - Inner wrapper: `mx-auto flex max-w-[1440px] flex-col sm:flex-row items-center justify-between gap-4`
  - Logo image container: `relative h-8 w-8 overflow-hidden rounded-[8px]`
  - Logo text: `text-[16px] font-bold leading-6 text-text-darkest`
  - Links list: `flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-text-secondary`
  - Link: `hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors px-1`

### Hero
- **File Path**: `components/homepage/Hero.tsx`
- **Classes**:
  - Section container: `relative overflow-hidden pt-20 pb-16 px-6 sm:pt-24 sm:pb-20`
  - Background container: `absolute inset-0 -z-10 overflow-hidden`
  - Gradient mesh: `absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-gradient-to-tr from-[rgba(124,92,252,0.15)] via-[rgba(97,168,255,0.1)] to-transparent blur-3xl opacity-75`
  - Content wrapper: `mx-auto max-w-[1440px] text-center`
  - Headline: `text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-6 leading-[1.1]`
  - Subheadline: `mx-auto max-w-2xl text-base sm:text-lg font-medium text-text-secondary mb-10 leading-relaxed`
  - CTA container: `flex flex-col sm:flex-row items-center justify-center gap-4 mb-16`
  - Primary button: `inline-flex w-full sm:w-auto h-12 items-center justify-center gap-2 rounded-md bg-text-slate px-6 text-sm font-medium text-white hover:bg-text-darkest active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all shadow-sm`
  - Secondary button: `inline-flex w-full sm:w-auto h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-sm font-medium text-text-primary hover:bg-surface-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all`
  - Mockup wrapper: `mx-auto max-w-[1024px] rounded-xl border border-border-light bg-surface shadow-2xl overflow-hidden`
  - Browser header: `flex items-center gap-2 px-4 py-3 bg-surface-secondary border-b border-border-light`
  - Window dots: `flex gap-1.5`, `h-3 w-3 rounded-full bg-red-400 / bg-yellow-400 / bg-green-400`
  - Address bar: `flex-1 max-w-sm mx-auto flex items-center justify-center h-6 rounded bg-surface border border-border-light text-[10px] text-text-muted font-mono`
  - Image container: `relative aspect-[1024/576] w-full overflow-hidden bg-background`

### Features
- **File Path**: `components/homepage/Features.tsx`
- **Classes**:
  - Section wrapper: `w-full bg-surface py-20 px-6 sm:py-24`
  - Inner content: `mx-auto max-w-[1440px] flex flex-col gap-28 md:gap-32`
  - Feature row: `grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center`
  - Text column: `lg:col-span-5 flex flex-col gap-8`
  - Text column (reversed): `lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2`
  - Section heading: `text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight`
  - Feature list: `flex flex-col gap-4`
  - Feature button: `text-left p-4 border transition-all duration-200 ease-out rounded-lg active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 border-accent/30 bg-accent-muted bg-opacity-40 shadow-sm border-transparent hover:bg-surface-secondary/60`
  - Number indicator: `text-sm font-bold mt-0.5 text-accent / text-text-muted`
  - Item heading: `text-base font-bold mb-1 transition-colors text-accent / text-text-primary`
  - Item description: `text-sm font-medium text-text-secondary leading-relaxed`
  - Image column: `lg:col-span-7`
  - Image column (reversed): `lg:col-span-7 order-2 lg:order-1`
  - Image mockup container: `relative overflow-hidden rounded-xl border border-border-light bg-surface-secondary shadow-lg aspect-[580/380] w-full`

### Testimonial
- **File Path**: `components/homepage/Testimonial.tsx`
- **Classes**:
  - Section wrapper: `w-full bg-surface-secondary py-20 px-6 sm:py-24 border-t border-b border-border`
  - Inner content: `mx-auto max-w-[1440px] text-center`
  - Category header: `block text-xs font-semibold uppercase tracking-widest text-accent mb-6`
  - Quote: `mx-auto max-w-3xl text-xl sm:text-2xl font-semibold text-text-primary leading-relaxed mb-8`
  - Author wrapper: `flex items-center justify-center gap-3`
  - Avatar container: `relative h-10 w-10 overflow-hidden rounded-full border border-border-light bg-surface`
  - Text info: `text-left`
  - Name: `text-sm font-bold text-text-primary leading-tight`
  - Title: `text-xs font-medium text-text-secondary`

### BottomCTA
- **File Path**: `components/homepage/BottomCTA.tsx`
- **Classes**:
  - Section wrapper: `relative overflow-hidden py-20 px-6 sm:py-24 border-b border-border`
  - Background container: `absolute inset-0 -z-10 overflow-hidden bg-background`
  - Gradient mesh: `absolute -bottom-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-br from-[rgba(124,92,252,0.12)] via-[rgba(97,168,255,0.08)] to-transparent blur-3xl opacity-75`
  - Content wrapper: `mx-auto max-w-[1440px] text-center`
  - Headline: `text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary mb-4 leading-tight`
  - Subheadline: `mx-auto max-w-xl text-sm sm:text-base font-medium text-text-secondary mb-8 leading-relaxed`
  - Buttons wrapper: `flex flex-col sm:flex-row items-center justify-center gap-4`
  - Primary button: `inline-flex w-full sm:w-auto h-11 items-center justify-center gap-2 rounded-md bg-text-slate px-5 text-sm font-medium text-white hover:bg-text-darkest active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all shadow-sm`
  - Secondary button: `inline-flex w-full sm:w-auto h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-text-primary hover:bg-surface-secondary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all`
