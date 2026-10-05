# Testing

What is tested and how (requirements §13.3). Unit tests, end-to-end tests with accessibility checks, Lighthouse and checks on the built HTML.

## Unit tests (Vitest)

| Command              | Does                                                  |
| -------------------- | ----------------------------------------------------- |
| `npm test`           | Runs every unit test once, with a v8 coverage report. |
| `npm run test:watch` | Watch mode while writing code.                        |

`npm test` prints a coverage table and writes an HTML report to `coverage/` (git-ignored). There is no coverage threshold: coverage shows what is untested, it isn't a target. The `pre-push` hook runs the suite, and CI will (T-19).

Config: `vitest.config.ts`, built on Astro's `getViteConfig`, so tests resolve imports exactly like the build.

## What gets unit tests

Pure logic with rules worth pinning down: the data layer and its mappers, i18n helpers (route and `hreflang` resolution), reading time, the reserved-slug check, feed generation. Astro components and pages are covered by end-to-end tests instead, against the built site.

## Writing a test

- Put the test next to the code: `src/lib/blog/reserved-slugs.ts` → `src/lib/blog/reserved-slugs.test.ts`.
- Import `describe`, `it` and `expect` from `vitest` (no globals).
- Name each case for the behaviour it proves (`"only matches whole slugs"`), not the input.
- Shared fixtures and helpers live in `src/testing/` and are excluded from coverage. Keep fixtures small and named for what they prove.
- Prefer real data shapes (as WPGraphQL returns them) over mocks; mock only what crosses the network.

`src/lib/blog/reserved-slugs.test.ts` is the reference example.

## End-to-end and accessibility tests (Playwright + axe)

| Command                   | Does                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `npm run test:e2e`        | Builds the site, serves the build on port 4322 and runs `e2e/*.spec.ts`. |
| `npm run test:e2e:report` | Opens the HTML report of the last run (written in CI).                   |

The tests run against the production build (`astro preview`), never the dev server, so they see what gets deployed. Every spec runs in two projects, `mobile` (375 px) and `desktop` (1440 px), and the home specs run once per theme by emulating `prefers-color-scheme`, which the inline theme script turns into `data-theme`.

`e2e/home.spec.ts` holds:

- a smoke test: the page renders, with exactly one `h1`, in the expected theme;
- an axe check with the WCAG 2.0, 2.1 and 2.2 A/AA tags. It fails on any violation and prints only rule, impact and selectors.

Config: `playwright.config.ts`. Notes:

- Browser: Playwright's Chromium (`channel: "chromium"`). First run on a new machine: `npx playwright install chromium`.
- `--ignore-lock`: Astro 7 allows one preview server per project and exits if it finds another, so the test server ignores the lock and can run next to `npm run preview`.
- Outside CI an already running server on port 4322 is reused.
- Output (`test-results/`, `playwright-report/`) is git-ignored. On a failure, `test-results/` keeps a trace: `npx playwright show-trace <path>/trace.zip`.
- The suite is not in the `pre-push` hook: it needs a build, a browser and a free port, and takes ~20 s. CI runs it (T-19).

### Axe is not the whole audit

Axe automates only part of WCAG: contrast, names, roles, landmarks and similar checks that a machine can decide. Keyboard order, focus visibility, motion and reading order still need a manual pass (requirements §2). Never silence a rule to get green: fix the markup, or record the exception in the requirements with its reason.

### Adding a page

Add a spec per page or feature in `e2e/`, using the same pattern: loop over both themes, a smoke assertion that proves the page is the right one, and the axe check. Pages with interaction (filters, the contact form, the theme toggle) test the interaction with the keyboard as well as the pointer.

## Build output: HTML validation and internal links

Both run on `dist/`, so `npm run build` first. CI runs them right after the build; `pre-push` too.

| Command                 | Does                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `npm run validate:html` | `html-validate` with its recommended rules (`.htmlvalidate.json`) on every built page.                                     |
| `npm run links:check`   | `linkinator` crawls from the three locale homes and fails on any broken internal link or asset (`linkinator.config.json`). |

- Inline `style` is rejected except custom properties: pass data as `style="--level: 98%"` and let the component CSS use `var(--level)`.
- External links are skipped: other sites' uptime would make the gate flaky. Linkinator serves `dist/` on `127.0.0.1`, which is why the skip pattern names that host.
- `dist/index.html` is a meta refresh, which linkinator doesn't follow, so the crawl starts at `ca/`, `es/` and `en/`.

## Lighthouse

`npm run lighthouse` (`scripts/lighthouse.js`, Lighthouse 13) serves the build with `astro preview` on port 4324 and audits **one page per template in both themes**, with Lighthouse's default mobile profile (simulated slow 4G, 4× CPU slowdown). It writes an HTML report per run to `lighthouse-reports/` (git-ignored; a CI artifact) and a table to the console and the CI job summary.

- **Templates:** pages are grouped by path without the locale; a page whose parent is also a page counts as an instance (`/blog/<slug>/` → `blog/*`). One page per template, rotating ca, es, en so every locale gets audited. A new route is picked up automatically.
- **Themes:** the theme is written to `localStorage` before the audit, and `disableStorageReset` keeps it. That flag also keeps the HTTP cache, so the script clears it: every run is a cold first visit. (Without that, a warm cache reported 100 and LCP 0.8 s where the real figure was 95 and 2.8 s.)
- **Budgets (requirements §1.3):** Accessibility, Best Practices and SEO must be 100 on every run, or the step fails and names the failing audits. Performance (100), LCP (< 2.5 s) and CLS (< 0.1) are reported with ⚠ but don't fail until T-33 replaces the skeleton layout; then `BUDGETS` in the script moves them to `blocking`. INP needs real interaction, so the lab can't measure it; Total Blocking Time is its proxy inside the performance score.
- It isn't in `pre-push`: twelve audits take about four minutes. Run it before opening a pull request that touches layout, CSS, images, fonts or scripts.
- Chrome is Playwright's Chromium (`npx playwright install chromium`).
