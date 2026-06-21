## 2026-05-20 - Optimize font loading with next/font/google
**Learning:** Legacy font loading via <link> tags in RootLayout causes an extra roundtrip to Google's servers and can lead to layout shift. Using next/font/google allows Next.js to self-host fonts, improving performance and reliability.
**Action:** Always prefer next/font/google for Google Fonts in Next.js projects to benefit from automatic self-hosting and zero layout shift.
