import { describe, expect, test } from "vitest";

import {
  declaredIn,
  fontVariablesIn,
  undeclaredUsages,
} from "./check-css-tokens.js";

describe("declaredIn", () => {
  test("collects custom property declarations", () => {
    const css = ":root {\n  --color-bg: #fff;\n  --step--1: 1rem;\n}";
    expect(declaredIn(css)).toEqual(new Set(["--color-bg", "--step--1"]));
  });

  test("ignores usages inside var()", () => {
    expect(declaredIn("color: var(--color-bg);")).toEqual(new Set());
  });
});

describe("fontVariablesIn", () => {
  test("reads every cssVariable from the Astro font config", () => {
    const config = `fonts: [
      { name: "Space Grotesk", cssVariable: "--font-space-grotesk" },
      { name: "Commit Mono", cssVariable: '--font-commit-mono' },
    ]`;
    expect(fontVariablesIn(config)).toEqual(
      new Set(["--font-space-grotesk", "--font-commit-mono"]),
    );
  });

  test("ignores cssVariable lines that are commented out", () => {
    const config = `// https://astro.build/config
    fonts: [
      { name: "Inter", cssVariable: "--font-inter" },
      // { name: "Old", cssVariable: "--font-old" },
      /* { name: "Older", cssVariable: "--font-older" }, */
    ]`;
    expect(fontVariablesIn(config)).toEqual(new Set(["--font-inter"]));
  });
});

describe("undeclaredUsages", () => {
  const known = new Set(["--color-bg", "--font-bricolage"]);

  test("accepts theme tokens, font variables and local declarations", () => {
    const text = [
      ".card {",
      "  --local: 1rem;",
      "  background: var(--color-bg);",
      "  font-family: var(--font-bricolage);",
      "  padding: var(--local);",
      "}",
    ].join("\n");
    expect(undeclaredUsages("card.css", text, known)).toEqual([]);
  });

  test("reports each undeclared usage with its file and line", () => {
    const text = "a {\n  color: var(--color-text-muted);\n}";
    expect(undeclaredUsages("a.astro", text, known)).toEqual([
      "a.astro:2  --color-text-muted is not declared in src/styles/theme.css or the astro.config.mjs fonts",
    ]);
  });
});
