# Lens: security — headers, sinks, secrets, dependencies and forms

Context: a static Astro site; content from headless WordPress (WPGraphQL at api.plastikaweb.com) fetched at build time; backend settings in `.env` (never read it, never print it); a contact form through a third-party delivery service (D-05); Plausible as the only third-party script.

## Already mechanical (input, not work)

ESLint (no `eval`), the dependency audit in CI (T-19), Renovate updates (§13.8). Everything else here is yours.

## Judgement checks

1. **Secrets.** Nothing from `.env` reaches the client: only `PUBLIC_`-prefixed variables in client code; no tokens or backend URLs with credentials in source, logs, built HTML or `public/`. `.env*` stays git-ignored.
2. **HTML sinks.** `set:html`, `innerHTML` and `Fragment set:html` only on content that is trusted or sanitised at build time (WordPress HTML included); no attribute or URL built from untrusted data without escaping; `target="_blank"` with `rel="noopener noreferrer"` on external links.
3. **Headers** (§13.8). CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` not weakened; a new inline script or third-party origin is reflected in the CSP (the theme script's hash or nonce); no new third-party scripts beyond Plausible (§8).
4. **Forms** (§6.6, §10). Honeypot present; the consent checkbox not pre-checked and linked to the policy; no personal data in URLs or query strings; the delivery endpoint and its key are the public ones the service documents.
5. **Client storage.** Only the theme and the language preference in `localStorage`; nothing personal.
6. **Dependencies.** New packages justified, maintained, not typosquat-looking; runtime dependencies kept minimal (a dev tool in `dependencies` → P1); lock file updated with `package.json`.
7. **CI and automation.** Workflows pin third-party actions to a commit SHA, use least-privilege `permissions`, and never echo secrets.
8. **Redirects.** No open redirect; 301 targets are internal paths (§9.2).
