# Tasks

Backlog for the Plastikaweb site, in logical order: a task only depends on tasks above it. Derived from `docs/requirements.md` (each task cites its section); ClickUp is updated from this file.

Status: `todo` · `doing` · `done`. Open decisions (`D-xx`, requirements §12) appear as tasks placed before the work they block.

## Phase 1 — Requirements and backlog

Housekeeping that runs alongside the design phase; nothing below depends on it except where noted.

| ID  | Task                                                                                                                                                                        | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| B-1 | Review `docs/requirements.md` and this file; commit both.                                                                                                                   | done   |
| B-2 | Update `CLAUDE.md` and `CLAUDE.local.md` to point at the requirements (Stitch → Claude Design, timeline on About, personal section, blog categories, task source of truth). | done   |
| B-3 | Sync ClickUp from this file: replace the old backlog, keep IDs in task names, recurring tasks for M-1 – M-7.                                                                | doing  |

## Phase 2 — Design

### T-01 · Product brief (`PRODUCT.md`)

- **Status:** doing (draft written; personality, voice and anti-references pending review)
- **Source:** §1, §4, §4.0, §13.7
- **Depends on:** —
- **Done when:** `PRODUCT.md` at the repo root states the register, users, purpose, brand personality, anti-references and design principles, consistent with the requirements; the Claude Design prompt references it and it is attached when running T-02.

### T-02 · Design the interface in Claude Design

- **Status:** done (approved 2026-10-05; handoff in the Claude Design project, `design_handoff/README.md`)
- **Source:** requirements §4, §4.0, §6, §11 (phase 2)
- **Depends on:** T-01
- **Deliverable:** home page in two directions (A "Summary", B "Sticky identity"), then the remaining pages in the chosen direction; light and dark; 375 and 1440 px; component inventory with states.
- **Steps:**
  1. Draft the prompt: `docs/design/claude-design-prompt.md` — done, pending review.
  2. Run Prompt 1 in Claude Design with `PRODUCT.md`, `theme.css` and the requirements attached; choose direction and hero CTA option (closes part of D-13).
  3. Run Prompt 2 for the remaining pages.
  4. Record the resulting decisions in `docs/requirements.md` and any new tokens in `src/styles/theme.css`.
- **Done when:** every page in §6.1 has an approved design in both themes and both widths, and the decisions it settled are in the requirements.

### T-67 · Home design revision (October 2026 review)

- **Status:** done (17 October 2026: Prompts 3 to 5 in `docs/design/claude-design-prompt.md`; the final export's decisions recorded in §4.2, §4.4 and §6.2. Checked in Claude Design's preview at about 400 and 1440 px in both themes, with the four availability states and the "now" block at 0, 1 and 3 lines; the icons' contrast computed from the tokens, at least 4.8:1. Exception accepted: the design-system docs that still describe the previous home, listed in T-34, are ignored in the build.)
- **Source:** §5, §6, §6.2, §7, D-13, D-15
- **Depends on:** T-02
- **Scope:** the home page and the site header (on every page). Footer, buttons and section headings keep their design; other pages are revised later, one at a time.
- **Done when:** a new Claude Design export (`Home v4`) matches §6.2 in both themes at 375 and 1440 px, including the four availability states and the "now" block empty, with one line and with three; the header carries the three-item menu and, on wide screens, the outlined contact button; both handoff READMEs and the design-system components match; the local design reference in `CLAUDE.local.md` points at the new export.

## Phase 3 — Foundation

Can run in parallel with T-02. Goal: the quality gate exists before the first page is built. Each tool lands with its documentation in `docs/` (§13.6), not in a later docs pass.

### T-03 · Decide the remaining tooling (D-14)

- **Status:** done (Playwright with axe, Renovate, Better Stack)
- **Source:** §13, D-14
- **Depends on:** —
- **Done when:** end-to-end runner, dependency bot and uptime monitor are chosen and recorded in §13 (replacing "proposed").

### T-04 · Agent skills and MCP servers

- **Status:** done (Astro Docs MCP in `.mcp.json`; WordPress skills deferred to T-48; outcome in §13.7)
- **Source:** §13.7
- **Depends on:** —
- **Steps:**
  1. Review the skills already installed on this machine and in NewWebSite, and the official Astro and WordPress sources (candidates in §13.7).
  2. Read every third-party skill before installing it; prefer official sources (Astro Docs MCP, `WordPress/agent-skills`).
  3. Install the chosen ones at project scope (`.claude/skills/`, `--copy`) or as project MCP servers (`.mcp.json`), so a fresh clone gets them.
- **Done when:** the chosen skills and MCP servers are installed and committed, and `CLAUDE.md` has a "Recommended skills" section saying what each is for and when to invoke it. WordPress skills can be deferred to phase 5 if listed as such.

### T-05 · Pin runtime and versions

- **Status:** done (Node 24 LTS, Astro 7.3, Prettier 3.9 with `prettier-plugin-astro` 1.1)
- **Source:** §13.1
- **Depends on:** —
- **Done when:** `.nvmrc` and `engines` pin the Node LTS supported by Astro 7; dependencies on the latest Astro 7.x; `npm ci` and `npm run build` pass; README states the Node version.

### T-06 · Remove template leftovers

- **Status:** done
- **Source:** §0
- **Depends on:** T-05
- **Done when:** `Layout.astro`, `Welcome.astro`, `src/assets/astro.svg` and `background.svg` are gone and the build passes. (The rest of the skeleton is replaced page by page in phase 4.)

### T-07 · Editor settings, line endings and format check

- **Status:** done
- **Source:** §13.2
- **Depends on:** T-05
- **Done when:** `.editorconfig`; `.gitattributes` with `* text=auto eol=lf` and binaries (fonts, images, PDF) marked `binary`; `.prettierignore`; `npm run format:check` fails on unformatted files; `.vscode/settings.json` (format and lint fixes on save) and `.vscode/extensions.json` (Astro, ESLint, Prettier, Stylelint, markdownlint, Error Lens) committed.

### T-08 · ESLint

- **Status:** done
- **Source:** §13.2
- **Depends on:** T-05
- **Done when:** `npm run lint` runs `typescript-eslint` and `eslint-plugin-astro` (with its accessibility rules) plus the general rules in §13.2 (`curly`, `eqeqeq` with `null: ignore`, `no-console`, complexity and size limits, `simple-import-sort`, `_`-prefixed unused names, `import type` for type-only imports) with `--max-warnings 0` and zero errors; `docs/code-quality.md` describes the rules and how to disable one with a reason.

### T-09 · Local rule: short comments

- **Status:** done
- **Source:** §13.2
- **Depends on:** T-08
- **Done when:** `eslint-rules/max-comment-lines.js` (ported from NewWebSite: at most 5 lines of prose per comment block, tags and directives excluded) is registered as `local/max-comment-lines` with its `RuleTester` fixtures run by `npm run test:eslint-rules`; documented in `docs/code-quality.md`.

### T-10 · Stylelint and the token check

- **Status:** done
- **Source:** §13.2, `.claude/rules/css.md`
- **Depends on:** T-05
- **Done when:** `npm run lint:css` rejects color literals and ad-hoc px outside `theme.css`, physical properties where logical ones exist, and `[data-theme]` overrides in components; `npm run css:check` fails on any `var(--…)` that `theme.css` doesn't declare; `theme.css` passes both; documented in `docs/code-quality.md`.

### T-11 · markdownlint

- **Status:** done
- **Source:** §13.2
- **Depends on:** T-05
- **Done when:** `.markdownlint.jsonc` (rules) and `.markdownlint-cli2.jsonc` (ignores: `.claude/skills/`, `.remember/`, `node_modules/`, `dist/`) exist; `npm run lint:md` passes on every Markdown file in the repo.

### T-12 · Type checking

- **Status:** done
- **Source:** §13.2
- **Depends on:** T-05
- **Done when:** `@astrojs/check` installed; `npm run check` passes with TypeScript strict.

### T-13 · Git hooks and commit convention

- **Status:** done
- **Source:** §13.2
- **Depends on:** T-07, T-08, T-10, T-11, T-12
- **Done when:** husky installs on `npm install`; pre-commit runs lint-staged (ESLint + Prettier on TS/Astro, Stylelint + Prettier on CSS, markdownlint on Markdown) and stays fast; commit-msg runs commitlint (Conventional Commits, types `feat fix docs refactor perf test build ci chore`, header ≤ 100, lowercase subject, blank lines before body and footer); pre-push runs lint, type check, build and unit tests; `docs/commits.md` documents format, hooks, branch naming and when `--no-verify` is acceptable.

### T-14 · Unit test setup

- **Status:** done
- **Source:** §13.3
- **Depends on:** T-05
- **Done when:** `npm test` runs Vitest with one passing example test and coverage output; shared helpers live in `src/testing/`; `docs/testing.md` explains how to run and write tests.

### T-15 · End-to-end and accessibility test setup

- **Status:** done
- **Source:** §13.3
- **Depends on:** T-03, T-05
- **Done when:** `npm run test:e2e` builds, serves the build and runs a smoke test plus an axe check on the home page in both themes at 375 and 1440 px; documented in `docs/testing.md`.

### T-16 · Claude Code project settings

- **Status:** done
- **Source:** §13.7
- **Depends on:** T-12
- **Done when:** `.claude/settings.json` blocks edits to `.env*` and `package-lock.json` (PreToolUse hook), runs the type check after edits to `.ts`/`.astro` files (PostToolUse hook), and allows the read-only and gate commands without prompting.

### T-17 · Versioning and changelog

- **Status:** done
- **Source:** §13.4
- **Depends on:** —
- **Done when:** `package.json` follows semver from `1.0.0` at launch (`0.x` until then); `CHANGELOG.md` in Keep a Changelog format with short entries; the README version badge matches `package.json` and a script checks it.

### T-18 · Project skills: commit and audit

- **Status:** done
- **Source:** §13.7
- **Depends on:** T-04, T-08, T-10, T-11, T-13, T-17
- **Done when:** `.claude/skills/commit-actions/` (adapted from NewWebSite: refuses `main`, runs the pre-commit gates, drafts the Conventional Commit, updates version and changelog when due, confirms before committing, never pushes on its own) and `.claude/skills/task-audit/` (mechanical gates first, then one read-only `audit-lens` agent per lens with a non-empty scope — code, styles, a11y, docs, i18n, UX, tests, security, SEO, performance — one deduplicated report) exist with `.claude/agents/audit-lens.md`; both documented in `CLAUDE.md`.

### T-19 · CI quality gate

- **Status:** done
- **Source:** §13.5
- **Depends on:** T-07 – T-15, T-17
- **Done when:** a single GitHub Actions workflow runs on every pull request — `npm ci`, format check, ESLint, Stylelint and token check, markdownlint, local rule fixtures, type check, unit tests, build, end-to-end and accessibility tests, dependency audit, version badge check — with the Node version from `.nvmrc`; `main` is protected and requires it.

### T-20 · Lighthouse and build-output checks

- **Status:** done
- **Source:** §1.3, §13.3
- **Depends on:** T-19
- **Done when:** a project script (`scripts/lighthouse.js`) runs Lighthouse on one page per template in both themes and fails below 100 in Accessibility, Best Practices and SEO, while performance, LCP and CLS are reported until T-33 makes them blocking; HTML validation and an internal link check run on `dist/`; all three are part of the gate.

### T-69 · One test function across the suites

- **Status:** done
- **Source:** §13.3
- **Depends on:** T-14, T-15
- **Done when:** unit tests and the ESLint rule fixtures call `test()`, as the Playwright specs do; ESLint (`no-restricted-imports`) rejects importing `it` from `vitest` or `node:test`; `docs/testing.md` and `docs/code-quality.md` say so.

### T-21 · Dependency update bot

- **Status:** todo
- **Source:** §13.8
- **Depends on:** T-03, T-19
- **Done when:** the chosen bot opens grouped update pull requests on a schedule, and they go through the gate.

### T-24 · README and working conventions

- **Status:** todo
- **Source:** §13.6
- **Depends on:** T-13, T-19 (the deploy section is added by T-23)
- **Done when:** the README has badges, a table of contents, requirements, install and run commands, quality checks, an index of `docs/`, deploy and content rebuild, and working conventions; `CLAUDE.md` states the code documentation conventions (English only, comments explain why, branch naming `<type>/t-<id>-<slug>`).

## Phase 4 — Front end with mock data

Page tasks depend on T-02 (approved design for that page; for the home page and the shared shell, T-67) and T-19 (quality gate). A page task is done only when it matches the approved design in both themes at 375 and 1440 px, all its copy exists in ca, es and en, and its end-to-end, axe and Lighthouse checks pass in the gate.

### T-25 · Decide routing (D-01, D-02)

- **Status:** todo
- **Source:** §5, §6.1, D-01, D-02
- **Depends on:** —
- **Done when:** slug scheme (localized or shared) and default locale / behaviour of `/` are recorded in the requirements, with the full route table per locale.

### T-26 · Decide the open content questions (D-09, D-10, D-11, D-12)

- **Status:** done
- **Source:** §6.4, §6.5, §7, D-09 – D-12
- **Depends on:** —
- **Done when:** personal page name and entry shape, category labels in three locales, the missing-translation rule and the personal-vs-blog boundary are recorded in the requirements.

### T-27 · Decide font hosting and muted text (D-07, D-08)

- **Status:** done
- **Source:** §4.1, §4.2, D-07, D-08
- **Depends on:** —
- **Done when:** both decisions are recorded; D-08 with contrast ratios that pass AA in both themes.

### T-68 · Decide the Personal page (D-15)

- **Status:** todo
- **Source:** §6.5, §12 D-15
- **Depends on:** —
- **Done when:** D-15 is recorded in the requirements (keep the page reachable from About, merge it into About, or leave it out of v1), and T-28, T-32, T-41, T-42, T-49 and the content model (§7) are adjusted to match. If the page stays, `theme.css` gains the design's `--step-topic` (topic titles, `clamp(1.75rem, 1.4rem + 1.4vw, 2.6rem)` in the T-02 handoff) and the type-scale line in `.claude/rules/css.md` names it.

### T-28 · Site copy and assets

- **Status:** todo
- **Source:** §6.2, §6.6, §11
- **Depends on:** —
- **Done when:** hero (H1, lead, availability and "now" lines, §6.2), the home page title and meta description with the §9.1 keywords the hero leaves out (§6.2), services, About bio and, depending on D-15, the personal-page intro exist in ca, es and en; professional photo and a CV per locale are ready.

### T-29 · Astro configuration and routing

- **Status:** todo
- **Source:** §3, §5, §6.1
- **Depends on:** T-05, T-25
- **Done when:** `astro.config.mjs` sets `site`, static output, i18n routing per T-25 and a trailing-slash policy; `/` behaves as decided; every route in §6.1 resolves for the three locales (placeholder content allowed).

### T-30 · Tokens and font loading

- **Status:** done (Astro Fonts API for all three families, `--color-text-muted` removed, no radius tokens; contrast table in `docs/design-state.md`). Left out on purpose: the design's `--step-topic` (personal-page topic titles) waits for D-15 and is added in T-68 if the page stays.
- **Source:** §4, D-07, D-08
- **Depends on:** T-02, T-27, T-67
- **Done when:** `theme.css` has the tokens the designs added (T-02 and T-67), no rounded `--radius-*` values remain (sharp corners), muted text passes AA, fonts load as decided in §4.2 (Space Grotesk preloaded; Bricolage Grotesque's preload is settled in T-35); the type-scale line in `.claude/rules/css.md` names the hero size adopted from T-67; `docs/design-state.md` contrast table updated.

### T-31 · UI strings and i18n helpers

- **Status:** todo
- **Source:** §2, §5
- **Depends on:** T-14, T-29
- **Done when:** every UI string, including accessible names, lives in one dictionary per locale; each locale `satisfies` the same key type, so a missing key fails the type check (parity by types, no separate parity script); a small check rejects empty strings and runs in pre-commit and CI; helpers return the localized path of any page and its alternates in the other locales; unit tests cover them; `docs/i18n.md` explains how to add a string.

### T-32 · Content model and mock data layer

- **Status:** todo
- **Source:** §3, §6.4, §7
- **Depends on:** T-14, T-26, T-31
- **Done when:** types for case studies, posts (category + tags), tags, categories, personal topics and entries, and site settings mirror the planned WPGraphQL responses; pages read data only through a data-access module; mock data meets §7 minimums; reading time, linked translations, the D-11 rule and the reserved-slug build check (`category`, `tag`) are implemented and unit-tested.

### T-33 · Base layout and navigation

- **Status:** todo
- **Source:** §2, §4.5, §5, §6
- **Depends on:** T-02, T-30, T-31, T-67
- **Done when:** a new base layout replaces `BaseLayout.astro` and `ThemeToggle.astro`: `lang` per locale, skip link, landmarks, theme script before first paint, theme toggle `<button>` with persistence and crossfade, main menu (Work, Blog, About) that moves to a second header row on small screens, plus, from the wide breakpoint up, a header contact link styled as a secondary (outlined) button that goes to the contact form, with no hamburger and no truncation of ca/es labels, language selector linking to the same page (or to the blog listing in that locale when a post has no translation, D-11), footer. The new layout keeps the `<Font>` components from `BaseLayout.astro` and its Space Grotesk preload prop (T-30). Base heading weights are checked against the design's `--weight-heading` (650, defined in `theme.css` and unused so far). End-to-end tests cover theme persistence without a flash and language switching. Lighthouse also fails on every template below 100 in performance, or with LCP of 2.5 s or more, or CLS of 0.1 or more: `checkBudgets` in `scripts/lighthouse.js` (T-20) reads `blocking` entries as minimum scores, so it gains maximum thresholds for LCP and CLS, and each page and theme is judged on the median of three runs, since a single run varies by several points.

### T-34 · Shared components

- **Status:** todo
- **Source:** §4, T-02 and T-67 component inventories
- **Depends on:** T-33
- **Done when:** the components in the design inventory (buttons, links, chips, tags, cards, section heading, …) exist with all their states, using semantic tokens only. The section heading has no "see all" link: that link ends its section (§6.2). Where the final Home export's design-system docs still describe the previous home (a "Veure la feina" button, an email address with a copy button in the contact block, the old figures in `ProofStats`), §6.2 wins.

### T-35 · Home page

- **Status:** todo
- **Source:** §6.2
- **Depends on:** T-28, T-32, T-34, T-67
- **Done when:** the five sections render in order from data; the hero has one CTA, to the contact form; each of the four availability states renders its own text and icon shape, a "from" month that has already started at build time (the build month or earlier) renders as available now, Catalan month names elide ("a partir d’abril"), and the pulse stops within 5 s and is absent under reduced motion; the "now" block is absent when there are no lines; "see all" links go to their pages; only technical posts appear; the page has no contact form and no email address. A desktop-profile Lighthouse run of the home page (the gate runs the mobile profile, where the H1 is the LCP) keeps LCP under 2.5 s with the hero lead as the LCP element, and settles whether Bricolage Grotesque is preloaded (§4.2). The link check's `skipFragment` entry for the skeleton's dead `#contact` anchor is removed (T-20).

### T-36 · Work listing

- **Status:** todo
- **Source:** §6.3
- **Depends on:** T-32, T-34
- **Done when:** two-column grid with technology chips; without JS every case shows, with JS the chips filter; filter state is announced to screen readers.

### T-37 · Case study page

- **Status:** todo
- **Source:** §6.3
- **Depends on:** T-36
- **Done when:** sections 01–04 with giant numbers and diagram visuals render from data for every mock case study; the page sets the layout's Space Grotesk preload (§4.2).

### T-38 · Blog listing, category and tag pages

- **Status:** todo
- **Source:** §6.4
- **Depends on:** T-32, T-34
- **Done when:** listing shows all posts by date with category, tags, date, reading time and excerpt; category filter and tag links work with and without JS; category and tag pages exist; tag pages with fewer than 3 posts are `noindex`.

### T-39 · Blog post page

- **Status:** todo
- **Source:** §6.4
- **Depends on:** T-38
- **Done when:** 65ch measure; code highlighted at build time in Commit Mono with light and dark themes that pass contrast; category, tags, reading time; share links without third-party scripts.

### T-40 · Feeds

- **Status:** todo
- **Source:** §6.4
- **Depends on:** T-38
- **Done when:** each locale has a general feed and one per category, linked from the page `<head>` and the blog; feeds validate.

### T-41 · Personal page

- **Status:** todo
- **Source:** §6.5
- **Depends on:** T-26, T-32, T-34, T-68
- **Done when:** (scope set by D-15) one page with entries grouped by topic, an anchor per topic, optional fields handled, and the full grouped list readable without JS.

### T-42 · About page

- **Status:** todo
- **Source:** §6.6
- **Depends on:** T-28, T-34, T-68
- **Done when:** bio, photo, CV download per locale, GitHub and LinkedIn links; whatever D-15 assigns to About from the personal section.

### T-43 · Tech timeline

- **Status:** todo
- **Source:** §6.6
- **Depends on:** T-42
- **Done when:** CSS Grid Gantt from 2014 to the build year with three category rows, on About; keyboard and screen-reader accessible; the same data readable as a list; respects reduced motion.

### T-44 · Contact form (interface)

- **Status:** todo
- **Source:** §6.6, §10
- **Depends on:** T-42
- **Done when:** fields with real labels, required markers, unchecked consent checkbox linking to the privacy policy, hidden honeypot, accessible inline errors and inline success (submission stubbed until T-55); usable without JS as far as the delivery service allows. A Playwright test checks the placeholder contrast in both themes, since axe doesn't check `::placeholder`.

### T-45 · 404 and legal page layouts

- **Status:** todo
- **Source:** §6.7
- **Depends on:** T-34
- **Done when:** branded 404 per locale with navigation and links to the main sections, setting the layout's Space Grotesk preload (§4.2); long-form layout for the privacy policy (placeholder text until T-56).

### T-46 · Remove the rest of the skeleton

- **Status:** todo
- **Source:** §0
- **Depends on:** T-35 – T-45
- **Done when:** `[...uri].astro`, `siteData.ts` and the meta-refresh `index.astro` are gone; no file references legacy tokens (`--color-accent`, `--color-text-main`, `--space-s`, `--space-l`, …).

## Phase 5 — Headless WordPress

### T-47 · Decide WordPress i18n and hosting (D-04)

- **Status:** todo
- **Source:** §3, §5, D-04
- **Depends on:** —
- **Done when:** i18n approach (WPML, Polylang or ACF custom) and WordPress hosting are recorded in the requirements.

### T-48 · WordPress install and hardening

- **Status:** todo
- **Source:** §13.1, §13.7, §13.8
- **Depends on:** T-47
- **Done when:** supported WordPress and PHP versions run at api.plastikaweb.com; `docs/wordpress.md` lists versions and required plugins; public front end disabled or redirected; admin with 2FA; automatic minor updates; scheduled backups; the WordPress project has `wp-plugin-development` and `wp-wpcli-and-ops` from `WordPress/agent-skills`, read and pinned to a commit.

### T-49 · WordPress content model

- **Status:** todo
- **Source:** §6.4, §6.5, §7
- **Depends on:** T-32, T-48
- **Done when:** case study and personal entry post types, personal topic taxonomy, the two fixed post categories, tags, ACF fields and a site settings page exist, translations are linked per T-47, and the shape matches the T-32 types.

### T-50 · GraphQL exposure and queries

- **Status:** todo
- **Source:** §3, §13.8
- **Depends on:** T-49
- **Done when:** WPGraphQL exposes only the fields the site uses; one query per page need; `graphql-request` installed; environment variable names documented in the README.

### T-51 · Swap the data source

- **Status:** todo
- **Source:** §3, §7
- **Depends on:** T-50
- **Done when:** the data-access module reads WordPress at build time behind the same interface; mappers are unit-tested against recorded responses; the build fails with a clear message if the API is unreachable or returns invalid data; mock data stays available for tests. If pages load WordPress images from api.plastikaweb.com at runtime instead of optimizing them at build time, the layout gains a `preconnect` to it (the skeleton's was removed in T-30: nothing used it).

### T-22 · Decide the deploy target (D-06)

- **Status:** todo (deferred: decided once WordPress and Astro run together locally)
- **Source:** §3, D-06
- **Depends on:** T-51
- **Done when:** host chosen and recorded; D-05 (form delivery) re-checked against it.

### T-23 · Preview and production deploys

- **Status:** todo
- **Source:** §13.5, §13.8
- **Depends on:** T-19, T-22
- **Done when:** every pull request gets a preview URL; merging to `main` deploys to production; security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are set and verified on the preview; the CSP allows the inline `<style>` blocks the Astro Fonts API emits and the inline theme and toggle scripts, by hash rather than `'unsafe-inline'` (Astro's `security.csp` hashes the scripts and styles it processes: check that these unprocessed ones are covered and add their hashes if not); secrets live only in the host and CI settings.

### T-52 · Load real content

- **Status:** todo
- **Source:** §6, §7
- **Depends on:** T-28, T-49
- **Done when:** real case studies, posts, personal entries, bio and CVs are in WordPress in the locales required by T-26.

### T-53 · Content rebuilds

- **Status:** todo
- **Source:** §13.5
- **Depends on:** T-23, T-51
- **Done when:** publishing or updating content in WordPress triggers a production build; a scheduled rebuild runs as a safety net, at least on the first day of each month (availability, §6.2).

## Phase 6 — Polish and launch

### T-54 · Decide form delivery (D-05)

- **Status:** todo
- **Source:** §6.6, D-05
- **Depends on:** T-22
- **Done when:** service chosen and recorded, checked against the host and the privacy policy.

### T-55 · Contact form delivery

- **Status:** todo
- **Source:** §6.6, §10
- **Depends on:** T-44, T-54
- **Done when:** submissions reach the inbox; server-side validation and honeypot rejection; a failure state when the service is down; end-to-end tests run against a stubbed service.

### T-56 · Privacy policy

- **Status:** todo
- **Source:** §6.7, §10
- **Depends on:** T-45, T-54
- **Done when:** privacy policy in ca, es and en naming the form processor and the analytics; cookie policy confirmed unnecessary (or written, if any non-essential cookie appeared).

### T-57 · SEO metadata

- **Status:** todo
- **Source:** §9.2
- **Depends on:** T-35 – T-45
- **Done when:** unique title, description and canonical per page and locale; `hreflang` with `x-default`; Open Graph and Twitter cards with preview images; JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList) passing validation. The link check (T-20) also checks the site's own absolute URLs (canonical, `hreflang`, Open Graph images), which it skips until then. That takes linkinator's `check()` API instead of its CLI: the skip pattern is tested on each link as the page writes it and again after any rewrite, so it has to exempt the site's origin, and `urlRewriteExpressions` must map that origin to the local server's port, which the CLI picks at random and won't take from `linkinator.config.json`. The skeleton's `og:image` (`/default-og.png`) doesn't exist yet.

### T-58 · Sitemap and robots

- **Status:** todo
- **Source:** §6.7, §9.2
- **Depends on:** T-57
- **Done when:** multilingual sitemap with alternates, excluding `noindex` pages; `robots.txt` pointing to it. Every sitemap URL is checked against `dist/`: the link check (T-20) reads only HTML and CSS, and linkinator's sitemap mode takes only an HTTP URL, not a file in `dist/`.

### T-59 · Analytics

- **Status:** todo
- **Source:** §9.3
- **Depends on:** T-23, T-55
- **Done when:** Plausible loads on every page, the CSP allows it, and form submissions are tracked as a goal.

### T-60 · Performance pass on real content

- **Status:** todo
- **Source:** §1.3, §8
- **Depends on:** T-51, T-52
- **Done when:** with real content, images are responsive with dimensions, fonts are subset, and the Lighthouse budgets pass on every template.

### T-61 · Manual accessibility pass

- **Status:** todo
- **Source:** §2, §13.3
- **Depends on:** T-52, T-55
- **Done when:** keyboard-only, VoiceOver and NVDA, 200% and 400% zoom, reduced motion and forced colors checked on every template in both themes; findings fixed or logged as P0/P1.

### T-62 · Cross-browser and device check

- **Status:** todo
- **Source:** §2
- **Depends on:** T-52
- **Done when:** current Chrome, Firefox and Safari on desktop, Safari on iOS and Chrome on Android checked on every template.

### T-63 · Redirects from the current site

- **Status:** todo
- **Source:** §9.2
- **Depends on:** T-29, T-52
- **Done when:** every indexed URL of the current plastikaweb.com maps to a new URL or a deliberate 404/410, and the 301s are configured on the host.

### T-64 · Monitoring

- **Status:** todo
- **Source:** §13.9
- **Depends on:** T-03, T-48
- **Done when:** uptime checks with alerts run for the site and the WordPress API.

### T-65 · Launch

- **Status:** todo
- **Source:** §11
- **Depends on:** T-53, T-55 – T-64
- **Done when:** the domain points to the new host over HTTPS, the gate passes on production, and a smoke test of every template in the three locales passes.

### T-66 · Post-launch

- **Status:** todo
- **Source:** §1.3, §9
- **Depends on:** T-65
- **Done when:** Search Console and Bing Webmaster Tools verified, sitemap submitted, indexing and `hreflang` reports checked after a week, KPI baseline started for the first month.

## Maintenance (recurring, after launch)

Source: §13.9. Each becomes a recurring task in ClickUp.

| ID  | Task                                                   | Frequency        |
| --- | ------------------------------------------------------ | ---------------- |
| M-1 | Review and merge dependency update pull requests       | Weekly / monthly |
| M-2 | WordPress core and plugin updates, backup first        | Monthly          |
| M-3 | Verify backups with a real restore                     | Quarterly        |
| M-4 | Check uptime alerts for the site and the WordPress API | Continuous       |
| M-5 | Lighthouse and accessibility audit of the live site    | Quarterly        |
| M-6 | Check external links in posts and personal entries     | Quarterly        |
| M-7 | Review README: setup, commands, env var names, deploy  | On change        |
