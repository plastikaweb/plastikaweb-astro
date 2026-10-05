import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

import maxCommentLines from "./eslint-rules/max-comment-lines.js";

export default defineConfig([
  globalIgnores([
    "dist/",
    ".astro/",
    "wip/",
    "public/",
    ".remember/",
    ".agents/",
    ".claude/skills/",
  ]),
  { linterOptions: { reportUnusedDisableDirectives: "error" } },
  {
    files: ["**/*.{js,mjs,ts,astro}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      local: { rules: { "max-comment-lines": maxCommentLines } },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      complexity: ["error", 20],
      curly: "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "local/max-comment-lines": ["error", { max: 5 }],
      "max-depth": ["error", 4],
      "max-lines": ["error", 450],
      "max-params": ["error", 4],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-else-return": ["error", { allowElseIf: false }],
      "no-lonely-if": "error",
      "no-var": "error",
      "prefer-const": "error",
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
  // Astro components: template rules plus the strict accessibility set (WCAG 2.2 AA target).
  ...astro.configs["flat/recommended"],
  ...astro.configs["flat/jsx-a11y-strict"],
]);
