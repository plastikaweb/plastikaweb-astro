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

## Disabling a rule

Disable a rule for one line, never for a whole file, and always give the reason after `--`:

```ts
// eslint-disable-next-line max-params -- mirrors the WPGraphQL resolver signature
```

A disable comment that no longer suppresses anything fails the run (`reportUnusedDisableDirectives: "error"`). If a rule needs disabling more than once for the same reason, change the config in a reviewed commit instead.
