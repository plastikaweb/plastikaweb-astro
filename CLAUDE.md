# Plastikaweb v6 — portfolio site

Portfolio and lead generator for Carlos Matheu (Plastikaweb), senior freelance Angular/TypeScript developer based in Barcelona. Audience: CTOs, technical recruiters and high-end freelance clients, so the site itself has to prove front-end craft: semantics, accessibility, performance.

<!-- Maintainer notes (stripped before Claude reads this file):
     - Run /context in a session to confirm CLAUDE.md, CLAUDE.local.md and .claude/rules/css.md are loaded.
     - .agents/rules/style-guide.md holds similar rules for another agent. Claude Code doesn't read it; keep both in sync when rules change. -->

## Stack (decided — don't reopen)

- Astro 6, static output, standalone repository. No Nx, no monorepo.
- Styling: native modern CSS with custom properties. No Tailwind, no utility-class framework, no CSS-in-JS.
- Content: headless WordPress through WPGraphQL, backend at api.plastikaweb.com (planned client: `graphql-request`, not installed yet). Until that phase, pages read local mock data.
- i18n: Catalan (`ca`), Spanish (`es`) and English (`en`), with localized routes.
- Analytics: Plausible planned (cookieless, so no cookie banner).
- `.env` holds backend settings: never print, copy or commit it.

## Commands

- `npm install`: install dependencies.
- `npm run dev`: dev server at http://localhost:4321.
- `npm run build`: production build to `./dist/`.
- `npm run preview`: serve the build locally before deploying.
- `npm run format`: Prettier with `prettier-plugin-astro`; run it on the files you touch.
- `npm run astro -- check`: Astro and TypeScript diagnostics (the first run offers to install `@astrojs/check`).

## Where the context lives

- `src/styles/theme.css`: design tokens, Commit Mono `@font-face`, reset, base typography, utilities and print styles. Single source for every visual value; imported once in `src/layouts/BaseLayout.astro`.
- `docs/design-state.md`: decisions taken after the requirements, open design issues and the contrast audit. **It wins wherever it differs from the requirements.**
- `.claude/rules/css.md`: CSS rules, loaded automatically when working on `.css` or `.astro` files.
- Local-only material (requirements, ClickUp export, Stitch designs, font sources): see `CLAUDE.local.md`.

## Current state of the code

The scaffold predates requirements v6, so existing components are not the pattern to follow:

- Prototype components (`BaseLayout.astro`, `ThemeToggle.astro`, `pages/[lang]/[...uri].astro`, …) use tokens that no longer exist in theme.css — `--color-accent`, `--color-accent-soft`, `--color-text-main`, `--space-s`, `--space-l` — and use `--glass-border` as a border shorthand although it's now a color. Replace them with v6 tokens whenever you touch those files; grep for the rest.
- `[...uri].astro` generates placeholder pages for the old structure (blog, skills, contact, legal). v6 has work, blog, about with contact, privacy and cookies.
- `src/data/siteData.ts` is old mock data (skills with percentage levels, posts with Unsplash images). v6 mock data is case studies and posts.
- `/` redirects to `/en/` with a meta refresh, and `astro.config.mjs` is empty: no `site`, no `i18n` config yet.
- `src/layouts/Layout.astro`, `src/components/Welcome.astro`, `src/assets/astro.svg` and `background.svg` are leftovers from the Astro basics template; `BaseLayout.astro` is the real layout.

## Non-negotiables

- Semantic HTML: landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, no skipped heading levels, decorative text never marked up as a heading, real `<button>` for actions and `<a>` for navigation.
- Accessibility: WCAG 2 AA minimum and Lighthouse Accessibility 100. Visible focus, full keyboard support, `prefers-reduced-motion` respected, every form control with a real label.
- Performance: Lighthouse 100 in all four categories; LCP < 2.5 s, CLS < 0.1, INP < 200 ms (the requirements still list FID, which INP replaced in 2024).
- Fully responsive on every viewport.
- Minimal client JS: HTML and CSS first; small inline scripts or islands only where interaction needs them (theme toggle, language selector, work filters, contact form, tech timeline).
- Flexible text containers: Catalan and Spanish run up to ~30% longer than English. No fixed widths on buttons, nav items, cards or hero text.
- All UI copy exists in ca, es and en, including accessible names (skip link, toggle labels); never hardcode copy in a single language.

## Design system in brief

- Fonts: Space Grotesk (`--font-display`: hero H1, giant case-study numbers), Bricolage Grotesque (`--font-sans`: everything else), Commit Mono (`--font-mono`: tags, dates, code, form placeholders; self-hosted from `public/fonts/`). `font-display: swap`; preload Space Grotesk only.
- Colors: primary red `#FF0008`, secondary Broom yellow `#FFF42D`, tertiary Electric Violet `#6032F8`, Raven neutrals. One red only.
- Themes: `light-dark()` resolved through `color-scheme`. The inline script in BaseLayout's `<head>` sets `data-theme` from `localStorage` or `prefers-color-scheme` before first paint; `ThemeToggle` switches and persists it, and `body` crossfades via `--transition-theme`.
- Sharp corners throughout: no pill or capsule shapes.

## Pages (requirements §5)

- `/` home: hero, services (3 columns), selected work (2–3 cards), tech timeline (CSS Grid Gantt, 2014–2026), 2 latest posts, closing contact CTA.
- `/[lang]/work`: 2-column grid filterable by technology chips. `/[lang]/work/[slug]`: sections 01 Challenge, 02 Solution, 03 Stack, 04 Results; visuals are diagrams, not real screenshots.
- `/[lang]/blog`: by date, with category, reading time and excerpt. `/[lang]/blog/[slug]`: 65ch measure, syntax highlighting in Commit Mono, share links.
- `/[lang]/about`: bio, photo, CV download, GitHub and LinkedIn, contact form.
- Contact form: Name*, Company, Email*, Message\*, GDPR consent checkbox linking to the privacy policy, hidden honeypot field, inline success message without redirect.
- Also required: branded 404 with navigation, privacy policy, cookie policy (only if non-essential cookies are ever used), multilingual sitemap and robots.txt.
- SEO per page and locale: unique title, description and canonical; hreflang alternates; Open Graph and Twitter cards; JSON-LD (Person, WebSite, BlogPosting, BreadcrumbList).

## Open decisions — ask before choosing

- Route slugs: requirements §3 uses localized slugs (`/ca/projectes`, `/es/proyectos`, `/en/projects`), §5.1 uses `/[lang]/work`.
- Default locale, and what `/` serves (default-locale home vs. redirect by saved or browser language).
- Tech timeline placement: home or `/about`.
- WordPress i18n (WPML, Polylang or ACF custom) and WordPress hosting.
- Contact form delivery: Resend, EmailJS or Netlify Forms.
- Deploy target: Vercel, Netlify or Cloudflare Pages.
- Font hosting: the requirements and BaseLayout load Space Grotesk and Bricolage from the Google Fonts CDN, while `wip/DESIGN.md` lists Space Grotesk as a direct download. Self-hosting both like Commit Mono avoids a third-party request (visitor IP sent to Google, extra connection). Confirm before changing font loading.
- Token pairs that fail AA contrast (see `docs/design-state.md`): don't change theme.css on your own; propose options.

## How we work

- Backlog lives in ClickUp (the connector is available here): about 50 tasks in 10 dependency-ordered sections — Design Tokens → Layout/Nav → Homepage → Work/Case Studies → Blog → About/Contact → Legal → SEO → Validation → Backlog. Follow that order and respect dependencies.
- Phases (requirements §8): Astro front-end with mock data first, headless WordPress next, polish and launch last.
- Mock data: at least 3 complete case studies and 3–5 posts, shaped like the future WPGraphQL responses so moving to WordPress swaps the data source, not the components.
- Prototype HTML (Stitch exports) is a visual reference only. It uses utility classes: rebuild with tokens and semantic markup, never copy its classes.
- Reviews: report issues as P0/P1 and keep track of what's fixed vs. what remains.
