# Code quality

How the code is checked before it reaches `main` (requirements §13.2). Each tool adds its section when it lands; this file starts with formatting and ESLint.

## Formatting

- Prettier with `prettier-plugin-astro`, config in `.prettierrc`. `npm run format` writes, `npm run format:check` fails on any unformatted file.
- `.prettierignore` skips agent and session state (`.remember/`, `.agents/`, `.claude/skills/`) and the font kit in `public/fonts/`; Prettier also skips everything in `.gitignore`.
- `.editorconfig` and `.gitattributes` keep UTF-8, two-space indentation and LF line endings; fonts, images and PDFs are binary.

## ESLint

`npm run lint` runs `eslint . --max-warnings 0`: a warning fails the run like an error. Config: `eslint.config.js` (flat config, ESLint 10).

| Source                                        | What it covers                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------- |
| `@eslint/js` recommended                      | Likely bugs in JavaScript.                                                      |
| `typescript-eslint` recommended and stylistic | TypeScript misuse and consistent TypeScript idioms (no type-checked rules yet). |
| `eslint-plugin-astro` recommended             | Astro component and template mistakes.                                          |
| `eslint-plugin-astro` jsx-a11y strict         | Accessibility in Astro templates, through `eslint-plugin-jsx-a11y-x`.           |
| `eslint-plugin-simple-import-sort`            | Sorted imports and exports (autofixable).                                       |

Project rules on top:

| Rule                                             | Setting                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| `curly`                                          | Always braces.                                   |
| `eqeqeq`                                         | Strict equality; `== null` allowed.              |
| `no-console`                                     | Only `console.warn` and `console.error`.         |
| `complexity`                                     | At most 20 per function.                         |
| `max-depth`                                      | At most 4 nested blocks.                         |
| `max-lines`                                      | At most 450 lines per file.                      |
| `max-params`                                     | At most 4 parameters.                            |
| `no-else-return`, `no-lonely-if`                 | Flat control flow.                               |
| `@typescript-eslint/no-unused-vars`              | Unused names only with a `_` prefix.             |
| `@typescript-eslint/consistent-type-imports`     | `import type` for type-only imports.             |
| `@typescript-eslint/no-import-type-side-effects` | No `import { type X }` that keeps a side effect. |

Why `eslint-plugin-jsx-a11y-x`: the original `eslint-plugin-jsx-a11y` hasn't been released since 2024 and doesn't support ESLint 10; `eslint-plugin-astro` loads either, and the `-x` fork (es-tooling) supports ESLint 10. TypeScript stays on 6.x because `typescript-eslint` doesn't support TypeScript 7 yet.

## Local rule: short comments

`local/max-comment-lines` (`eslint-rules/max-comment-lines.js`, ported from NewWebSite) allows at most 5 lines of prose per comment block. A block is one block comment or a run of line comments on consecutive lines. Delimiters, bare `*` gutters, blank lines and JSDoc tag lines (`@param`, `@returns`) don't count; directive comments (`eslint-*`, `@ts-*`, `prettier-ignore`, coverage pragmas) are skipped.

A comment says why, briefly. When the why needs more than five lines, write it in `docs/` and leave a one-line pointer in the code.

The rule's fixtures use ESLint's `RuleTester` under `node:test`: `npm run test:eslint-rules`.

## CSS: Stylelint and the token check

The rules in `.claude/rules/css.md`, enforced. `src/styles/theme.css` is the only file allowed raw values.

`npm run lint:css` runs Stylelint (`stylelint.config.js`) on `src/**/*.{css,astro}` with zero warnings allowed. It extends `stylelint-config-standard` and reads Astro `<style>` blocks through `stylelint-config-html/astro`. On top:

| Rule                                      | Rejects                                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `color-no-hex`, `color-named`             | Color literals; use a semantic token.                                                                 |
| `function-disallowed-list`                | `rgb()`, `hsl()`, `oklch()`, `color-mix()` and the rest of the color functions.                       |
| `unit-disallowed-list`                    | `px`, except hairline border and outline widths; use tokens or `rem`.                                 |
| `csstools/use-logical`                    | Physical properties where a logical one exists (`margin-top` → `margin-block-start`); sizes excepted. |
| `selector-disallowed-list`                | `[data-theme]` selectors: theme values are declared once with `light-dark()`.                         |
| `declaration-property-value-allowed-list` | Any `border-radius` other than `0` (sharp corners).                                                   |
| `selector-class-pattern`                  | Class names that aren't kebab-case BEM (`.block__element--modifier`).                                 |

Astro's `:global()` is allowed. In `theme.css` the color, unit, radius and `[data-theme]` rules are off, and repeated `:root` blocks are allowed (one per token section).

`npm run css:check` (`scripts/check-css-tokens.js`) fails on any `var(--name)` in `src/` that neither `theme.css` nor the same file declares. A misspelt or removed token doesn't break the build: the browser just drops the declaration, so this check is the only thing that catches it.

## Markdown

`npm run lint:md` runs markdownlint (`markdownlint-cli2`) on every Markdown file; `npm run lint:md:fix` fixes what it can. Rules are in `.markdownlint.jsonc` (also read by the VS Code extension): the defaults, minus line length (Prettier owns layout), inline HTML and a required first-line H1; repeated headings are allowed in different sections; code blocks are fenced. `.markdownlint-cli2.jsonc` skips everything git ignores plus vendored skills and session notes (`.claude/skills/`, `.remember/`, `.agents/`), even when lint-staged passes those paths explicitly.

## Disabling a rule

Disable a rule for one line, never for a whole file, and always give the reason after `--` (in CSS: `/* stylelint-disable-next-line rule -- reason */`):

```ts
// eslint-disable-next-line max-params -- mirrors the WPGraphQL resolver signature
```

A disable comment that no longer suppresses anything fails the run (`reportUnusedDisableDirectives: "error"`). If a rule needs disabling more than once for the same reason, change the config in a reviewed commit instead.
