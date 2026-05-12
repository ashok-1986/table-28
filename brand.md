# brand.md
## Alchemetryx — Brand Identity Reference
### Typography · Colour Palette · Usage Rules
**Version:** 4.0 | **Status:** Canonical | **Last updated:** May 2026

---

## COLOUR PALETTE

### Primary Colours — do not add, substitute, or approximate

| Name | Hex | RGB | Role |
|---|---|---|---|
| Midnight Sapphire | `#1A2642` | 26, 38, 66 | Primary background · all major headings · navigation · section headers |
| Alchemical Gold | `#D4AF37` | 212, 175, 55 | Accent · emphasis · icons · price points · CTAs · brand marks |
| Pearl White | `#F8F6F0` | 248, 246, 240 | Body text on dark · light surface backgrounds · cards |

### Secondary / Supporting

| Name | Hex | RGB | Role |
|---|---|---|---|
| Mid Grey | `#8A8A8A` | 138, 138, 138 | Supporting body text · metadata · captions |
| Light Grey | `#E8E6E0` | 232, 230, 224 | Dividers · borders · subtle backgrounds |
| Deep Navy | `#0F1929` | 15, 25, 41 | Dark sections · footer · contrast backgrounds |

### Project-Specific Extension (Table Twenty Eight only)
*These colours are used ONLY in the Table Twenty Eight QR review system — not in core Alchemetryx brand materials.*

| Name | Hex | Role |
|---|---|---|
| Forest Dark | `#0A1F10` | Page background (landing page) |
| Forest Mid | `#0D2414` | Header background |
| Review Gold | `#C9A84C` | Accent (slightly warmer than brand gold) |
| Google Blue | `#4285F4` | Google CTA button only |
| TripAdvisor Green | `#00AA6C` | TripAdvisor CTA button only |

### CSS Variables — copy into any project

```css
:root {
  /* Core brand */
  --midnight: #1A2642;
  --gold: #D4AF37;
  --pearl: #F8F6F0;
  --mid-grey: #8A8A8A;
  --light-grey: #E8E6E0;
  --deep-navy: #0F1929;

  /* Functional */
  --gold-dim: rgba(212, 175, 55, 0.12);
  --gold-border: rgba(212, 175, 55, 0.18);
  --pearl-dim: rgba(248, 246, 240, 0.6);
  --pearl-muted: rgba(248, 246, 240, 0.35);
}
```

### Colour Usage Rules

**Do:**
- Use Midnight Sapphire as the primary background on dark interfaces
- Use Alchemical Gold exclusively as an accent — never as a dominant colour
- Use Pearl White as text on dark backgrounds
- Pair Gold accents with Midnight Sapphire backgrounds for authority

**Do not:**
- Use Gold as a background colour
- Add new colours outside this palette
- Use Pearl text on Pearl background (no contrast)
- Use generic blue, red, or green for UI states — use Gold for active states

---

## TYPOGRAPHY

### Typeface Stack

| Font | Category | Role | Source |
|---|---|---|---|
| Cormorant Garamond | Serif display | Headlines · brand mark · editorial callouts | Google Fonts |
| Urbanist | Geometric sans | Body · UI · navigation · all functional text | Google Fonts |
| DM Mono | Monospace | Code · data · metrics · technical labels | Google Fonts |

### Why this stack
Cormorant Garamond signals premium, considered, human intelligence — not speed or disruption. Urbanist is clean and highly legible at small sizes across devices. DM Mono is used sparingly for data and code contexts, adding precision without feeling cold.

### Google Fonts import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Urbanist:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

### Type Scale

```css
/* Display — Cormorant Garamond */
.display-xl  { font-family: 'Cormorant Garamond', serif; font-size: clamp(3rem, 6vw, 5rem);   font-weight: 300; line-height: 1.05; }
.display-lg  { font-family: 'Cormorant Garamond', serif; font-size: clamp(2.4rem, 4vw, 3.5rem); font-weight: 300; line-height: 1.1;  }
.display-md  { font-family: 'Cormorant Garamond', serif; font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 400; line-height: 1.2;  }
.display-sm  { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem;  font-weight: 400; line-height: 1.3;  }
.display-italic { font-style: italic; } /* Use for brand name + emphasis */

/* Body — Urbanist */
.body-lg  { font-family: 'Urbanist', sans-serif; font-size: 18px; font-weight: 400; line-height: 1.7; }
.body-md  { font-family: 'Urbanist', sans-serif; font-size: 16px; font-weight: 400; line-height: 1.65; }
.body-sm  { font-family: 'Urbanist', sans-serif; font-size: 14px; font-weight: 400; line-height: 1.6;  }
.body-xs  { font-family: 'Urbanist', sans-serif; font-size: 13px; font-weight: 400; line-height: 1.55; }

/* Labels / UI — Urbanist caps */
.label-lg  { font-family: 'Urbanist', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em;  text-transform: uppercase; }
.label-md  { font-family: 'Urbanist', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; }
.label-sm  { font-family: 'Urbanist', sans-serif; font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; }

/* Data / Code — DM Mono */
.mono      { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 400; }
.mono-sm   { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 400; }
```

### Typography Hierarchy Rules

1. **H1 / Hero** — Cormorant Garamond Light (300), never bold. Let weight of idea carry it.
2. **H2 / Section titles** — Cormorant Garamond Regular (400). Italic for emphasis or brand name usage.
3. **H3 / Card titles** — Urbanist SemiBold (600). All-caps sparingly.
4. **Body copy** — Urbanist Regular (400). Never bold body copy except for data labels.
5. **Eyebrows / Labels** — Urbanist 500–600, all-caps, tracked (letter-spacing 0.12–0.2em), Gold colour.
6. **Numbers / Data** — DM Mono or Cormorant Garamond for display-size metrics.
7. **Navigation** — Urbanist 500, 13–14px, tracked.
8. **CTAs** — Urbanist 500–600, tracked, never Cormorant.

### Specific Application: Brand Name

The Alchemetryx wordmark in text should appear in Cormorant Garamond Italic:
```
font-family: 'Cormorant Garamond', serif;
font-style: italic;
font-weight: 400;
color: var(--gold);
```

---

## SPATIAL SYSTEM

```css
/* Spacing scale */
--space-xs:  4px;
--space-sm:  8px;
--space-md:  16px;
--space-lg:  24px;
--space-xl:  40px;
--space-2xl: 64px;
--space-3xl: 96px;

/* Border radii */
--radius-sm:  2px;   /* Badges, tags */
--radius-md:  4px;   /* Cards, inputs */
--radius-lg:  8px;   /* Modals, larger cards */
--radius-full: 999px; /* Pills */

/* Borders */
--border-brand: 1px solid rgba(212, 175, 55, 0.18);
--border-soft:  1px solid rgba(255, 255, 255, 0.06);
--border-dark:  1px solid rgba(26, 38, 66, 0.15);
```

---

## COMPONENT PATTERNS

### CTA Button — Primary
```css
.btn-primary {
  background: var(--gold);
  color: var(--midnight);
  font-family: 'Urbanist', sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 14px 32px;
  border-radius: var(--radius-md);
  border: none;
  text-transform: uppercase;
}
```

### CTA Button — Secondary (outline)
```css
.btn-secondary {
  background: transparent;
  color: var(--gold);
  border: 1px solid rgba(212, 175, 55, 0.4);
  /* same typography as primary */
}
```

### Section Eyebrow
```css
.eyebrow {
  font-family: 'Urbanist', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0.75;
}
```

---

*This file is the canonical brand reference. For the full brand bible see ALCHEMETRYX_MASTER_BRAND_BIBLE_COMPLETE.md in project knowledge.*
