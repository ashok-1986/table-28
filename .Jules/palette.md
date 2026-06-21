## 2025-05-14 - [Accessibility & Logic Refinement for Dashboards]
**Learning:** Progress bars in custom UIs often lack semantic roles, making them invisible to screen readers. Additionally, "gap" metrics should handle positive, negative, and zero states to provide clear user feedback.
**Action:** Always add `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` to custom progress indicators. Use conditional rendering for metrics to handle "ahead", "behind", and "level" states with appropriate visual emphasis.
