# Tasks

Backlog for the Plastikaweb site, in logical order: a task only depends on tasks above it. Derived from `docs/requirements.md` (each task cites its section); ClickUp is updated from this file.

Status: `todo` · `doing` · `done`. Open decisions (`D-xx`, requirements §12) appear as tasks placed before the work they block.

## Phase 1 — Requirements and backlog

Housekeeping that runs alongside T-01; nothing below depends on it except where noted.

| ID  | Task                                                                                                                                                                        | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| B-1 | Review `docs/requirements.md` and this file; commit both.                                                                                                                   | done   |
| B-2 | Update `CLAUDE.md` and `CLAUDE.local.md` to point at the requirements (Stitch → Claude Design, timeline on About, personal section, blog categories, task source of truth). | done   |
| B-3 | Sync ClickUp from this file: replace the old backlog, keep IDs in task names, recurring tasks for M-1 – M-7.                                                                | todo   |

## Phase 2 — Design

### T-01 · Design the interface in Claude Design

- **Status:** doing
- **Source:** requirements §4, §4.0, §6, §11 (phase 2)
- **Depends on:** —
- **Deliverable:** home page in two directions (A "Summary", B "Sticky identity"), then the remaining pages in the chosen direction; light and dark; 375 and 1440 px; component inventory with states.
- **Steps:**
  1. Draft the prompt: `docs/design/claude-design-prompt.md` — done, pending review.
  2. Run Prompt 1 in Claude Design; choose direction and hero CTA option (closes part of D-13).
  3. Run Prompt 2 for the remaining pages.
  4. Record the resulting decisions in `docs/requirements.md` and any new tokens in `src/styles/theme.css`.
- **Done when:** every page in §6.1 has an approved design in both themes and both widths, and the decisions it settled are in the requirements.

## Phase 3 — Foundation

Can run in parallel with T-01. Goal: the quality gate exists before the first page is built.

### T-02 · Decide the tooling (D-14)

- **Status:** todo
- **Source:** §13, D-14
- **Depends on:** —
- **Done when:** test runners, git hook tool, dependency bot and uptime monitor are chosen and recorded in §13 (replacing "proposed").

### T-03 · Pin runtime and versions

- **Status:** todo
- **Source:** §13.1
- **Depends on:** —
- **Done when:** `.nvmrc` and `engines` pin the Node LTS supported by Astro 6; dependencies on the latest Astro 6.x; `npm ci` and `npm run build` pass; README states the Node version.

### T-04 · Remove template leftovers

- **Status:** todo
- **Source:** §0
- **Depends on:** T-03
- **Done when:** `Layout.astro`, `Welcome.astro`, `src/assets/astro.svg` and `background.svg` are gone and the build passes. (The rest of the skeleton is replaced page by page in phase 4.)

### T-05 · Editor settings and format check

- **Status:** todo
- **Source:** §13.2
- **Depends on:** T-03
- **Done when:** `.editorconfig` exists; `npm run format:check` fails on unformatted files.

### T-06 · ESLint

- **Status:** todo
- **Source:** §13.2
- **Depends on:** T-03
- **Done when:** `npm run lint` runs `typescript-eslint` and `eslint-plugin-astro` (with its accessibility rules) over `src/` with zero errors.

### T-07 · Stylelint with token rules

- **Status:** todo
- **Source:** §13.2, `.claude/rules/css.md`
- **Depends on:** T-03
- **Done when:** `npm run lint:css` rejects color literals and ad-hoc px outside `theme.css`, physical properties where logical ones exist, and `[data-theme]` overrides in components; `theme.css` passes.

### T-08 · Type checking

- **Status:** todo
- **Source:** §13.2
- **Depends on:** T-03
- **Done when:** `@astrojs/check` installed; `npm run check` passes with TypeScript strict.

### T-09 · Git hooks and commit convention

- **Status:** todo
- **Source:** §13.2
- **Depends on:** T-02, T-05, T-06, T-07
- **Done when:** pre-commit formats and lints staged files; commit messages are validated against Conventional Commits.

### T-10 · Unit test setup

- **Status:** todo
- **Source:** §13.3
- **Depends on:** T-02, T-03
- **Done when:** `npm test` runs the chosen runner with one passing example test and coverage output.

### T-11 · End-to-end and accessibility test setup

- **Status:** todo
- **Source:** §13.3
- **Depends on:** T-02, T-03
- **Done when:** `npm run test:e2e` builds, serves the build and runs a smoke test plus an axe check on the home page in both themes at 375 and 1440 px.

### T-12 · CI quality gate

- **Status:** todo
- **Source:** §13.4
- **Depends on:** T-05 – T-08, T-10, T-11
- **Done when:** a GitHub Actions workflow runs on every pull request — `npm ci`, format check, lint, CSS lint, type check, unit tests, build, end-to-end and accessibility tests, dependency audit — with the Node version from `.nvmrc`; `main` is protected and requires it.

### T-13 · Lighthouse CI and build-output checks

- **Status:** todo
- **Source:** §1.3, §13.3
- **Depends on:** T-12
- **Done when:** Lighthouse CI asserts the §1.3 budgets on every built page; HTML validation and an internal link check run on `dist/`; all three are part of the gate.

### T-14 · Dependency update bot

- **Status:** todo
- **Source:** §13.5
- **Depends on:** T-02, T-12
- **Done when:** the chosen bot opens grouped update pull requests on a schedule, and they go through the gate.

### T-15 · Decide the deploy target (D-06)

- **Status:** todo
- **Source:** §3, D-06
- **Depends on:** —
- **Done when:** host chosen and recorded; D-05 (form delivery) re-checked against it.

### T-16 · Preview and production deploys

- **Status:** todo
- **Source:** §13.4, §13.5
- **Depends on:** T-12, T-15
- **Done when:** every pull request gets a preview URL; merging to `main` deploys to production; security headers (CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) are set and verified on the preview; secrets live only in the host and CI settings.

## Phase 4 — Front end with mock data

Page tasks depend on T-01 (approved design for that page) and T-12 (quality gate). A page task is done only when it matches the approved design in both themes at 375 and 1440 px, all its copy exists in ca, es and en, and its end-to-end, axe and Lighthouse checks pass in the gate.

### T-17 · Decide routing (D-01, D-02)

- **Status:** todo
- **Source:** §5, §6.1, D-01, D-02
- **Depends on:** —
- **Done when:** slug scheme (localized or shared) and default locale / behaviour of `/` are recorded in the requirements, with the full route table per locale.

### T-18 · Decide the open content questions (D-09, D-10, D-11, D-12)

- **Status:** todo
- **Source:** §6.4, §6.5, §7, D-09 – D-12
- **Depends on:** —
- **Done when:** personal page name and entry shape, category labels in three locales, the missing-translation rule and the personal-vs-blog boundary are recorded in the requirements.

### T-19 · Decide font hosting and muted text (D-07, D-08)

- **Status:** todo
- **Source:** §4.1, §4.2, D-07, D-08
- **Depends on:** —
- **Done when:** both decisions are recorded; D-08 with contrast ratios that pass AA in both themes.

### T-20 · Site copy and assets

- **Status:** todo
- **Source:** §6.2, §6.6, §11
- **Depends on:** —
- **Done when:** hero, services, About bio and personal-page intro exist in ca, es and en; professional photo and a CV per locale are ready.

### T-21 · Astro configuration and routing

- **Status:** todo
- **Source:** §3, §5, §6.1
- **Depends on:** T-03, T-17
- **Done when:** `astro.config.mjs` sets `site`, static output, i18n routing per T-17 and a trailing-slash policy; `/` behaves as decided; every route in §6.1 resolves for the three locales (placeholder content allowed).

### T-22 · Tokens and font loading

- **Status:** todo
- **Source:** §4, D-07, D-08
- **Depends on:** T-01, T-19
- **Done when:** `theme.css` has the tokens the design added, no rounded `--radius-*` values remain (sharp corners), muted text passes AA, fonts load as decided with only Space Grotesk preloaded; `docs/design-state.md` contrast table updated.

### T-23 · UI strings and i18n helpers

- **Status:** todo
- **Source:** §2, §5
- **Depends on:** T-10, T-21
- **Done when:** every UI string, including accessible names, lives in one dictionary per locale with type-checked keys; helpers return the localized path of any page and its alternates in the other locales; unit tests cover them.

### T-24 · Content model and mock data layer

- **Status:** todo
- **Source:** §3, §6.4, §7
- **Depends on:** T-10, T-18, T-23
- **Done when:** types for case studies, posts (category + tags), tags, categories, personal topics and entries, and site settings mirror the planned WPGraphQL responses; pages read data only through a data-access module; mock data meets §7 minimums; reading time, linked translations, the D-11 rule and the reserved-slug build check (`category`, `tag`) are implemented and unit-tested.

### T-25 · Base layout and navigation

- **Status:** todo
- **Source:** §2, §4.5, §5, §6
- **Depends on:** T-01, T-22, T-23
- **Done when:** a new base layout replaces `BaseLayout.astro` and `ThemeToggle.astro`: `lang` per locale, skip link, landmarks, theme script before first paint, theme toggle `<button>` with persistence and crossfade, main menu (Work, Blog, Personal, About) with a small-screen pattern that doesn't truncate ca/es labels, language selector linking to the same page, footer. End-to-end tests cover theme persistence without a flash and language switching.

### T-26 · Shared components

- **Status:** todo
- **Source:** §4, T-01 component inventory
- **Depends on:** T-25
- **Done when:** the components in the design inventory (buttons, links, chips, tags, cards, section heading with "see all", …) exist with all their states, using semantic tokens only.

### T-27 · Home page

- **Status:** todo
- **Source:** §6.2
- **Depends on:** T-20, T-24, T-26
- **Done when:** the six sections render in order from data; "see all" links go to their pages; only technical posts appear; personal cards link to topic anchors.

### T-28 · Work listing

- **Status:** todo
- **Source:** §6.3
- **Depends on:** T-24, T-26
- **Done when:** two-column grid with technology chips; without JS every case shows, with JS the chips filter; filter state is announced to screen readers.

### T-29 · Case study page

- **Status:** todo
- **Source:** §6.3
- **Depends on:** T-28
- **Done when:** sections 01–04 with giant numbers and diagram visuals render from data for every mock case study.

### T-30 · Blog listing, category and tag pages

- **Status:** todo
- **Source:** §6.4
- **Depends on:** T-24, T-26
- **Done when:** listing shows all posts by date with category, tags, date, reading time and excerpt; category filter and tag links work with and without JS; category and tag pages exist; tag pages with fewer than 3 posts are `noindex`.

### T-31 · Blog post page

- **Status:** todo
- **Source:** §6.4
- **Depends on:** T-30
- **Done when:** 65ch measure; code highlighted at build time in Commit Mono with light and dark themes that pass contrast; category, tags, reading time; share links without third-party scripts.

### T-32 · Feeds

- **Status:** todo
- **Source:** §6.4
- **Depends on:** T-30
- **Done when:** each locale has a general feed and one per category, linked from the page `<head>` and the blog; feeds validate.

### T-33 · Personal page

- **Status:** todo
- **Source:** §6.5
- **Depends on:** T-18, T-24, T-26
- **Done when:** one page with entries grouped by topic, an anchor per topic, optional fields handled, and the full grouped list readable without JS.

### T-34 · About page

- **Status:** todo
- **Source:** §6.6
- **Depends on:** T-20, T-26
- **Done when:** bio, photo, CV download per locale, GitHub and LinkedIn links.

### T-35 · Tech timeline

- **Status:** todo
- **Source:** §6.6
- **Depends on:** T-34
- **Done when:** CSS Grid Gantt from 2014 to the build year with three category rows, on About; keyboard and screen-reader accessible; the same data readable as a list; respects reduced motion.

### T-36 · Contact form (interface)

- **Status:** todo
- **Source:** §6.6, §10
- **Depends on:** T-34
- **Done when:** fields with real labels, required markers, unchecked consent checkbox linking to the privacy policy, hidden honeypot, accessible inline errors and inline success (submission stubbed until T-47); usable without JS as far as the delivery service allows.

### T-37 · 404 and legal page layouts

- **Status:** todo
- **Source:** §6.7
- **Depends on:** T-26
- **Done when:** branded 404 per locale with navigation and links to the main sections; long-form layout for the privacy policy (placeholder text until T-48).

### T-38 · Remove the rest of the skeleton

- **Status:** todo
- **Source:** §0
- **Depends on:** T-27 – T-37
- **Done when:** `[...uri].astro`, `siteData.ts` and the meta-refresh `index.astro` are gone; no file references legacy tokens (`--color-accent`, `--color-text-main`, `--space-s`, `--space-l`, …).

## Phase 5 — Headless WordPress

### T-39 · Decide WordPress i18n and hosting (D-04)

- **Status:** todo
- **Source:** §3, §5, D-04
- **Depends on:** —
- **Done when:** i18n approach (WPML, Polylang or ACF custom) and WordPress hosting are recorded in the requirements.

### T-40 · WordPress install and hardening

- **Status:** todo
- **Source:** §13.1, §13.5
- **Depends on:** T-39
- **Done when:** supported WordPress and PHP versions run at api.plastikaweb.com; `docs/wordpress.md` lists versions and required plugins; public front end disabled or redirected; admin with 2FA; automatic minor updates; scheduled backups.

### T-41 · WordPress content model

- **Status:** todo
- **Source:** §6.4, §6.5, §7
- **Depends on:** T-24, T-40
- **Done when:** case study and personal entry post types, personal topic taxonomy, the two fixed post categories, tags, ACF fields and a site settings page exist, translations are linked per T-39, and the shape matches the T-24 types.

### T-42 · GraphQL exposure and queries

- **Status:** todo
- **Source:** §3, §13.5
- **Depends on:** T-41
- **Done when:** WPGraphQL exposes only the fields the site uses; one query per page need; `graphql-request` installed; environment variable names documented in the README.

### T-43 · Swap the data source

- **Status:** todo
- **Source:** §3, §7
- **Depends on:** T-42
- **Done when:** the data-access module reads WordPress at build time behind the same interface; mappers are unit-tested against recorded responses; the build fails with a clear message if the API is unreachable or returns invalid data; mock data stays available for tests.

### T-44 · Load real content

- **Status:** todo
- **Source:** §6, §7
- **Depends on:** T-20, T-41
- **Done when:** real case studies, posts, personal entries, bio and CVs are in WordPress in the locales required by T-18.

### T-45 · Content rebuilds

- **Status:** todo
- **Source:** §13.4
- **Depends on:** T-16, T-43
- **Done when:** publishing or updating content in WordPress triggers a production build; a scheduled rebuild runs as a safety net.

## Phase 6 — Polish and launch

### T-46 · Decide form delivery (D-05)

- **Status:** todo
- **Source:** §6.6, D-05
- **Depends on:** T-15
- **Done when:** service chosen and recorded, checked against the host and the privacy policy.

### T-47 · Contact form delivery

- **Status:** todo
- **Source:** §6.6, §10
- **Depends on:** T-36, T-46
- **Done when:** submissions reach the inbox; server-side validation and honeypot rejection; a failure state when the service is down; end-to-end tests run against a stubbed service.

### T-48 · Privacy policy

- **Status:** todo
- **Source:** §6.7, §10
- **Depends on:** T-37, T-46
- **Done when:** privacy policy in ca, es and en naming the form processor and the analytics; cookie policy confirmed unnecessary (or written, if any non-essential cookie appeared).

### T-49 · SEO metadata

- **Status:** todo
- **Source:** §9.2
- **Depends on:** T-27 – T-37
- **Done when:** unique title, description and canonical per page and locale; `hreflang` with `x-default`; Open Graph and Twitter cards with preview images; JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList) passing validation.

### T-50 · Sitemap and robots

- **Status:** todo
- **Source:** §6.7, §9.2
- **Depends on:** T-49
- **Done when:** multilingual sitemap with alternates, excluding `noindex` pages; `robots.txt` pointing to it.

### T-51 · Analytics

- **Status:** todo
- **Source:** §9.3
- **Depends on:** T-16, T-47
- **Done when:** Plausible loads on every page, the CSP allows it, and form submissions are tracked as a goal.

### T-52 · Performance pass on real content

- **Status:** todo
- **Source:** §1.3, §8
- **Depends on:** T-43, T-44
- **Done when:** with real content, images are responsive with dimensions, fonts are subset, and the Lighthouse budgets pass on every template.

### T-53 · Manual accessibility pass

- **Status:** todo
- **Source:** §2, §13.3
- **Depends on:** T-44, T-47
- **Done when:** keyboard-only, VoiceOver and NVDA, 200% and 400% zoom, reduced motion and forced colors checked on every template in both themes; findings fixed or logged as P0/P1.

### T-54 · Cross-browser and device check

- **Status:** todo
- **Source:** §2
- **Depends on:** T-44
- **Done when:** current Chrome, Firefox and Safari on desktop, Safari on iOS and Chrome on Android checked on every template.

### T-55 · Redirects from the current site

- **Status:** todo
- **Source:** §9.2
- **Depends on:** T-21, T-44
- **Done when:** every indexed URL of the current plastikaweb.com maps to a new URL or a deliberate 404/410, and the 301s are configured on the host.

### T-56 · Monitoring

- **Status:** todo
- **Source:** §13.6
- **Depends on:** T-02, T-40
- **Done when:** uptime checks with alerts run for the site and the WordPress API.

### T-57 · Launch

- **Status:** todo
- **Source:** §11
- **Depends on:** T-45, T-47 – T-56
- **Done when:** the domain points to the new host over HTTPS, the gate passes on production, and a smoke test of every template in the three locales passes.

### T-58 · Post-launch

- **Status:** todo
- **Source:** §1.3, §9
- **Depends on:** T-57
- **Done when:** Search Console and Bing Webmaster Tools verified, sitemap submitted, indexing and `hreflang` reports checked after a week, KPI baseline started for the first month.

## Maintenance (recurring, after launch)

Source: §13.6. Each becomes a recurring task in ClickUp.

| ID  | Task                                                   | Frequency        |
| --- | ------------------------------------------------------ | ---------------- |
| M-1 | Review and merge dependency update pull requests       | Weekly / monthly |
| M-2 | WordPress core and plugin updates, backup first        | Monthly          |
| M-3 | Verify backups with a real restore                     | Quarterly        |
| M-4 | Check uptime alerts for the site and the WordPress API | Continuous       |
| M-5 | Lighthouse and accessibility audit of the live site    | Quarterly        |
| M-6 | Check external links in posts and personal entries     | Quarterly        |
| M-7 | Review README: setup, commands, env var names, deploy  | On change        |
