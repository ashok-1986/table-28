## 2025-05-15 - Unprotected Internal Dashboard API
**Vulnerability:** The `/api/reviews` endpoint was publicly accessible, allowing anyone to fetch review statistics that were intended only for the restaurant owner's dashboard.
**Learning:** Internal APIs used by server components or dashboards are often overlooked when they don't handle user-specific sensitive data, but they still represent an information leakage risk and unnecessary attack surface.
**Prevention:** Always include internal data APIs in the authentication middleware and ensure that server components fetching from these APIs forward the necessary authentication credentials.
