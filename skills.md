# skills.md
## AI Agent Skills Reference
### Table Twenty Eight — Review Growth System
**For:** Claude Code · Cursor · Windsurf · Any AI agent operating on this project
**Owner:** Alchemetryx | **Updated:** May 2026

---

## PURPOSE OF THIS FILE

This file tells any AI agent operating on this project what skills it needs to apply, what it should know before touching code, and how to behave when building, debugging, or extending the system.

Read this file before writing a single line of code.

---

## CORE SKILLS REQUIRED

### 1. Next.js 14 App Router
**Must know:**
- Server components vs client components — when to use each
- Route handlers (`app/api/route.ts`) for server-side API calls
- Middleware (`middleware.ts`) for cookie-based auth on protected routes
- `fetch` with `next: { revalidate: N }` for ISR caching
- `"use client"` directive — only add when the component needs browser APIs or React hooks
- Environment variables: `NEXT_PUBLIC_` for client-safe, unprefixed for server-only

**Common mistakes to avoid:**
- Do not use `getServerSideProps` or `getStaticProps` — this is App Router, not Pages Router
- Do not call server-only secrets from client components
- Do not use `window` or `navigator` in server components — they do not exist on the server

### 2. TypeScript
**Must know:**
- Strict typing for all function parameters and return types
- `as const` for readonly tuple types (used in `QR_SOURCES`)
- Type inference from `typeof` (used for `QRSource` type)
- Proper typing for Next.js route handlers: `NextRequest`, `NextResponse`

### 3. Tailwind CSS
**Must know:**
- Utility-first — no separate CSS files unless Tailwind cannot express something
- Dark backgrounds require explicit text colour utilities (do not rely on defaults)
- `font-[family]` and `font-[weight]` must be in Tailwind config for custom fonts
- Never use `@apply` in component files — write utility classes inline

### 4. PostHog (EU cloud)
**Must know:**
- Initialise in a client component (`PostHogProvider.tsx`) that wraps the layout
- Use `posthog.capture(eventName, properties)` from `usePostHog()` hook or the singleton
- GDPR compliance: use `person_profiles: "identified_only"` — never track anonymous users as identified
- EU cloud endpoint: `https://eu.posthog.com` — not `.com` — this is non-negotiable for GDPR

**This project's event:**
```typescript
posthog.capture("review_button_clicked", {
  platform: "google" | "tripadvisor",
  source: "receipt" | "table" | "bar" | "door" | "unknown",
  device: "iOS" | "Android" | "other",
  timestamp: new Date().toISOString(),
})
```

### 5. Google Places API (New)
**Must know:**
- Endpoint: `https://places.googleapis.com/v1/places/{placeId}`
- Auth: header `X-Goog-Api-Key: {key}` (not query param)
- Field mask: header `X-Goog-FieldMask: rating,userRatingsTotal`
- This is the **New** Places API — not the legacy `maps.googleapis.com/maps/api/place` endpoint
- Always call from a server route — never expose the API key to the browser

**Response shape:**
```typescript
{
  rating: number,          // e.g. 4.6
  userRatingsTotal: number // e.g. 339
}
```

### 6. TripAdvisor Content API
**Must know:**
- Endpoint: `https://api.content.tripadvisor.com/api/v1/location/{locationId}/details`
- Auth: query param `?key={apiKey}`
- Always call from a server route — API key must not be exposed to browser
- Location ID for Table Twenty Eight: `26356397` (hardcoded in constants.ts)
- Returns `num_reviews` and `rating` in the response body

**Response shape (relevant fields):**
```typescript
{
  num_reviews: string,     // Note: string, not number — parse with parseInt()
  rating: string,          // Note: string — parse with parseFloat()
  location_id: string,
  name: string,
}
```

### 7. Vercel Deployment
**Must know:**
- `vercel --prod` from project root deploys to production
- Environment variables set in Vercel dashboard override `.env.local`
- Vercel auto-detects Next.js — no build config needed
- Custom domain: add in Vercel → Settings → Domains — provides DNS records

### 8. Cookie-based auth (no library)
**Must know:**
- Set via `NextResponse` in an API route: `response.cookies.set("dash_auth", "1", { httpOnly: true, maxAge: 604800 })`
- Read via `request.cookies.get("dash_auth")` in middleware
- `httpOnly: true` means JavaScript cannot read this cookie — intentional security measure
- Never use `document.cookie` to read or set auth cookies

---

## BEHAVIOUR RULES FOR AI AGENTS

### Always do:
- Read `claude.md` before starting any task
- Read `constants.ts` before hardcoding any URL or ID
- Use the design tokens in `brand.md` for any UI work — do not invent colours
- Add `// TODO: add env var` comments where env vars are consumed but not yet available
- Test the `?src=` parameter by loading the page with each value manually
- Verify that server-only env vars are NOT prefixed with `NEXT_PUBLIC_`

### Never do:
- Create a database or Supabase connection — not needed in this phase
- Add authentication libraries (NextAuth, Clerk, Auth.js) — password cookie is sufficient
- Use `window.open()` for button navigation — use `window.location.href` (iOS Safari blocks `window.open` from QR scans)
- Expose `GOOGLE_PLACES_API_KEY` or `TRIPADVISOR_API_KEY` to any client component
- Modify `GOOGLE_REVIEW_URL` or `TRIPADVISOR_URL` in `constants.ts` — they are verified and confirmed
- Add new colour values not in `brand.md` — ask the owner first
- Use `Inter`, `Roboto`, or `Arial` — fonts are `Cormorant Garamond` and `DM Mono` only

### When something is unclear:
- Check `claude.md` first — most decisions are pre-made there
- Check `constants.ts` — URLs and IDs are hardcoded with verification comments
- If still unclear, ask one specific question rather than making an assumption

### When an API call fails:
- Log the error server-side
- Return the hardcoded fallback values from `constants.ts` rather than throwing
- Add `// FALLBACK: API call failed` comment in the response
- Do not show an error state to the end user — show stale data with a timestamp note

### When adding a new feature:
- Check `instructions.md` → "How to make changes" section first
- Keep the QR source system extensible — always read from `QR_SOURCES` array, never hardcode placement strings
- Any new UI must use the design tokens from `brand.md`
- Any new server data must come through `/api/reviews` — do not add new API routes without discussion

---

## PHASE 2 FEATURES — DO NOT BUILD YET

These are planned but explicitly out of scope for the current build session:

| Feature | Why deferred |
|---|---|
| Satisfaction gate (1–3 star → private form) | Adds complexity before basic system is proven |
| Email collection | Requires GDPR consent flow |
| Multi-restaurant support | Expand after first restaurant validated |
| TripAdvisor review text display | API only returns last 5 reviews — misleading at MVP |
| Automated review response drafting | AI layer — Phase 3 |
| Supabase database | Overkill until multiple clients |
| Stripe payments | Separate billing system |
| SMS/WhatsApp notifications | Phase 2 — after QR system proven |

---

## TESTING CHECKLIST

Before marking any task complete:

```
Landing page:
[ ] Loads without errors on desktop Chrome
[ ] Loads without errors on mobile Safari (iOS)
[ ] Loads without errors on Android Chrome
[ ] ?src=receipt shows correct param in PostHog
[ ] ?src=table, ?src=bar, ?src=door all work
[ ] Missing ?src= defaults to "unknown"
[ ] Google button navigates to Google review page (same tab)
[ ] TripAdvisor button navigates to TripAdvisor page (same tab)
[ ] PostHog event visible in EU dashboard within 30 seconds of click

API route:
[ ] /api/reviews returns valid JSON
[ ] JSON contains t28.google_count > 0
[ ] JSON contains t28.google_rating > 0
[ ] JSON contains mharsanta.google_count > 0
[ ] JSON contains t28.tripadvisor_count > 0
[ ] Response time under 2 seconds (cached)
[ ] Returns fallback values gracefully if API keys missing

Dashboard:
[ ] /dashboard/login shows password field
[ ] Correct password → redirected to /dashboard
[ ] Wrong password → stays on login with error
[ ] /dashboard shows review counts from API
[ ] Competitor gap shows positive/negative number correctly
[ ] Progress bar shows T28 progress toward 600 target
[ ] Last updated timestamp displayed
[ ] "Refresh data" button triggers data reload
```
