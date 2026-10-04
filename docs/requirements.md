# Plastikaweb — requirements

Revision of the v6 analysis (`Plastikaweb_Analisi_Requeriments_v6.pdf`, April 2026). Status: **draft, October 2026**.

## 0. About this document

- This file replaces the v6 PDF and its markdown copy as the single source of requirements. `TASKS.md` is derived from it; every task should point to the section it comes from.
- `src/styles/theme.css` holds every visual value. This document records the decisions, not the numbers.
- `docs/design-state.md` keeps the design review log and the contrast audit. Its decisions up to October 2026 are folded in here (§4); from now on, new decisions are recorded here.
- The code currently in the repo is a borrowed skeleton used to get a deployable app. It is not an implementation of these requirements and is replaced, not extended. Written for v6 and kept: `src/styles/theme.css`, the self-hosted Commit Mono files in `public/fonts/`, `docs/design-state.md`, `.claude/rules/css.md`.
- Open decisions are listed in §12 with an ID (`D-xx`); sections refer to them instead of guessing.
- §14 lists what changed from v6.

## 1. Goals and success criteria

### 1.1 Goals

- Win high-quality freelance clients: companies that need a senior Angular/TypeScript expert.
- Position Carlos Matheu as a technical reference through the blog and the technology timeline.
- Show the person behind the developer: a personal section and non-technical writing (§6.5, §6.4).
- The site is a professional showcase, a lead generator and a technical lab. It has to prove front-end craft by itself: semantics, accessibility, performance.

### 1.2 Audience

CTOs, technical recruiters and high-end freelance clients. Secondary: developers who arrive through the blog.

### 1.3 Success criteria

- Lighthouse 100 in Performance, Accessibility, Best Practices and SEO, on every page template, in both themes.
- Core Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms (INP replaced FID in 2024).
- Qualified contacts through the form (baseline measured during the first month after launch).
- Average time on site > 2 minutes.
- Ranking for "freelance angular developer spain" and variants (§9.1).

## 2. Non-negotiables

- **Semantic HTML:** landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, no skipped heading levels, decorative text never marked up as a heading, `<button>` for actions and `<a>` for navigation.
- **Accessibility:** WCAG 2.2 AA minimum. Visible focus, full keyboard support, `prefers-reduced-motion` respected, every form control with a real label, every accessible name translated.
- **Responsive:** every viewport from 320 px up; no horizontal scroll.
- **Minimal client JS:** HTML and CSS first. Scripts or islands only where interaction needs them: theme toggle, language selector, work and blog filters, contact form, tech timeline.
- **Flexible text containers:** Catalan and Spanish run up to ~30% longer than English. No fixed widths or heights on elements that contain text.
- **No single-language copy:** all UI copy exists in ca, es and en.

## 3. Architecture

| Layer     | Choice                                     | Notes                                                                     |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| Front end | Astro 6, static output                     | Standalone repository, no monorepo.                                       |
| Styles    | Native modern CSS with custom properties   | No Tailwind, utility framework or CSS-in-JS.                              |
| CMS       | Headless WordPress                         | Backend at api.plastikaweb.com. ACF for custom fields. i18n plugin: D-04. |
| API       | WPGraphQL                                  | Client: `graphql-request` (planned). Data fetched at build time.          |
| Deploy    | Static host with CDN and automatic deploys | D-06.                                                                     |
| Analytics | Plausible                                  | Cookieless, so no consent banner (§10).                                   |
| Form      | Third-party delivery service               | D-05.                                                                     |
| Design    | Claude Design                              | Replaces Google Stitch → Figma (§11).                                     |

Data access goes through a single layer whose return types match the future WPGraphQL responses, so moving from mock data to WordPress swaps the data source, not the components (§7).

## 4. Design system

Values live in `theme.css`; component rules in `.claude/rules/css.md`.

### 4.0 Inspiration

Reference sites for structure and interaction, not for look. The palette, type and shape decisions below stay; copying a reference's visual identity is out of scope.

| Site                                              | Take                                                                                                                                                                                                              | Leave                                                                                                                                                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ramx.in](https://ramx.in/)                       | Home as a summary: each section shows a few items and a "see all" link to its page. Personal topics (books, films) as compact cards.                                                                              | Monochrome, single narrow column; job-seeker framing; live "last played" widget.                                                                                                                |
| [psudokit.in](https://www.psudokit.in/)           | First-person, relaxed voice; short lines of what I'm doing now; subtle line-texture background.                                                                                                                   | Lowercase-only copy. Keyboard shortcut hints in the nav and the GitHub activity graph: dropped for v1 (shortcuts need a way to turn them off, WCAG 2.1.4; the graph needs a build-time render). |
| [brittanychiang.com](https://brittanychiang.com/) | Desktop layout with a sticky identity column (name, role, one line, section nav with active indicator, socials) and a scrolling content column; list rows with hover states and tech chips; accessibility polish. | Navy palette; cursor spotlight effect (decorative JS, and must respect reduced motion if adopted).                                                                                              |

### 4.1 Color

- Palette 7 from uicolors.app: Red (primary, `#FF0008`, red-600), Broom (secondary, `#FFF42D`, broom-400), Electric Violet (tertiary, `#6032F8`, violet-600), Raven neutrals, and Green, Corn and Flush Mahogany for success, warning and error.
- **One red.** `#FF0008` is for accents, borders, icons and large display text. Filled buttons and brand blocks use the brand surface (red-700, hover red-800) with white text; links use the link tokens (red-700 / red-400). Reason: white on red-600 is 4.0:1 and fails AA for normal text.
- Components use semantic tokens only; raw scales stay inside theme.css.
- Every text/background pair passes WCAG AA in both themes. Pending: muted text (D-08).

### 4.2 Typography

- **Space Grotesk** (`--font-display`): hero H1 and giant case-study numbers only.
- **Bricolage Grotesque** (`--font-sans`, variable): everything else — headings, body, navigation, buttons.
- **Commit Mono** (`--font-mono`): tags, dates, metadata, code, form placeholders. Self-hosted woff2.
- Fluid type scale (`--step--2` … `--step-6`, 16 → 20 px base between 320 and 1440 px) by default; fixed sizes only for UI text that must not scale.
- Loading: `font-display: swap` for all; preload Space Grotesk only. Where Space Grotesk and Bricolage are hosted: D-07.

### 4.3 Space and layout

- Content width 72rem; long-form text 65ch.
- Fluid spacing between sections, fixed spacing inside components, logical properties throughout.

### 4.4 Shape, surfaces and motion

- **Sharp corners throughout:** no pill or capsule shapes. (`theme.css` still defines `--radius-*` tokens up to `9999px`; they must be removed or justified.)
- Theme-aware glass surfaces (`.glass`, `.glass--strong`) and a red → violet text gradient.
- Motion uses duration and easing tokens, which collapse to 0 under `prefers-reduced-motion`.
- Shadows, borders and highlights stay visible in both themes.

### 4.5 Light and dark themes

- Theme values are declared once with `light-dark()` and resolved through `color-scheme`. `[data-theme]` on `<html>` only forces the scheme.
- An inline script in `<head>` sets `data-theme` from `localStorage`, falling back to `prefers-color-scheme`, before first paint (no flash of the wrong theme).
- Toggle: a real `<button>` with a translated accessible name, persisted in `localStorage`. The body crossfades between themes; this transition is a priority detail.

## 5. Internationalization

- Locales: Catalan (`ca`), Spanish (`es`), English (`en`). Pages, case studies and UI copy exist in all three; blog posts and personal entries may exist in only some (D-11, below).
- Localized routes. Slug scheme: D-01. Default locale and what `/` serves: D-02.
- Language selector in the navigation (CA · ES · EN), linking to the same page in the other locale; the choice is persisted.
- Browser language is only a fallback for the first visit (D-02).
- Content managed per locale in WordPress (D-04). Missing translations (D-11, decided): pages, case studies, site settings and UI strings are required in all three locales, and the build fails if one is missing. Blog posts and personal entries are published only in the locales where they exist: they don't appear in the other locales' listings, feeds or sitemaps, `hreflang` links only real translations, and on such a post the language selector links to the blog listing of the other locale. No fallback-language content.

## 6. Pages

Navigation is present on every page. Main menu items: Work, Blog, Personal, About (labels per locale; the personal item is "Personal" in all three). Plus the language selector and the theme toggle. With ca/es labels up to 30% longer, the menu needs a small-screen pattern that doesn't truncate. Decided: below the wide breakpoint the four links move to a second header row, spread across the width; no hamburger menu and no truncation.

### 6.1 Site map

| Page               | Route (pending D-01)               |
| ------------------ | ---------------------------------- |
| Home               | `/[lang]/`                         |
| Work listing       | `/[lang]/work`                     |
| Case study         | `/[lang]/work/[slug]`              |
| Blog listing       | `/[lang]/blog`                     |
| Blog category page | `/[lang]/blog/category/[category]` |
| Blog tag page      | `/[lang]/blog/tag/[tag]`           |
| Post               | `/[lang]/blog/[slug]`              |
| Personal           | `/[lang]/personal`                 |
| About + contact    | `/[lang]/about`                    |
| Privacy policy     | `/[lang]/privacy`                  |
| Cookie policy      | only if ever needed (§10)          |
| 404                | `/404`                             |

### 6.2 Home

A summary of the site: each section shows a few items and a "see all" **link** to its full page. Nothing expands in place, so the home page carries no duplicated content and needs no JS for it. Structure inspired by ramx.in; the look follows the design system in §4, not that site.

Sections, in this order:

1. **Intro (hero):** name, role, one-line positioning, availability, social links and a contact CTA. "ANGULAR" highlight in the secondary yellow. The CTA set is pending (D-13): the three-CTA rule from `docs/design-state.md` assumed anchors to home sections, which no longer applies.
2. **Services:** three columns — Front-End Development, Angular Architecture, Performance. No "see all" (there's no services page).
3. **Selected work:** 2–3 featured case studies, "see all" → Work.
4. **Latest posts:** the three most recent _technical_ posts, "see all" → Blog. _Thoughts_ posts never appear on the home page.
5. **Personal:** 3–4 topic cards, text only (no cover images), each linking to its anchor on the personal page (e.g. `/personal#books`).
6. **Contact CTA:** closing block on a brand surface.

The tech timeline is not on the home page; it lives on About (§6.6).

### 6.3 Work

- **Listing:** two-column grid filterable by technology chips: Angular, TypeScript, RxJS, NgRx, Performance. Filtering works without JS as a full list; JS adds the filter. Layout: variant 1 structure with variant 3's larger expanded-row image.
- **Case study:** sections 01 Challenge, 02 Solution, 03 Stack, 04 Results, with giant Space Grotesk numbers. Visuals are diagrams, not real screenshots.

### 6.4 Blog

Posts are classified on two axes:

- **Category (new):** exactly one per post, required, from a fixed set of two — _technical_ and _Thoughts_ (random thoughts, philosophy, …). Labels and slugs (D-10, decided): technical is _Enginyeria_ / _Ingeniería_ / _Engineering_ (`enginyeria`, `ingenieria`, `engineering`); Thoughts is _Pensaments_ / _Pensamientos_ / _Thoughts_ (`pensaments`, `pensamientos`, `thoughts`). WordPress native categories. The category decides where a post is shown; it is not a topic.
- **Tags (new):** one or more per post (e.g. `javascript` + `frontend` + `security`). The tag set is open-ended and grows over time: tags are data (WordPress tags), never hard-coded. Each tag has a name and slug per locale. Tags describe the topic.

Pages:

- **Listing:** shows all posts by default, sorted by date; each item shows its category, tags, date, reading time and excerpt. A prominent category filter plus tag filtering; without JS, every category and tag links to its own page.
- **Category page:** lists the posts in that category. Category and tag pages live under `/blog/category/` and `/blog/tag/`, so `category` and `tag` are reserved and can't be post slugs (the build must fail if one is).
- **Tag page:** lists the posts with that tag. Indexed only when the tag has at least 3 posts; below that the page is `noindex` (and left out of the sitemap) to avoid thin, near-duplicate pages. The threshold of 3 is a starting value, adjustable.
- **Post:** 65ch measure, Commit Mono syntax highlighting for code, share links (no third-party share scripts), category, tags and reading time.
- **Feeds:** one general feed plus one per category, so readers who follow the technical writing don't get Thoughts posts.
- Positioning risk: Thoughts posts sit on a site aimed at CTOs and recruiters, and dilute the technical keywords (§9.1). The category keeps them in check: off the home page, filterable in the listing, separate feed.

### 6.5 Personal section (new)

- A section about the person, with varied content: films, books, music, philosophy, psychology, and more topics over time. The topic list is open-ended, so topics are data (a taxonomy in WordPress), not hard-coded sections.
- **One URL:** a single page, no detail pages. Entries are grouped or filterable by topic on that page; each topic is reachable by an in-page anchor so it can be linked directly. Filtering, if any, works without JS as the full grouped list.
- **Main menu item** of its own (§6).
- Content comes from WordPress like the rest, in the three locales.
- Decided (D-09): the page is "Personal" in all three locales, at `/[lang]/personal`; the page heading can carry more voice than the menu label. Topics are ordered by a manual order field. Entries have no cover images in v1 (rights on covers and posters, image weight); entry shape in §7.
- Political topics are out of scope.
- Boundary with the blog (D-12, decided): a personal entry is a short note about a work or an idea (about three lines, no URL of its own). Anything that argues a point or runs longer is a _Thoughts_ blog post, which the entry can link to. Personal topics and blog tags are separate taxonomies, even when they share a name (philosophy, psychology…).

### 6.6 About and contact

- Professional bio, photo, CV download, GitHub and LinkedIn links.
- **Tech timeline:** interactive CSS Grid Gantt from 2014 to the current year, three category rows. Keyboard and screen-reader accessible; the data is also readable as a plain list.
- **Contact form:** Name\*, Company, Email\*, Message\*, GDPR consent checkbox\* linking to the privacy policy; hidden honeypot field; labels in plain language.
- Validation with inline, accessible error messages; success shown inline without redirect; works with keyboard and screen readers.
- Delivery service: D-05.

### 6.7 Required pages

- **404:** branded, with navigation and links to the main sections, in the three locales.
- **Privacy policy:** mandatory (the form collects personal data).
- **Cookie policy:** only if non-essential cookies are ever introduced; with Plausible and no third-party embeds there are none.
- **Multilingual XML sitemap and robots.txt**, generated at build.

## 7. Content model

Mock data first, shaped like the future WPGraphQL responses.

- **Case study:** title, slug, locale, summary, featured flag, technologies (from the chip set), challenge, solution, stack, results, diagrams, dates, SEO fields.
- **Category:** fixed set of two (Engineering, Thoughts); name and slug per locale (§6.4).
- **Tag:** name and slug per locale.
- **Post:** title, slug, locale, date, one category, one or more tags, excerpt, body, reading time, SEO fields.
- **Personal topic:** name and slug per locale, manual order, optional one-line note per locale (shown on the home card).
- **Personal entry:** topic, title, locale, short text (about three lines), date added (orders entries within a topic, newest first); optional creator (author, director, artist), year, external link, link to a related blog post. No cover image in v1 (D-09).
- **Site settings:** bio, CV file per locale, social links, hero and services copy.
- Translations of the same item are linked so the language selector and `hreflang` can find them.
- Mock data minimum: 3 complete case studies, 3–5 posts covering both categories, with several tags each, and personal entries across at least four topics, enough to lay out the page.

## 8. Performance

- Static HTML for every page; no client-side data fetching for content.
- Images: responsive, modern formats, explicit dimensions, lazy below the fold.
- Fonts: subset woff2, only the preload in §4.2.
- No third-party scripts except Plausible.

## 9. SEO and analytics

### 9.1 Target keywords

- "freelance angular developer spain", "senior frontend developer angular"
- "desarrollador frontend freelance angular barcelona"
- "angular typescript consultant"

### 9.2 Implementation

- Unique title, description and canonical per page and locale.
- `hreflang` alternates for ca, es, en and `x-default` on every page.
- Open Graph and Twitter cards with a preview image.
- JSON-LD: Person, WebSite, BlogPosting, BreadcrumbList.
- Multilingual sitemap and robots.txt.
- Redirects from the current plastikaweb.com: every indexed URL maps with a 301 to its new equivalent, or returns a deliberate 404/410, so existing rankings and inbound links are kept.

### 9.3 Analytics

Plausible: cookieless, GDPR-compliant, no consent banner.

## 10. Legal (GDPR / LOPDGDD)

- Privacy policy: mandatory.
- Contact form: explicit consent checkbox linking to the policy; consent is not pre-checked.
- No non-essential cookies, so no cookie banner and no cookie policy unless that changes.
- Policy texts in ca, es and en.

## 11. Phases

1. **Requirements and backlog:** this document, `TASKS.md`, ClickUp updated from `TASKS.md`.
2. **Design in Claude Design:** a product brief (`PRODUCT.md`) first, then pages and components in both themes and at mobile and desktop widths, using the tokens in `theme.css`. Replaces the Stitch → Figma phase; the Stitch exports remain historical references.
3. **Foundation** (can run in parallel with phase 2): pinned versions, linting, formatting, type checking, test setup, git hooks, CI quality gate, preview and production deploys (§13). The quality gate exists before the first page is built, so every page is born passing it.
4. **Front end with mock data:** Astro setup, i18n, layout and navigation, every page, theme toggle, timeline, filters.
5. **Headless WordPress:** WPGraphQL, i18n plugin, content types (case studies, posts with categories and tags, personal entries), swap of the data source, content rebuild hook.
6. **Polish and launch:** contact form delivery, analytics, SEO, legal texts, manual accessibility pass, Lighthouse audit, production launch.
7. **Maintenance** (ongoing after launch): §13.9.

Content needed before or during phase 4: hero copy in three locales, an updated professional photo, mock data (§7), CV.

## 12. Open decisions

| ID   | Decision                                                                                                                                                                                                                                            | Blocks                     |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| D-01 | Route slugs: localized (`/ca/projectes`, `/es/proyectos`, `/en/projects`) or shared (`/[lang]/work`).                                                                                                                                               | Routing, sitemap, hreflang |
| D-02 | Default locale, and what `/` serves: default-locale home or a redirect by saved or browser language.                                                                                                                                                | Routing, SEO               |
| D-03 | ~~Tech timeline on the home page or on About.~~ Decided: About (§6.6).                                                                                                                                                                              | —                          |
| D-04 | WordPress i18n: WPML, Polylang or ACF custom; WordPress hosting.                                                                                                                                                                                    | Phase 4                    |
| D-05 | Contact form delivery: Resend, EmailJS or Netlify Forms (depends partly on D-06).                                                                                                                                                                   | Contact form               |
| D-06 | Deploy target: Vercel, Netlify or Cloudflare Pages.                                                                                                                                                                                                 | Deploy, form               |
| D-07 | Font hosting: Google Fonts CDN or self-hosting Space Grotesk and Bricolage like Commit Mono.                                                                                                                                                        | Layout, privacy            |
| D-08 | Muted text color that passes AA (see `docs/design-state.md`).                                                                                                                                                                                       | Tokens, form placeholders  |
| D-09 | ~~Personal section: page name and slug per locale, entry shape, topic order.~~ Decided: "Personal" at `/[lang]/personal`, manual topic order, no covers in v1, entry shape in §7 (§6.5).                                                            | —                          |
| D-10 | ~~Blog: label of the technical category, and ca/es labels for both.~~ Decided: Enginyeria / Ingeniería / Engineering and Pensaments / Pensamientos / Thoughts, with localized slugs (§6.4).                                                         | —                          |
| D-11 | ~~Content missing in one locale.~~ Decided: required in all three for pages, case studies and UI; posts and personal entries only where they exist, no fallback (§5).                                                                               | —                          |
| D-12 | ~~Boundary between personal entries and non-technical blog posts.~~ Decided: short note without URL vs. Thoughts post; separate taxonomies (§6.5).                                                                                                  | —                          |
| D-13 | Home page: hero CTA set (the three-anchor rule no longer applies); whether a work-experience section is added (recommendation: no, case studies cover it). (Decided: summary layout, section order in §6.2, "see all" as links, timeline on About.) | Home                       |
| D-14 | Tooling still open: end-to-end runner (proposed Playwright), dependency bot (Renovate or Dependabot), uptime monitor. (Decided: Vitest, husky + lint-staged + commitlint.)                                                                          | §13                        |

## 13. Engineering and quality

Tooling marked _proposed_ is a recommendation pending D-14; the rest is decided. Several practices come from the NewWebSite project (Angular), adapted: its gates are kept, its debt-management machinery (legacy allowlists, branch-scoped warning ratchets, a `release` branch) is not, because this repository starts clean and has one maintainer.

### 13.1 Versions and runtime

- Node: current LTS supported by Astro 6, pinned in `.nvmrc` and `package.json` `engines`; CI uses the same version.
- Astro: 6.x; dependencies installed from `package-lock.json` (`npm ci` in CI). Majors are upgraded deliberately, one at a time, with the full quality gate (§13.5) passing.
- WordPress: a currently supported major on a supported PHP version. Required plugins and their versions are listed in the repo (WPGraphQL, ACF, WPGraphQL for ACF, the i18n plugin from D-04) so the backend can be rebuilt.

### 13.2 Code quality

- Editor: EditorConfig; `.gitattributes` pins LF line endings and marks fonts, images and PDFs as binary; shared VS Code settings and recommended extensions.
- Formatting: Prettier with `prettier-plugin-astro` (in place); CI checks it.
- Linting: ESLint with `typescript-eslint` and `eslint-plugin-astro`, including its accessibility rules, plus general rules: `curly`, `eqeqeq` (allowing `== null`), `no-console`, complexity ≤ 20, nesting depth ≤ 4, file length ≤ 450 lines, ≤ 4 parameters, `no-else-return`, sorted imports, unused names allowed only with a `_` prefix, `import type` for type-only imports. **Zero warnings** (`--max-warnings 0`) from the start.
- Comments: a local ESLint rule limits a comment block to 5 lines of prose; longer rationale goes to `docs/` with a one-line pointer.
- CSS: Stylelint enforces the token rules in `.claude/rules/css.md` (no color literals or ad-hoc px outside `theme.css`, logical properties, no `[data-theme]` overrides); a token check fails on any `var(--…)` that `theme.css` doesn't declare (an undefined custom property fails silently in the browser).
- Markdown: markdownlint on every `.md` file, vendored skills and session notes excluded.
- Types: TypeScript strict (in place) and `astro check`.
- i18n: UI dictionaries share one key type, so a missing translation fails the type check; a small check rejects empty strings.
- Git hooks (husky): pre-commit runs lint-staged on staged files and stays fast; commit-msg runs commitlint (Conventional Commits; types `feat fix docs refactor perf test build ci chore`; header ≤ 100 characters; lowercase subject); pre-push runs lint, type check, build and unit tests.
- Branches: `main` plus short-lived branches named `<type>/t-<id>-<slug>`; no `release` branch, since every pull request gets a preview deploy.

### 13.3 Tests

- Unit (Vitest): data layer and mappers, i18n helpers (route and `hreflang` resolution), reading time, reserved-slug check (§6.4), feed generation. Shared helpers in `src/testing/`.
- End to end (_proposed:_ Playwright): navigation, language switch to the same page, theme toggle without a flash and with persistence, work and blog filters with and without JS, contact form states.
- Accessibility: automated axe checks on every page template, both themes, mobile and desktop widths. Automated checks don't replace a manual keyboard and screen-reader pass before launch.
- Lighthouse CI with budgets equal to §1.3, on every page template.
- Build output: HTML validation and internal link check.

### 13.4 Versioning and changelog

- Semver: `0.x` until launch, `1.0.0` at launch.
- `CHANGELOG.md` in Keep a Changelog format, with short entries per release.
- The README version badge matches `package.json`; CI checks it.

### 13.5 CI/CD

- GitHub Actions (repository on GitHub), **one** workflow for every pull request rather than near-duplicate per-environment files.
- Quality gate on every pull request: format check, ESLint, Stylelint and token check, markdownlint, local rule fixtures, type check, unit tests, build, end-to-end and accessibility tests, Lighthouse CI, link check, dependency audit, version badge. Merging requires it to pass; local hooks are a convenience, CI is the authority.
- Preview deploy per pull request; production deploy from `main` (host: D-06).
- Content rebuilds: WordPress triggers a deploy hook when content is published or updated; a scheduled rebuild as a safety net.
- Secrets live in the CI and host settings, never in the repository.

### 13.6 Documentation

- `README.md`: badges, table of contents, requirements, commands, quality checks, an index of `docs/`, deploy and content rebuild, working conventions.
- `docs/code-quality.md`, `docs/testing.md`, `docs/commits.md`, `docs/i18n.md` and `docs/manual-checks.md` (what automation can't reach: theme flash, screen readers, zoom). Each is written when its tool lands.
- Code documentation in English; comments explain why, not what.

### 13.7 Agent tooling

- `PRODUCT.md`: product brief (register, users, purpose, brand personality, anti-references, design principles), read by design and review agents.
- `.claude/settings.json`: hooks that block edits to `.env*` and `package-lock.json` and run the type check after code edits; an allowlist for read-only and gate commands.
- Project skills: `commit-actions` (gated, convention-compliant commits) and `task-audit` (mechanical gates first, then one read-only reviewer agent per lens — code, styles, a11y, docs, i18n, UX, tests, security, SEO, performance — one report), adapted from NewWebSite.
- Third-party skills and MCP servers are read before installing and installed at project scope so a clone gets them. Candidates to evaluate (T-04):
  - Astro: the official Astro Docs MCP server (`https://mcp.docs.astro.build/mcp`), current docs on demand.
  - WordPress (phase 5): the official `WordPress/agent-skills` — `wp-project-triage`, `wp-plugin-development` (custom post types and fields), `wp-wpcli-and-ops` (maintenance), `wp-performance`, `wp-playground` (a disposable local WordPress for developing and testing the GraphQL layer), `wp-phpstan` if custom PHP appears. Block and Interactivity API skills don't apply to a headless site.
  - Design and UX: `impeccable` (design vocabulary, used by NewWebSite), `transitions-dev` / `transitions-polish` (motion with reduced-motion fallbacks), and the installed `frontend-design`, `typeset`, `design:accessibility-review`, `design:design-critique`, `design:ux-copy` (the copy in three locales).
  - Process: the installed `grilling` (stress-test open decisions), `superpowers` (TDD, debugging, verification), `code-review`, `security-review`, `browser-automation` (check rendered pages).
  - Community registries (e.g. `astro-*` skills) only after reading the source: they are unvetted.

### 13.8 Security

- Security headers set on the host: CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Dependency audit in CI; automated dependency update pull requests (_proposed:_ Renovate or Dependabot).
- WordPress: public front end disabled or redirected (headless), admin behind strong auth with 2FA, only the needed GraphQL fields exposed, automatic minor updates, regular backups.

### 13.9 Maintenance

Recurring work, tracked as recurring tasks:

- Dependency update pull requests reviewed and merged (weekly or monthly).
- WordPress core and plugin updates, with a backup before each.
- Backups verified by an actual restore (quarterly).
- Uptime monitoring and alerts for the site and the WordPress API.
- Lighthouse and accessibility audit of the live site (quarterly).
- Broken external links in posts and personal entries.
- `README.md` kept current: setup, commands, environment variables (names only), deploy and content rebuild.

## 14. Changes from v6

- Design tool: Claude Design replaces Google Stitch → Figma; the "current phase: design" note is gone (§3, §11).
- New: personal section — one page with open-ended topics, own menu item (§6.5) — and blog classification by one required category (technical or Thoughts) plus open-ended tags, with Thoughts kept off the home page (§6.4).
- Folded in from `docs/design-state.md`: `light-dark()` theming, fluid type and spacing, sharp corners, navigation on every page, work chip set and layout, brand-surface and link tokens for contrast.
- FID replaced by INP; WCAG 2.2 AA instead of unspecified WCAG 2.
- Cookie policy only if non-essential cookies are introduced (v6 tied it to GA4, which is not used).
- Home page becomes a summary with "see all" links (§6.2); the tech timeline moves to About and runs to the current year instead of a fixed 2026.
- From the Claude Design review (October 2026): small-screen navigation as a second header row, no hamburger (§6); personal topic cards on the home page are text only (§6.2); keyboard shortcuts and the GitHub activity graph are out of v1 (§4.0).
- Content decisions (T-26): personal page name and entry shape (D-09), category labels (D-10), missing-translation rule (D-11, which replaces "every page exists in all three") and the personal-vs-blog boundary (D-12).
- Stack precision: Astro 6 static, `graphql-request`, standalone repository.
- Existing code declared a skeleton to replace (§0).
- Open decisions collected with IDs (§12); new ones: D-08 to D-14.
- New §13: engineering and quality — versions, linting, tests, versioning, CI/CD, documentation, agent tooling, security, maintenance; adapted from the NewWebSite project.
