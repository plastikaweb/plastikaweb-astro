// Token rules from .claude/rules/css.md; theme.css is the only place raw values live.

/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-html/astro"],
  plugins: ["stylelint-use-logical"],
  ignoreFiles: [
    "dist/**",
    "coverage/**",
    "playwright-report/**",
    ".astro/**",
    "wip/**",
    "node_modules/**",
  ],
  rules: {
    // BEM-style class names and Utopia-style step tokens (`--step--1`).
    "selector-class-pattern": [
      "^[a-z][a-z0-9]*(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$",
      {
        message: "Use kebab-case BEM class names (.block__element--modifier).",
      },
    ],
    // Astro scoped styles use :global() to reach outside the component.
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
    "custom-property-pattern": "^[a-z][a-z0-9]*(-{1,2}[a-z0-9]+)*$",
    "csstools/use-logical": [
      "always",
      {
        except: [
          "width",
          "height",
          "min-width",
          "min-height",
          "max-width",
          "max-height",
        ],
      },
    ],
    "color-no-hex": true,
    "color-named": "never",
    "function-disallowed-list": [
      "rgb",
      "rgba",
      "hsl",
      "hsla",
      "hwb",
      "lab",
      "lch",
      "oklab",
      "oklch",
      "color",
      "color-mix",
    ],
    "unit-disallowed-list": [
      ["px"],
      {
        ignoreProperties: {
          // Hairline widths only; radii and every other length use tokens or rem.
          px: [
            "/^border(-(block|inline|top|right|bottom|left)(-(start|end))?)?(-width)?$/",
            "/^outline(-width)?$/",
          ],
        },
      },
    ],
    // Sharp corners throughout: only 0 is allowed outside theme.css.
    "declaration-property-value-allowed-list": [
      { "/radius$/": ["0"] },
      { message: "Sharp corners: border-radius must be 0." },
    ],
    "selector-disallowed-list": [
      ["/\\[data-theme/"],
      {
        message:
          "Theme values belong in theme.css with light-dark(); data-theme only sets color-scheme.",
      },
    ],
  },
  overrides: [
    {
      files: ["src/styles/theme.css"],
      rules: {
        "color-no-hex": null,
        "color-named": null,
        "function-disallowed-list": null,
        "unit-disallowed-list": null,
        "selector-disallowed-list": null,
        "declaration-property-value-allowed-list": null,
        // theme.css groups tokens in several :root blocks, one per section.
        "no-duplicate-selectors": null,
      },
    },
  ],
};
