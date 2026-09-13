## 2025-05-14 - [Accessibility & Logic Refinement for Dashboards]
**Learning:** Progress bars in custom UIs often lack semantic roles, making them invisible to screen readers. Additionally, "gap" metrics should handle positive, negative, and zero states to provide clear user feedback.
**Action:** Always add `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to custom progress indicators. Use conditional rendering for metrics to handle "ahead", "behind", and "level" states with appropriate visual emphasis.

## 2026-08-13 - [Visual Trust & Tactile Feedback for Review CTAs]
**Learning:** On mobile QR-code scanning landing pages, review platform action buttons benefit enormously from recognizable, high-fidelity SVG brand logos rather than plain text, which boosts user visual trust and recognition. In addition, mobile tap targets feel significantly more responsive when given subtle tactile elastic scale feedback.
**Action:** Embed inline, pure SVG brand-accurate logos with `aria-hidden="true"` inside action buttons. Apply subtle scale transitions (`hover:scale-[1.02] active:scale-[0.98] duration-200 transition-all`) to provide tactile click/tap response.

## 2026-03-30 - [External Review CTAs: Semantic Links & Tab Context]
**Learning:** Using JS `window.location.href` on button elements for external navigation breaks standard browser interaction patterns (right-click / long-press options) and fails screen reader expectations. Converting to native anchor tags (`<a>`) with `target="_blank"` preserves mobile session context while screen-reader-only labels (`(opens in a new tab)`) satisfy WCAG external navigation standards.
**Action:** Always use semantic `<a>` tags with `target="_blank"`, `rel="noopener noreferrer"`, and an `<span className="sr-only">(opens in a new tab)</span>` helper for external destinations.
