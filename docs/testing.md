# Testing

What is tested and how (requirements §13.3). This file starts with unit tests; end-to-end and accessibility tests join with T-15, Lighthouse and build-output checks with T-20.

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
