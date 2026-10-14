# Design Brief

## Direction

Premium Dark Tech — Bold brutalist aesthetic combining deep black void with silver precision and orange fire. Luxury hardware brand sensibility applied to a portfolio interface. Black background, silver edges, orange highlights create a sophisticated, tech-forward identity.

## Tone

Confident minimalism with fire accents. Refinement through restraint, emphasis through color intensity. Professional yet memorable — designed for recruiters and collaborators to notice and engage.

## Differentiation

Auto-typing hero title with role cycling, scroll-triggered fade/slide animations on all content sections, orange accent glows on card hover. Silver border accents create precision geometry. Hero name uses orange+silver gradient. Full-black background enforces premium dark aesthetic.

## Color Palette

| Token      | OKLCH           | Hex       | Role                                  |
| ---------- | --------------- | --------- | ------------------------------------- |
| background | 0.04 0.01 260   | #0A0A0A   | Deep black void, full-page background |
| foreground | 0.82 0.08 70    | #C0C0C0   | Silver text, subtle details           |
| card       | 0.07 0.02 260   | #121212   | Dark card surfaces                    |
| primary    | 0.65 0.21 30    | #FF8C00   | Orange highlights, CTAs, accents      |
| secondary  | 0.82 0.08 70    | #C0C0C0   | Silver borders, precision lines       |
| muted      | 0.15 0.01 260   | #262626   | Subtle backgrounds, section dividers  |

## Typography

- Display: Bricolage Grotesque 700 — hero name, section headers, navigation (bold geometric)
- Body: Lora — project descriptions, bio, long-form content (refined serif)
- Mono: JetBrains Mono — code snippets, tech stack labels, details (sharp fixed-width)
- Scale: hero 4xl/5xl, h2 2xl, h3 xl, body md

## Elevation & Depth

Card surfaces elevated via box-shadow combining orange glow (0 0 20px rgba(255,140,0,0.4)) and dark shadow (0 12px 32px rgba(255,140,0,0.12)). Borders define structure; minimal layering preserves dark brutalism. Hover state: card lifts with orange glow intensification.

## Structural Zones

| Zone     | Background          | Border              | Text            | Notes                           |
| -------- | ------------------- | ------------------- | --------------- | ------------------------------- |
| Header   | #F5F5F5 (white)     | border-border       | black text      | Sticky, high contrast, nav bar  |
| Hero     | bg-background       | —                   | white/silver    | Full-width, auto-typing title   |
| Projects | bg-card             | border-secondary    | white/silver    | Cards with orange hover glow    |
| Skills   | bg-muted            | —                   | white/silver    | Alternating dark sections       |
| Footer   | bg-card             | border-t secondary  | white/silver    | Social links, orange accents    |

## Spacing & Rhythm

Section gaps 64px (py-16), card padding 20px (p-5), micro-spacing 4px (gap-1). Dark background with elevated card surfaces create rhythm through depth, not color variation.

## Component Patterns

- Buttons: Primary (orange bg, white text), rounded-md, hover with shadow-orange-glow
- Cards: rounded-md, bg-card, border-secondary, shadow-subtle → shadow-elevated on hover
- Badges: rounded-md, bg-muted, text-secondary, font-mono text-xs

## Motion

- Entrance: Scroll-triggered fade-in 600ms and slide-from-left/right 800ms on viewport enter
- Hover: Card transitions to shadow-elevated with orange glow, smooth 300ms transition
- Hero: Auto-typing animation cycles through 6 roles, 2s per role, continuous loop
- Decorative: Staggered animation timing (50ms per card) creates choreography

## Constraints

- No full-page gradients or atmospheric effects
- No rounded corners beyond radius tokens (0.5rem = 8px for cards)
- No animations longer than 800ms except auto-typing loop
- Accent (orange) used sparingly — CTAs, active states, hover glows, section headers
- All text on dark cards white/silver; all text on light nav black

## Signature Detail

Auto-typing hero title role animation combined with orange+silver gradient on name establishes tech-forward brand identity. Scroll animations on every content section enforce premium, interactive feel.

## Assets

- Hero illustration: Premium dark gradient background with geometric accent line in orange
- Icons: Monochromatic silver for consistency with design system
