# Lens: tests — is the change covered?

Reference: `docs/testing.md` (Vitest unit tests next to the code; Playwright with axe in `e2e/` against the production build). Whether the suites pass is a gate; you judge whether the change is covered.

## Judgement checks

1. **Unit test parity.** Every touched module with logic (data layer and mappers, i18n helpers, reading time, slug checks, feed generation, scripts with a pure core) has a test created or updated in this range. Astro components and pages are covered by e2e instead. Missing test for real logic → P1; a bug fix without a regression test → P0.
2. **E2E parity.** A new or changed page has a spec in `e2e/` following the home pattern: both themes, a smoke assertion that proves it's the right page, the axe check. Interactive features (filters, contact form, theme toggle, language selector) are exercised with the keyboard as well as the pointer.
3. **Coverage of the change itself.** New branches (missing translation, empty list, invalid input, a post absent in one locale) are exercised.
4. **Behaviour over implementation.** Assertions on returned values, rendered DOM and accessible roles (`getByRole`), not on private details or CSS classes.
5. **Real data shapes.** Fixtures shaped like WPGraphQL responses, small and named for what they prove, in `src/testing/`; mocks only for what crosses the network.
6. **Isolation and flakiness.** No order dependence; no real network; no fixed waits (`waitForTimeout`), dates or randomness without control; no `.only` or `.skip` left behind.
7. **Naming.** Each `it`/`test` reads as a sentence about behaviour; one behaviour per test.
8. **No silenced checks.** No axe rule disabled, no `expect` weakened to pass, no snapshot updated without reason.
