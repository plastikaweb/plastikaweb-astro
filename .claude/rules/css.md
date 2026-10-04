---
paths:
  - "**/*.css"
  - "**/*.astro"
---

# CSS rules

- Native CSS only: no Tailwind, no utility classes, no CSS-in-JS. When porting prototype HTML, translate each visual decision into tokens and meaningful class names.
- Every visual value comes from `src/styles/theme.css`: colors, fonts, sizes, spacing, radii, shadows, z-index, durations and easings. No hex, `rgb()` or ad-hoc px in components. If a token is missing, add it to the right section of theme.css rather than inlining a value.
- Components use semantic tokens (`--color-bg`, `--color-text-primary`, `--color-primary`, …). Raw scales (`--red-600`, `--raven-800`, …) are referenced only inside theme.css.
- Legacy prototype tokens (`--color-accent`, `--color-accent-soft`, `--color-text-main`, `--space-s`, `--space-l`) don't exist anymore: never use them, and replace them in any file you edit. `--glass-border` is a color, so write `border: 1px solid var(--glass-border)`.
- Theme-dependent values are declared once with `light-dark()` in theme.css. Never write `[data-theme='dark'] .component { … }` overrides: `data-theme` only sets `color-scheme`.
- `light-dark()` accepts colors only. For theme-aware shadows, borders or gradients, wrap just the color and compose it (see the shadow tokens).
- theme.css already styles `h1`–`h4`, links, paragraphs and lists; don't redeclare those basics in components.
- Type: fluid `--step-*` by default (`--step-0` body, `--step-2` H3, `--step-3` H2, `--step-4` H1, `--step-5` hero, `--step-6` giant case-study numbers). Fixed `--text-*` / `--text-mono-*` only for UI text that must not scale (chips, labels, tags, dates, code).
- Spacing: `--space-fluid-*` between sections, fixed `--space-*` inside components, `--section-py` / `--section-px` for section padding. Use logical properties (`padding-inline`, `margin-block`, `inset-inline-start`, …) rather than physical ones.
- Measure: `--max-width-content` (72rem) for page content, `--max-width-prose` (65ch) for long-form text.
- Sharp corners: no pill or capsule shapes.
- Shadows, borders and highlights must stay visible in both themes. Check light and dark for every component.
- Motion: duration and easing tokens only (they collapse to 0 under `prefers-reduced-motion`). Keep `transition: var(--transition-theme)` on `body`: the theme-toggle crossfade is a priority detail.
- Focus: `:focus-visible` comes from the focus-ring tokens. Never remove an outline without an equally visible replacement.
- No fixed widths or heights on elements that contain text (ca/es copy runs up to 30% longer than en).
- Brand red: filled primary buttons and brand blocks use `--color-surface-brand` (hover: `--color-surface-brand-hover`) with `--color-text-on-primary`. `--color-primary` (#FF0008) is only for accents, borders, icons and large display text, never behind normal-size text. Links use `--color-text-link`.
- Contrast: WCAG 2 AA in both themes (4.5:1 normal text; 3:1 large text and UI boundaries). `--color-text-muted` still fails (see `docs/design-state.md`); don't use it for essential normal-size text until that's resolved.
- Astro: theme.css is imported once in `BaseLayout.astro`; component styles go in scoped `<style>` blocks; global CSS stays in theme.css.
