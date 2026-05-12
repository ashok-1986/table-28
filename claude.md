# claude.md
## AI Instructions — Table Twenty Eight Review Growth System
### For Claude Code · Cursor · Windsurf · Any AI coding assistant
**Project:** Table Twenty Eight QR Review System | **Owner:** Alchemetryx | **Updated:** May 2026

---

## WHAT THIS PROJECT IS

A two-part web system for Table Twenty Eight, a Scottish fine dining restaurant at Merchant Square, Glasgow.

**Part 1 — Customer landing page** (`reviews.table28.co.uk/`)
Customers scan a QR code in the restaurant and land here to leave a Google or TripAdvisor review. Every click is tracked by which physical QR placement was scanned (receipt, table card, bar counter, or exit door).

**Part 2 — Owner dashboard** (`reviews.table28.co.uk/dashboard`)
Hitesh (the restaurant owner) logs in with a password and sees live review counts from Google and TripAdvisor, weekly new review tracking, QR scan breakdown by placement, and a competitor gap comparison against Mharsanta (their main competitor at 2,487 reviews vs Table Twenty Eight's current 339).

---

## TECH STACK — DO NOT DEVIATE

```
Framework:    Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS (utility classes only — no custom CSS files unless unavoidable)
Fonts:        Cormorant Garamond + DM Mono via Google Fonts (imported in layout.tsx)
Analytics:    PostHog (EU cloud) — for QR click tracking on landing page
Data APIs:    Google Places API (review count + rating) + TripAdvisor Content API (review count)
Deployment:   Vercel
Auth:         Password-only via httpOnly cookie — no OAuth, no NextAuth
Database:     None required at this stage
```

---

## CONFIRMED CONSTANTS — HARDCODE EXACTLY, DO NOT MODIFY

```typescript
// lib/constants.ts

export const GOOGLE_REVIEW_URL =
  "https://www.google.com/maps/place/Table+Twenty+Eight/@55.8582319,-4.2471536,17z/data=!3m1!5s0x488846a146f0ed17:0xeb1e066c65aa3734!4m14!1m7!3m6!1s0x488847f9342ced61:0xb5d5f34127c117dc!2sTable+Twenty+Eight!8m2!3d55.8582289!4d-4.2445733!16s%2Fg%2F11kqsbznls/reviews"
// ✓ Verified — goes directly to Table Twenty Eight Reviews tab on Google Maps

export const TRIPADVISOR_URL =
  "https://www.tripadvisor.co.uk/Restaurant_Review-g186534-d26356397-Reviews-Table_Twenty_Eight-Glasgow_Scotland.html"
// ✓ Verified — direct TripAdvisor listing page

export const TRIPADVISOR_LOCATION_ID = "26356397"
// ✓ Extracted from TripAdvisor URL — used in Content API calls

export const QR_SOURCES = ["receipt", "table", "bar", "door"] as const
export type QRSource = typeof QR_SOURCES[number] | "unknown"

export const REVIEW_TARGET = 600 // 90-day goal
export const COMPETITOR = {
  name: "Mharsanta",
  googleRating: 4.4,
  googleCount: 2487, // As of May 2026 — will be overridden by live API
}
```

---

## ENVIRONMENT VARIABLES

```bash
# .env.local — never commit this file

# PostHog — client-safe (landing page click tracking)
NEXT_PUBLIC_POSTHOG_KEY=            # From posthog.com EU project
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com

# Server-only secrets — NEVER prefix with NEXT_PUBLIC_
GOOGLE_PLACES_API_KEY=              # From Google Cloud Console — Places API enabled
T28_GOOGLE_PLACE_ID=                # From Google Place ID Finder tool
MHARSANTA_PLACE_ID=                 # From Google Place ID Finder tool — for gap comparison
TRIPADVISOR_API_KEY=                # From tripadvisor-content-api.readme.io
DASHBOARD_PASSWORD=                 # Set by Ashok — used for /dashboard login
```

If any variable is missing when building locally, do NOT throw an error — use a fallback placeholder value and add a clear `// TODO: add env var` comment.

---

## FILE STRUCTURE — BUILD EXACTLY THIS

```
app/
  layout.tsx              # Root layout — Google Fonts, PostHog provider, viewport, metadata
  page.tsx                # Landing page — client component (needs PostHog + browser APIs)
  dashboard/
    page.tsx              # Owner dashboard — server component, fetches /api/reviews
    login/
      page.tsx            # Password entry — client component
  api/
    reviews/
      route.ts            # Server-only — fetches Google Places + TripAdvisor in parallel
    auth/
      route.ts            # POST — validates password, sets httpOnly cookie

components/
  ReviewButtons.tsx       # Client component — PostHog event fire + navigation on click
  PostHogProvider.tsx     # PostHog client initialisation wrapper

lib/
  constants.ts            # All constants listed above
  posthog.ts              # PostHog client singleton

middleware.ts             # Protects /dashboard route — checks for dash_auth cookie
.env.local                # All env vars (never committed)
.gitignore                # Must include .env.local
```

---

## KEY IMPLEMENTATION RULES

### Landing page (`app/page.tsx`)
- Read `?src=` query param on load. Default to `"unknown"` if missing.
- On any button click: (1) fire PostHog event FIRST, (2) then navigate. Use `window.location.href` not `window.open()` — iOS Safari from QR scans blocks `window.open`.
- PostHog event name: `"review_button_clicked"`
- PostHog event properties: `{ platform: "google" | "tripadvisor", source: qrSource, device: "iOS" | "Android" | "other", timestamp: new Date().toISOString() }`
- Device detection: check `navigator.userAgent` for `iPhone|iPad` → iOS, `Android` → Android, else `other`.

### API route (`app/api/reviews/route.ts`)
- Server-only. No `"use client"` directive.
- Call three things with `Promise.all()`:
  1. Google Places API for T28 → `rating` + `userRatingsTotal`
  2. Google Places API for Mharsanta → same fields
  3. TripAdvisor Content API → `num_reviews` + `rating`
- Google Places API endpoint: `https://places.googleapis.com/v1/places/{placeId}` with header `X-Goog-FieldMask: rating,userRatingsTotal`
- TripAdvisor endpoint: `https://api.content.tripadvisor.com/api/v1/location/{TRIPADVISOR_LOCATION_ID}/details?key={key}&language=en`
- Cache with `next: { revalidate: 3600 }` — refresh every hour.
- Return: `{ t28: { google_count, google_rating, tripadvisor_count, tripadvisor_rating }, mharsanta: { google_count, google_rating }, last_updated: string }`
- On any API failure: return cached/stale data if available, else return the hardcoded fallback values from `constants.ts`.

### Dashboard auth (`middleware.ts`)
- Check for `dash_auth` cookie on any request to `/dashboard*`
- If missing, redirect to `/dashboard/login`
- Do NOT use NextAuth or any external auth library

### Password login (`app/api/auth/route.ts`)
- POST only. Read `password` from request body.
- Compare against `process.env.DASHBOARD_PASSWORD`
- On match: set `dash_auth` cookie, `httpOnly: true`, `maxAge: 604800` (7 days), redirect to `/dashboard`
- On fail: return 401

---

## DESIGN TOKENS — USE THESE EXACTLY

```typescript
// Tailwind custom config or inline styles where Tailwind classes don't map cleanly

const tokens = {
  // Landing page (Table Twenty Eight branded — dark green)
  landing: {
    bg: "#0A1F10",
    headerBg: "#0D2414",
    text: "#EAE6D8",
    textMuted: "rgba(234,230,216,0.4)",
    gold: "#C9A84C",
    borderGold: "rgba(201,168,76,0.15)",
    googleBtn: "#4285F4",
    tripBtn: "#00AA6C",
    fontDisplay: "'Cormorant Garamond', serif",
    fontBody: "'DM Mono', monospace",
  },
  // Dashboard (Alchemetryx brand — dark navy)
  dashboard: {
    bg: "#0C0C0A",
    cardBg: "#141410",
    text: "#EAE6D8",
    textDim: "#9A9278",
    textMuted: "#5A5644",
    gold: "#C9A84C",
    green: "#4E8C6A",
    red: "#C04A4A",
  }
}
```

---

## WHAT NOT TO BUILD IN THIS SESSION

- No database (Supabase, Prisma, etc.)
- No satisfaction gate / star rating before review redirect (Phase 2)
- No email collection
- No multi-restaurant support
- No Stripe / payments
- No TripAdvisor full review text — total count only
- No social login / OAuth
- No server-sent events or websockets — static revalidation is sufficient

---

## DELIVERABLES CHECKLIST

- [ ] Landing page loads at `/` with correct Table Twenty Eight branding
- [ ] `?src=receipt`, `?src=table`, `?src=bar`, `?src=door` all read correctly
- [ ] Google button fires PostHog event then navigates to Google review URL
- [ ] TripAdvisor button fires PostHog event then navigates to TA URL
- [ ] PostHog events visible in PostHog EU dashboard
- [ ] `/api/reviews` returns valid JSON with review counts (or fallback)
- [ ] `/dashboard` shows live counts, competitor gap, progress bar
- [ ] `/dashboard/login` redirects to `/dashboard` on correct password
- [ ] Wrong password shows error, does not redirect
- [ ] Vercel preview URL works end-to-end
- [ ] README explains: how to add QR source, how to change password, how to update URLs

---

## QUESTIONS TO ASK BEFORE STARTING

If any of these are missing, ask before writing code:

1. `NEXT_PUBLIC_POSTHOG_KEY` — has Ashok created the PostHog EU project?
2. `GOOGLE_PLACES_API_KEY` — has the Places API been enabled in Google Cloud Console?
3. `T28_GOOGLE_PLACE_ID` — has Ashok looked up the Place ID for Table Twenty Eight?
4. `MHARSANTA_PLACE_ID` — has Ashok looked up the Place ID for Mharsanta?
5. `TRIPADVISOR_API_KEY` — has Ashok signed up at tripadvisor-content-api.readme.io?
6. `DASHBOARD_PASSWORD` — what should the dashboard password be?

If any are missing: scaffold the full project with TODO comments and fallback values. Do not block.
