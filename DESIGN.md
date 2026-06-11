---
name: Jobly
description: AI-powered job hunting assistant visual style guide
colors:
  background: "#f6f7fb"
  surface: "#ffffff"
  surface-secondary: "#f9fafb"
  border: "#e7eaf3"
  text-primary: "#101828"
  text-secondary: "#6a7282"
  accent: "#7c5cfc"
  accent-dark: "#5e4cff"
  accent-light: "#f3e8ff"
  text-slate: "#272835"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: "36px"
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: "20px"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "16px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-slate:
    backgroundColor: "{colors.text-slate}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Jobly

## 1. Overview

**Creative North Star: "The Professional Navigator"**

Jobly's interface is designed to evoke absolute confidence, intelligence, and seamless productivity. Operating as an automated tech assistant, the visual layout guides the job seeker through complex data (match scores, company research, resume elements) with clear layouts and visual signals. The interface balances high-performance utility with premium, inviting aesthetics.

The visual direction rejects generic SaaS clutter, excessive gradients on containers, and heavy overlays. It opts instead for a highly structured, clean layout utilizing plenty of white space and a crisp high-contrast palette.

**Key Characteristics:**
- High density of structured information presented through crisp layouts.
- Tinted neutral backgrounds contrasted with vibrant purple accents.
- Responsive, clean interfaces built using predefined variables only.

## 2. Colors

Jobly uses a Clean and High-Contrast scheme to keep information readable.

### Primary
- **Vibrant Amethyst** (#7c5cfc): The core brand accent color. Used for primary buttons, active states, progress indicators, and focus outlines.
- **Deep Indigo** (#5e4cff): Darker variant used for hover states on primary actions.
- **Subtle Lavender** (#f3e8ff): Light wash used for selected item backgrounds, highlights, and matching badges.

### Neutral
- **Off-White Canvas** (#f6f7fb): The global background tint. Keeps the interface clean while warming the default white background.
- **Pure Snow** (#ffffff): Card and surface background. Provides maximum separation against the neutral canvas.
- **Slate Text** (#101828): Main body text. High contrast to ensure compliance and readability.
- **Muted Charcoal** (#6a7282): Secondary descriptions and labels.
- **Deep Slate** (#272835): Heavy button background and prominent CTA surfaces.
- **Default Border** (#e7eaf3): Card outlines and panel separators.

### Named Rules
**The Rarity of Accent Rule.** The primary accent is used on ≤10% of any given screen. Its rarity is the point. Accent is reserved strictly for primary actions, indicators, and status highlights.

## 3. Typography

**Display Font:** Inter, sans-serif
**Body Font:** Inter, sans-serif

The font system leverages Inter to convey reliability and precision. Text scales have distinct weight and size differences to build vertical rhythm.

### Hierarchy
- **Display** (Semi-bold (600), 30px, 36px): Stat cards, prominent section headers.
- **Headline** (Semi-bold (600), 16px, 24px): Card headers and category labels.
- **Body** (Medium (500), 14px, 20px): Descriptions, inputs, primary list items. Cap line length at 75ch.
- **Label** (Regular (400), 12px, 16px): Muted details, metadata, timestamps.

### Named Rules
**The Text Bound Rule.** Body paragraphs must not stretch beyond 75ch in line length to ensure high readability. Use margin constraints on text containers.

## 4. Elevation

The depth strategy is Flat at Rest, Lifted on Interaction. Visual panels stay flat to present information efficiently. Depth is used primarily as responsive feedback.

### Shadow Vocabulary
- **Interactive Lift** (`box-shadow: 0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)`): Applied to cards and buttons.
- **Focus Overlay** (`box-shadow: 0px 0px 0px 4px rgba(124,92,252,0.15)`): Keyboard outline highlight.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Subtle shadows appear only as a response to state (hover, elevation, active).

## 5. Components

### Buttons
- **Shape:** Rounded corners (8px radius, `rounded-md`).
- **Primary:** Background (#7c5cfc) with White text, padding `8px 16px`.
- **Hover / Focus:** Transitions to Deep Indigo (#5e4cff) on hover over 150ms. Focus outline references Accent (#7c5cfc).
- **Secondary:** White background with Slate Text (#101828), border `1px solid #e7eaf3`.
- **Slate:** Deep Slate (#272835) background with White text. Used for main landing actions.

### Cards / Containers
- **Corner Style:** Rounded (16px radius, `rounded-2xl`).
- **Background:** Pure Snow (#ffffff).
- **Border:** Outlined with Default Border (#e7eaf3).
- **Internal Padding:** Spaced at `24px` (`p-6`) for large components, `16px` (`p-4`) for smaller widgets.

### Inputs / Fields
- **Style:** Pure Snow (#ffffff) background, Default Border (#e7eaf3), rounded corners (8px radius, `rounded-md`), padding `8px 12px`.
- **Focus:** Outlined with Vibrant Amethyst (#7c5cfc) focus ring.

### Navigation
- **Style:** Full-width container, 64px height, Pure Snow (#ffffff) background, border bottom `1px solid #e7eaf3`. Text is 14px Medium (500). Active links show Vibrant Amethyst (#7c5cfc).

## 6. Do's and Don'ts

### Do:
- **Do** use Off-White Canvas (#f6f7fb) for all page layouts to create visual separation from clean white cards.
- **Do** implement a crisp focus ring on every interactive form input.
- **Do** restrict card container backgrounds to Pure Snow (#ffffff).

### Don't:
- **Don't** use border-left or border-right greater than 1px as a colored stripe on cards, alerts, or lists.
- **Don't** use text gradient backgrounds or text clipping. Keep text solid Slate (#101828).
- **Don't** use glassmorphism or backdrop blurs unless specifically styled for modals/popups.
