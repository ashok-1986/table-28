# instructions.md
## Developer Setup & Deployment Guide
### Table Twenty Eight — Review Growth System
**Owner:** Alchemetryx | **Project:** Table Twenty Eight QR Review System | **May 2026**

---

## PREREQUISITES

Before starting, confirm you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed and configured
- [ ] A GitHub account (for Vercel deployment)
- [ ] Vercel account linked to GitHub (vercel.com — free)
- [ ] Cursor, Windsurf, or Claude Code installed

---

## ENVIRONMENT SETUP

### Step 1 — PostHog account (5 minutes)

1. Go to [posthog.com](https://posthog.com) → Sign up
2. **Select EU Cloud** (important — GDPR compliance)
3. Create a project named `Table Twenty Eight`
4. Copy the **Project API Key** (starts with `phc_...`)
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxx
   NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
   ```

### Step 2 — Google Places API key (10 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project called `table28-reviews`
3. Go to **APIs & Services** → **Library**
4. Search for **Places API (New)** → Enable it
5. Go to **APIs & Services** → **Credentials** → **Create API Key**
6. Restrict the key: under **API restrictions**, select **Places API (New)** only
7. Add to `.env.local`:
   ```
   GOOGLE_PLACES_API_KEY=AIza_xxxxxxxxxxxx
   ```

### Step 3 — Google Place IDs (4 minutes)

1. Go to [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Use the **Place ID Finder** tool at the bottom of the page
3. Search `Table Twenty Eight Glasgow` → copy the Place ID
4. Search `Mharsanta Glasgow` → copy the Place ID
5. Add to `.env.local`:
   ```
   T28_GOOGLE_PLACE_ID=ChIJ_xxxxxxxxxxxx
   MHARSANTA_PLACE_ID=ChIJ_yyyyyyyyyyyy
   ```

### Step 4 — TripAdvisor Content API (20 minutes)

1. Go to [tripadvisor-content-api.readme.io](https://tripadvisor-content-api.readme.io)
2. Click **Sign Up** → use your email
3. Add a credit card (required, but you will not be charged — 5,000 free calls/month)
4. Set a daily budget cap of £1 (protects against unexpected usage)
5. Copy your **API Key**
6. Add to `.env.local`:
   ```
   TRIPADVISOR_API_KEY=xxxxxxxxxxxx
   ```
   Note: Table Twenty Eight's TripAdvisor location ID is already hardcoded: `26356397`

### Step 5 — Dashboard password

Choose a simple password for Hitesh to access the dashboard. Add to `.env.local`:
```
DASHBOARD_PASSWORD=yoursecretpassword
```

---

## LOCAL DEVELOPMENT

```bash
# Clone the repo
git clone https://github.com/yourusername/table28-reviews.git
cd table28-reviews

# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local
# Edit .env.local with all 7 variables listed above

# Run locally
npm run dev

# Open in browser
open http://localhost:3000
```

### Verify locally

1. **Landing page** — open `http://localhost:3000` → click both buttons → check PostHog dashboard for events
2. **API route** — open `http://localhost:3000/api/reviews` → should return JSON with review counts
3. **Dashboard login** — open `http://localhost:3000/dashboard/login` → enter password → should redirect to `/dashboard`
4. **Dashboard** — check that review counts display correctly and competitor gap shows

---

## QR CODE SETUP

The landing page uses URL parameters to track which physical QR code was scanned:

| Placement | URL |
|---|---|
| Receipt / Bill | `https://reviews.table28.co.uk/?src=receipt` |
| Table card | `https://reviews.table28.co.uk/?src=table` |
| Bar counter | `https://reviews.table28.co.uk/?src=bar` |
| Exit door | `https://reviews.table28.co.uk/?src=door` |

Generate QR codes for each URL using any free QR generator (qr-code-generator.com, canva.com, or the QR generator tab in the demo file).

### Printing guide

| Item | Size | Quantity | Notes |
|---|---|---|---|
| Receipt strip | 40mm wide | 500 | Print on receipt paper or adhesive label |
| Table tent card | A6 | 1 per table | Dark green card stock recommended |
| Bar counter card | A5 | 2–3 | In clear acrylic stand next to card machine |
| Exit door card | A5 | 1 | Eye-level, left side of exit |

---

## DEPLOYMENT TO VERCEL

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts:
# - Link to existing project or create new
# - Select your GitHub repo
# - Framework: Next.js (auto-detected)
```

### Add environment variables to Vercel

1. Go to vercel.com → your project → **Settings** → **Environment Variables**
2. Add all 7 variables from your `.env.local` file
3. Set each to **Production** environment
4. **Important:** `NEXT_PUBLIC_` variables are exposed to the browser — confirm these are only `POSTHOG_KEY` and `POSTHOG_HOST`
5. All other variables (`GOOGLE_PLACES_API_KEY`, `TRIPADVISOR_API_KEY`, `DASHBOARD_PASSWORD`, Place IDs) must be server-only — do NOT prefix with `NEXT_PUBLIC_`

### Custom domain

1. In Vercel → your project → **Settings** → **Domains**
2. Add `reviews.table28.co.uk`
3. Vercel will provide DNS records to add to Table Twenty Eight's domain registrar
4. Ask Hitesh for access to their domain DNS settings (or ask who manages their domain)
5. DNS propagation: 24–48 hours

---

## ONGOING MAINTENANCE

### Weekly (10 minutes — Ashok)

Every Monday:
1. Open PostHog dashboard → check QR scan counts by placement source
2. Check Google Maps → Table Twenty Eight → review count (compare to previous week)
3. Check TripAdvisor listing → review count
4. Send Hitesh one WhatsApp: `"This week — X new Google reviews, Y new TripAdvisor. Total: Z."`

### Monthly (30 minutes — Ashok)

1. Open `/dashboard` → screenshot the full page
2. Check competitor gap — Mharsanta's current review count vs Table Twenty Eight
3. Check QR scan breakdown — which placement is converting best
4. Send Hitesh a one-page PDF or WhatsApp image with the monthly summary
5. Update `COMPETITOR.googleCount` in `constants.ts` if Mharsanta's count has changed

### Quarterly

- Review whether the dashboard password should be rotated
- Check if TripAdvisor or Google Places APIs have changed pricing or endpoints
- Review PostHog free tier usage — upgrade if approaching 1M events/month

---

## HOW TO MAKE CHANGES

### Add a new QR placement source

1. Open `lib/constants.ts`
2. Add the new source to the `QR_SOURCES` array
3. Update the `QRSource` type automatically updates via `typeof QR_SOURCES[number]`
4. Generate a new QR code pointing to `reviews.table28.co.uk/?src=yournewsource`
5. PostHog will automatically start tracking the new source

### Change the dashboard password

1. Update `DASHBOARD_PASSWORD` in Vercel environment variables
2. Redeploy (or the change takes effect on next request without redeployment in most cases)
3. Tell Hitesh the new password

### Update review URLs

If Google or TripAdvisor URLs change:
1. Open `lib/constants.ts`
2. Update `GOOGLE_REVIEW_URL` or `TRIPADVISOR_URL`
3. Commit and push — Vercel auto-deploys

### Add a new competitor to the gap tracker

1. Open `lib/constants.ts`
2. Add the competitor to a `COMPETITORS` array
3. Add their Google Place ID as a new env var
4. Update `app/api/reviews/route.ts` to fetch their data
5. Update the dashboard UI to show the additional row

### Scale to multiple restaurants (Phase 2)

When expanding to the other 3 restaurants in Hitesh's group:
- Add a `restaurantId` parameter to the landing page URL
- Create a restaurant config object in `constants.ts` mapping IDs to Place IDs and review URLs
- The same codebase handles all restaurants — just different configs

---

## TROUBLESHOOTING

| Problem | Likely cause | Fix |
|---|---|---|
| PostHog events not showing | Wrong API key or wrong host | Check `NEXT_PUBLIC_POSTHOG_KEY` is EU key + `NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com` |
| `/api/reviews` returns 500 | Missing `GOOGLE_PLACES_API_KEY` or wrong Place ID | Check env vars in Vercel + verify Place ID in Google Place ID Finder |
| Dashboard shows old data | Cached response | Click "Refresh data" button — or wait 1 hour for cache to expire |
| TripAdvisor count shows 0 | Missing `TRIPADVISOR_API_KEY` | Add key from tripadvisor-content-api.readme.io |
| Dashboard login not working | Wrong `DASHBOARD_PASSWORD` env var | Check Vercel env vars — redeploy after changing |
| QR code goes to wrong page | Wrong URL in QR generator | Regenerate QR with correct `?src=` parameter |
| iOS button click not navigating | `window.open` blocked by Safari | Ensure `ReviewButtons.tsx` uses `window.location.href` not `window.open` |

---

## COSTS SUMMARY

| Service | Free tier | When you pay |
|---|---|---|
| Vercel | Free for hobby projects | If > 100GB bandwidth/month |
| PostHog | Free up to 1M events/month | At scale (unlikely for one restaurant) |
| Google Places API | $200 credit/month (~8,000 calls) | Virtually never for this use case |
| TripAdvisor Content API | 5,000 calls/month | At > 5,000 API calls/month |
| **Total expected monthly cost** | **£0** | Until significant scale |
