## 2026-05-21 - [Font Loading Optimization]
**Learning:** External font links in Next.js App Router bypass the built-in font optimization, leading to avoidable network requests and potential layout shifts.
**Action:** Always use `next/font` for Google Fonts to benefit from self-hosting, automatic optimization, and zero layout shift.
