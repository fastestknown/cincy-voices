# Testimonial Cards for Editorial Articles

## Purpose

Editorial spotlights currently carry only Ford's voice and a few pull quotes from the subject. This adds short, attributed testimonials from other people in the subject's network (peers, clients, trusted advisors), rendered as small cards with a photo, name, title/company, and a 1-2 sentence quote, placed at specific points inside the article body.

## Content structure

New directory: `content/testimonials/`. One markdown file per person, reusable across articles (not scoped to a single editorial piece).

Frontmatter:
```
name: "Kathleen Crawford"
title: "Alera"
photo: "/testimonials/kathleen-crawford.jpg"
quote: "..."
```

Photos live at `public/testimonials/<slug>.jpg`, same pattern as the existing `public/headshots/`.

## Placement

Inside an editorial article's markdown body, a marker like:

```
[[testimonial: kathleen-crawford]]
```

marks the exact spot a card should render. `lib/editorial.ts` parses the body and replaces each marker with the corresponding testimonial data; the page component renders a `TestimonialCard` at that position.

## Component

`TestimonialCard` — circular photo, name, title/company (small, muted), quote in a slightly larger/italic style, subtle visual separation (border or background tint) from surrounding body text. Full-width within the article's text column, not a sidebar.

## Content workflow (per person)

1. Ford shares the raw text message.
2. Claude trims/polishes into a 1-2 sentence card-ready quote, shown to Ford for approval.
3. Ford shares a headshot (sourced by him, not scraped).
4. Ford specifies where in the article the card should sit.
5. Claude adds the testimonial file, photo, and marker.

## Scope for this pass

Kevin Lawson's "More Than a Full Practice" editorial gets the first cards: Kathleen Crawford (Alera) and Mary Tettenhorst (Founder / Talent Development Strategist, Impact Talent Strategies). Total expected for this article: 3-5 testimonials.
