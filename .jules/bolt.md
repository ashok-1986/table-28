## 2026-05-20 - Optimize font loading with next/font/google
**Learning:** Legacy font loading via <link> tags in RootLayout causes an extra roundtrip to Google's servers and can lead to layout shift. Using next/font/google allows Next.js to self-host fonts, improving performance and reliability.
**Action:** Always prefer next/font/google for Google Fonts in Next.js projects to benefit from automatic self-hosting and zero layout shift.

## 2026-09-13 - Preconnect external review destination domains
**Learning:** In landing pages where the main user flow navigates to external third-party sites (e.g., Google/TripAdvisor reviews), browsers don't resolve DNS or perform TCP/TLS handshakes until the button click. Adding `<link rel="preconnect">` and `<link rel="dns-prefetch">` in RootLayout establishes connections ahead of time, reducing click-to-load navigation latency by ~100-300ms.
**Action:** Use preconnect resource hints in RootLayout or page headers for primary external destination domains on landing pages.
