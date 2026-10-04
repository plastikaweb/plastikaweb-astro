# Plastikaweb — portfolio site

Portfolio and lead generator for Carlos Matheu (Plastikaweb), senior freelance Angular/TypeScript developer based in Barcelona. Audience: CTOs, technical recruiters and high-end freelance clients, so the site itself has to prove front-end craft: semantics, accessibility, performance.

<!-- Maintainer notes (stripped before Claude reads this file):
     - Run /context in a session to confirm CLAUDE.md, CLAUDE.local.md and .claude/rules/css.md are loaded.
     - .agents/rules/style-guide.md holds similar rules for another agent. Claude Code doesn't read it; keep both in sync when rules change. -->

## Where the context lives

- `docs/requirements.md`: **the requirements — single source.** Read the relevant section before building a page or feature. Open decisions are listed there as `D-xx` (§12): ask before choosing any of them.
- `TASKS.md`: the backlog, in dependency order; each task cites its requirements section. Work in that order.
- `docs/design/claude-design-prompt.md`: the brief used to design the interface in Claude Design (task T-02), with `PRODUCT.md` (T-01) as context.
- `src/styles/theme.css`: design tokens, Commit Mono `@font-face`, reset, base typography, utilities and print styles. Single source for every visual value.
- `docs/design-state.md`: design review log and contrast audit. Its decisions up to October 2026 are folded into the requirements; new decisions go in the requirements.
- `.claude/rules/css.md`: CSS rules, loaded automatically when working on `.css` or `.astro` files.
- Local-only material (v6 PDF, old ClickUp export, Stitch exports, font sources): see `CLAUDE.local.md`.

## Stack (decided — don't reopen)

- Astro 6, static output, standalone repository. No Nx, no monorepo.
- Styling: native modern CSS with custom properties. No Tailwind, no utility-class framework, no CSS-in-JS.
- Content: headless WordPress through WPGraphQL, backend at api.plastikaweb.com (planned client: `graphql-request`, not installed yet). Until that phase, pages read local mock data shaped like the future WPGraphQL responses.
- i18n: Catalan (`ca`), Spanish (`es`) and English (`en`).
- Analytics: Plausible (cookieless, so no cookie banner).
- Design: Claude Design. The Stitch exports are historical references only.
- `.env` holds backend settings: never print, copy or commit it.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: dev server at http://localhost:4321.
- `npm run build`: production build to `./dist/`.
- `npm run preview`: serve the build locally before deploying.
- `npm run format`: Prettier with `prettier-plugin-astro`; run it on the files you touch.
- `npm run astro -- check`: Astro and TypeScript diagnostics (the first run offers to install `@astrojs/check`).

Lint, test and CI commands arrive with the foundation tasks (T-03 – T-24).

## Current state of the code

Everything in `src/` except `src/styles/theme.css` is a borrowed skeleton used to get a deployable app. It doesn't implement the requirements and isn't a pattern to follow: replace it, don't extend it (TASKS.md T-06, T-33, T-46).

- The skeleton uses tokens that no longer exist in theme.css (`--color-accent`, `--color-accent-soft`, `--color-text-main`, `--space-s`, `--space-l`) and uses `--glass-border` as a border shorthand although it's now a color.
- `astro.config.mjs` is empty (no `site`, no i18n) and `/` redirects to `/en/` with a meta refresh.
- Kept and written for the current requirements: `src/styles/theme.css`, `public/fonts/` (Commit Mono), `docs/`, `.claude/rules/css.md`.

## Non-negotiables

Full list in requirements §2; in brief:

- Semantic HTML: landmarks, one `h1` per page, no skipped heading levels, decorative text never marked up as a heading, `<button>` for actions and `<a>` for navigation.
- WCAG 2.2 AA and Lighthouse 100 in all four categories; LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- Minimal client JS: HTML and CSS first; scripts only where interaction needs them.
- Catalan and Spanish run up to ~30% longer than English: no fixed widths on anything containing text.
- All UI copy, including accessible names, exists in ca, es and en; never hardcode copy in one language.

## Design system in brief

Details in requirements §4 and theme.css.

- Fonts: Space Grotesk (hero H1 and giant case-study numbers only), Bricolage Grotesque (everything else), Commit Mono (tags, dates, code, form placeholders; self-hosted).
- Colors: primary red `#FF0008` for accents and large text only; filled buttons use the brand surface (red-700); secondary Broom yellow `#FFF42D`; tertiary Electric Violet `#6032F8`; Raven neutrals. One red only.
- Themes: `light-dark()` resolved through `color-scheme`; an inline `<head>` script sets `data-theme` before first paint; the body crossfades on toggle.
- Sharp corners throughout: no pill or capsule shapes.

## How we work

- `TASKS.md` is the source of truth for the backlog; ClickUp mirrors it and is updated from it (task B-3). When a task is done, update its status in `TASKS.md`.
- New decisions go into `docs/requirements.md` (and close the matching `D-xx`); keep `TASKS.md` in step.
- Prototype HTML (Stitch exports, Claude Design output) is a visual reference: rebuild with tokens and semantic markup, never copy utility classes.
- Reviews: report issues as P0/P1 and keep track of what's fixed vs. what remains.
