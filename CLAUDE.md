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

- Astro 7 on Node 24 LTS (`.nvmrc`), static output, standalone repository. No Nx, no monorepo.
- Styling: native modern CSS with custom properties. No Tailwind, no utility-class framework, no CSS-in-JS.
- Content: headless WordPress through WPGraphQL, backend at api.plastikaweb.com (planned client: `graphql-request`, not installed yet). Until that phase, pages read local mock data shaped like the future WPGraphQL responses.
- i18n: Catalan (`ca`), Spanish (`es`) and English (`en`).
- Analytics: Plausible (cookieless, so no cookie banner).
- Design: Claude Design. The Stitch exports are historical references only.
- `.env` holds backend settings: never print, copy or commit it.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: dev server at `http://localhost:4321`.
- `npm run build`: production build to `./dist/`.
- `npm run preview`: serve the build locally before deploying.
- `npm run format`: Prettier with `prettier-plugin-astro`; run it on the files you touch.
- `npm run check`: Astro and TypeScript diagnostics (`astro check`).
- `npm test`: unit tests (Vitest) with coverage; see `docs/testing.md`.
- `npm run test:e2e`: builds, serves the build and runs the Playwright and axe tests in `e2e/`. It opens a local port, so inside a Claude Code sandbox it needs `sandbox.network.allowLocalBinding`.
- `npm run lint`, `npm run lint:css`, `npm run css:check`, `npm run lint:md`, `npm run format:check`: the quality checks (see `docs/code-quality.md`).
- `npm run version:check`: the README version badge matches `package.json`; releases and the changelog are in `docs/commits.md`.

CI arrives with the remaining foundation tasks (T-16 – T-24).

## Current state of the code

Everything in `src/` except `src/styles/theme.css` is a borrowed skeleton used to get a deployable app. It doesn't implement the requirements and isn't a pattern to follow: replace it, don't extend it (TASKS.md T-06, T-33, T-46).

- Since T-10 the skeleton passes the CSS checks (no legacy tokens, no raw colors or px, sharp corners), but its markup, copy and structure still don't follow the requirements.
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

## Recommended skills and MCP servers

Vetted in T-04 (requirements §13.7). Only the MCP server is installed in the project; the skills are user-level and optional: a clone works without them.

- `astro-docs` MCP server (`.mcp.json`, official, read-only search): use it before writing Astro config, routing, i18n, content or image code, instead of relying on memory of older Astro versions.
- `superpowers`: brainstorming before a feature, TDD for the data layer and helpers, systematic debugging, verification before calling a task done.
- `code-review` and the built-in `/security-review`: before opening a pull request.
- `frontend-design` and `typeset`: when building a page or component from the Claude Design handoff; tokens from `theme.css` still win over their suggestions.
- `design` plugin (`design:accessibility-review`, `design:design-critique`, `design:ux-copy`): accessibility pass on a finished page, critique against the approved design, UI copy in ca, es and en.
- `grilling`: stress-test an open `D-xx` decision before recording it.

Not installed, on purpose: `impeccable` (downloads and runs a native binary, installs hooks that run without approval, writes its own `PRODUCT.md`); `transitions-dev` / `transitions-polish` (reference only: competing token names, and their licence forbids redistributing them, so never commit a copy). WordPress skills (`WordPress/agent-skills`: `wp-plugin-development`, `wp-wpcli-and-ops`, pinned to a commit) belong to the WordPress project in phase 5 (T-48).

## Project skills

In `.claude/` (T-18), adapted from NewWebSite; a clone gets them.

- `commit-actions`: use it for every commit, merge or release. Refuses `main`, runs `lint-staged`, drafts the Conventional Commit with the task id, adds the `CHANGELOG.md` line when the change is notable, bumps the version only in a release (`npm version`), confirms before committing and never pushes on its own.
- `task-audit`: run it before merging a feature-sized branch (about 10 or more touched files, not docs-only). Mechanical gates first, then one read-only `audit-lens` agent (`.claude/agents/audit-lens.md`) per lens whose files changed: code, styles, a11y, docs, i18n, UX, tests, security, SEO, performance. It ends with one deduplicated P0/P1/P2 report and fixes nothing before the user triages it.

## Agent guardrails

`.claude/settings.json` (T-16) applies to every Claude Code session in this repo:

- `.claude/hooks/protect-files.mjs` (PreToolUse): blocks Edit/Write on `.env*` (except `.env.example`) and `package-lock.json`. The lock file changes only through `npm install` or `npm ci`.
- `.claude/hooks/typecheck.mjs` (PostToolUse): runs `astro check` after an edit to a `.ts` or `.astro` file (~6 s) and reports the errors back to the agent.
- An allow list for the gate commands and read-only git and npm commands. Anything that writes, installs, commits or pushes still asks.
- `Read` is denied on `.env` and `.env.*`.

The hooks guard the Edit and Write tools only: a shell command can still write those files, so the rule in Stack (never print, copy or commit `.env`) still applies. Changes to `.claude/settings.json` or `.claude/hooks/` are made by a person, not by the agent.

## How we work

- `TASKS.md` is the source of truth for the backlog; ClickUp mirrors it and is updated from it (task B-3). When a task is done, update its status in `TASKS.md`.
- New decisions go into `docs/requirements.md` (and close the matching `D-xx`); keep `TASKS.md` in step.
- Prototype HTML (Stitch exports, Claude Design output) is a visual reference: rebuild with tokens and semantic markup, never copy utility classes.
- Reviews: report issues as P0/P1 and keep track of what's fixed vs. what remains.
