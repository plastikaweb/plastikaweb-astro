# Design state after requirements v6

What was decided after the v6 requirements (April 2026), where the design review stands, and a contrast audit of the tokens in `src/styles/theme.css`. **Wherever this file and the requirements differ, this file wins.**

## Decisions that supersede the requirements

- **Theming** (req. §2.2, §2.5): `light-dark()` + `color-scheme` instead of redefining variables under `[data-theme='dark']`. `[data-theme]` only forces the scheme; the inline head script and localStorage persistence stay.
- **Type scale** (req. §2.3): a Utopia-style fluid scale, `--step--2` to `--step-6` (16 → 20 px base between 320 and 1440 px viewports, ~1.25 ratio), is the default. Fixed `--text-*` tokens remain for text that must not scale.
- **Spacing:** fluid tiers `--space-fluid-s` to `--space-fluid-xl` for section-level spacing.
- **Semantic color mapping** (req. §2.2): theme.css refines it — e.g. tertiary, warning and error move one step lighter in dark mode. theme.css is the reference.
- **Hero CTAs** (req. §5.2 lists two): there are three on purpose. They're scroll anchors to the three homepage sections, not competing conversion CTAs; the hierarchy is solid / ghost / text link. Don't reduce the count.
- **Navigation:** present on every page. A nav-free archive layout doesn't suit a multilingual site of 5+ pages where visitors land directly on inner pages.
- **Work listing:** Variant 1 structure with Variant 3's larger expanded-row image.
- **Work filter chips:** the real stack — Angular, TypeScript, RxJS, NgRx, Performance. No unrelated technologies.
- **Shape:** sharp corners throughout, no pill or capsule elements.
- **Motion:** `--ease-out-expo` and `--ease-smooth`; the theme toggle crossfades through `--transition-theme` on `body`. Priority detail, keep it.
- **Glass surfaces and gradient:** theme-aware glass tokens with `.glass` / `.glass--strong`; `.text-gradient` runs red → violet.
- **Token discipline:** early iterations fragmented (several fonts, three different reds). One red, locked fonts and colors, no ad-hoc values.
- **Contact form:** includes the Company field and the GDPR checkbox; labels in plain, human language.

## Token fixes (October 2026)

- `--broom-800` corrected to `#81640a`, as in the Palette 7 source.
- Contrast fixes: links (`--color-text-link` red-700 / red-400, hover red-800 / red-300), brand surface (`--color-surface-brand` red-700 in both themes, new `--color-surface-brand-hover` red-800) and warning text (corn-800 in light). `--color-primary` is reserved for accents, borders, icons and large display text.
- Shadows rebuilt: `light-dark()` only accepts colors, so wrapping whole shadow values made `box-shadow` compute to `none` in both themes. Each level now has a theme-aware `--shadow-color-*` and shared geometry.

## Open issues from the v3 review

- Hero: the "ANGULAR" highlight must use the secondary yellow `#FFF42D`; v3 reverted it to translucent red.
- Primary CTA `box-shadow` must work in both themes (a white shadow disappears on light backgrounds).
- Footer: bring back the red top border and the `//` separators from v2.
- Social icons: the capsule container is pill-shaped; make it sharp.
- "Over a decade of engineering excellence" is decorative: `<p>`, not `<h3>`.
- Work page: the status dot colors swap meaning between modes; placeholder tech tags don't match the Angular positioning.

## Contrast audit of theme.css (WCAG 2 AA)

Ratios against `--color-bg` / `--color-surface` — light: raven-50 / white; dark: raven-950 / raven-800. Normal text needs 4.5:1; large text (≥ 24 px, or ≥ 18.66 px bold) and UI boundaries need 3:1.

| Token                                                                | Light       | Dark        | Status                                               |
| -------------------------------------------------------------------- | ----------- | ----------- | ---------------------------------------------------- |
| `--color-text-primary`                                               | 19.2 / 20.1 | 19.2 / 14.0 | ✅                                                   |
| `--color-text-secondary`                                             | 7.2 / 7.5   | 8.0 / 5.8   | ✅                                                   |
| `--color-text-muted` (raven-500)                                     | 4.0 / 4.2   | 4.8 / 3.5   | ❌ normal text                                       |
| `--color-text-link` (red-700 / red-400)                              | 5.2 / 5.4   | 6.5 / 4.7   | ✅                                                   |
| `--color-text-link-hover` (red-800 / red-300)                        | 7.0 / 7.3   | 9.5 / 6.9   | ✅                                                   |
| `--color-text-code` (on `--color-bg-secondary` / surface)            | 9.3 / 10.3  | 12.0 / 10.0 | ✅                                                   |
| `--color-warning-text` (corn-800 / corn-300)                         | 6.2 / 6.5   | 16.1 / 11.7 | ✅                                                   |
| `--color-success-text`                                               | 4.9 / 5.1   | 14.5 / 10.5 | ✅                                                   |
| `--color-error-text`                                                 | 6.6 / 6.9   | 11.0 / 8.0  | ✅                                                   |
| `--color-text-on-primary` on `--color-surface-brand` (red-700)       | 5.4         | 5.4         | ✅                                                   |
| `--color-text-on-primary` on `--color-surface-brand-hover` (red-800) | 7.3         | 7.3         | ✅                                                   |
| White text on `--color-primary` (red-600)                            | 4.0         | 4.0         | ❌ normal text, ✅ large — don't use for normal text |
| `--color-text-on-secondary` (raven-950 on broom-400)                 | 17.4        | 17.4        | ✅                                                   |
| `--color-focus-ring` (needs 3:1)                                     | 6.1 / 6.4   | 4.2 / 3.04  | ✅                                                   |

Pending — design decision open, theme.css is unchanged for this one:

- Muted text: no Raven step between 500 and 600, so in light mode it either becomes raven-600 (7.2, same as secondary) or is limited to large or non-essential text. On dark surfaces raven-400 gives 5.8. Form placeholders use this token (req. §2.3).
