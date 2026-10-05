# Testing

What is tested and how (requirements §13.3). Unit tests, end-to-end tests and accessibility checks; Lighthouse and build-output checks join with T-20.

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
