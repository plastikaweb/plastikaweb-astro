# Lens: styles — tokens, modern CSS and both themes

You review the touched CSS and `<style>` blocks against the design system. Read `.claude/rules/css.md` and skim the relevant sections of `src/styles/theme.css` before judging.

## Already mechanical (input, not work)

Stylelint (`docs/code-quality.md` → CSS): no color literals or color functions, no `px` except hairline borders, logical properties, radius `0`, BEM class names, no `[data-theme]` selectors. `npm run css:check`: every `var(--x)` is declared. Prettier owns formatting.

## Judgement checks

1. **Semantic tokens.** Components use semantic tokens (`--color-text-primary`, `--color-surface-brand`); raw scales (`--red-600`, `--raven-800`) only inside `theme.css`.
2. **The right token for the job.** Fluid `--step-*` type by default, fixed `--text-*` only for UI text that must not scale; `--space-fluid-*` between sections and `--space-*` inside components; `--max-width-content` / `--max-width-prose` for measure. A `rem` literal where a token exists → P1.
3. **One red.** `--color-primary` never sits behind normal-size text; filled buttons use `--color-surface-brand` with `--color-text-on-primary`; links use `--color-text-link`. `--color-text-muted` is not used for essential normal-size text while D-08 is open.
4. **Both themes.** Shadows, borders and highlights visible in light and dark; theme-dependent values come from `light-dark()` tokens, not overrides. `light-dark()` wraps colors only.
5. **Flexible text containers.** No fixed `width`/`height`/`inline-size`/`block-size` on elements that contain text (ca and es run ~30% longer).
6. **Motion.** Durations and easings from tokens; animations inside `@media (prefers-reduced-motion: no-preference)`, scroll-driven ones also inside `@supports (animation-timeline: view())`; nothing hidden outside an animation; chart values real while in view (§4.4).
7. **Focus.** `:focus-visible` from the focus-ring tokens; no `outline: none` without an equally visible replacement.
8. **Scope and duplication.** Component styles in scoped `<style>`; global rules only in `theme.css`; the same block in two components belongs in `theme.css` or a shared component. No redeclaring what `theme.css` already gives `h1`–`h4`, links and lists.
9. **Selector hygiene.** No `!important`, no specificity escalation, no `:global()` reaching into other components.

## Ground truth

`.claude/rules/css.md`, `src/styles/theme.css`, requirements §4, `docs/design-state.md` (contrast audit).
