// Fails on any var(--name) that neither theme.css, the Astro font config nor the same
// file declares: an undefined custom property fails silently in the browser.
// See docs/code-quality.md.

import { globSync, readFileSync } from "node:fs";

const THEME = "src/styles/theme.css";
const ASTRO_CONFIG = "astro.config.mjs";
const SOURCES = ["src/**/*.css", "src/**/*.astro"];
const DECLARATION = /(?<![\w-])(--[a-zA-Z0-9-]+)\s*:/g;
const USAGE = /var\(\s*(--[a-zA-Z0-9-]+)/g;
const FONT_VARIABLE = /cssVariable:\s*["'](--[a-zA-Z0-9-]+)["']/g;
const JS_COMMENT = /\/\*[\s\S]*?\*\/|(^|\s)\/\/.*$/gm;

/** Custom properties declared in a CSS or Astro source. */
export function declaredIn(/** @type {string} */ text) {
  return new Set([...text.matchAll(DECLARATION)].map((match) => match[1]));
}

/** Custom properties the Astro Fonts API defines: every `cssVariable` in the config, comments left out. */
export function fontVariablesIn(/** @type {string} */ configText) {
  const code = configText.replace(JS_COMMENT, "$1");
  return new Set([...code.matchAll(FONT_VARIABLE)].map((match) => match[1]));
}

/** One `file:line` problem per var(--name) that neither `known` nor the file declares. */
export function undeclaredUsages(
  /** @type {string} */ file,
  /** @type {string} */ text,
  /** @type {Set<string>} */ known,
) {
  const local = declaredIn(text);
  /** @type {string[]} */
  const problems = [];
  text.split("\n").forEach((line, index) => {
    for (const [, name] of line.matchAll(USAGE)) {
      if (!known.has(name) && !local.has(name)) {
        problems.push(
          `${file}:${index + 1}  ${name} is not declared in ${THEME} or the ${ASTRO_CONFIG} fonts`,
        );
      }
    }
  });
  return problems;
}

if (import.meta.main) {
  const themeTokens = declaredIn(readFileSync(THEME, "utf8"));
  const fontVariables = fontVariablesIn(readFileSync(ASTRO_CONFIG, "utf8"));
  const known = new Set([...themeTokens, ...fontVariables]);
  const problems = globSync(SOURCES).flatMap((file) =>
    undeclaredUsages(file, readFileSync(file, "utf8"), known),
  );

  if (problems.length > 0) {
    console.error(problems.join("\n"));
    console.error(
      `\n✖ ${problems.length} undefined custom ${problems.length === 1 ? "property" : "properties"}`,
    );
    process.exit(1);
  }
  console.warn(
    `✔ every var(--…) is declared (${themeTokens.size} tokens in ${THEME}, ${fontVariables.size} font variables in ${ASTRO_CONFIG})`,
  );
}
