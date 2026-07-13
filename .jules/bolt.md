## 2026-05-20 - Optimize font loading with next/font/google
**Learning:** Legacy font loading via <link> tags in RootLayout causes an extra roundtrip to Google's servers and can lead to layout shift. Using next/font/google allows Next.js to self-host fonts, improving performance and reliability.
**Action:** Always prefer next/font/google for Google Fonts in Next.js projects to benefit from automatic self-hosting and zero layout shift.

## 2026-07-13 - Optimize review data fetching with caching
**Learning:** Forcing dynamic rendering on data that updates infrequently (like review counts) causes unnecessary latency and external API consumption. Using Next.js Data Cache with a revalidate period balances freshness and speed.
**Action:** Always check if dynamic data actually needs to be fetched on every request; use revalidate where appropriate to improve LCP and reduce API costs.
