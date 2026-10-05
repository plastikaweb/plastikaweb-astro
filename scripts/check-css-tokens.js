// Fails on any var(--name) that neither theme.css nor the same file declares:
// an undefined custom property fails silently in the browser. See docs/code-quality.md.

import { globSync, readFileSync } from "node:fs";

const THEME = "src/styles/theme.css";
const SOURCES = ["src/**/*.css", "src/**/*.astro"];
const DECLARATION = /(?<![\w-])(--[a-zA-Z0-9-]+)\s*:/g;
const USAGE = /var\(\s*(--[a-zA-Z0-9-]+)/g;

/** @param {string} text */
function declaredIn(text) {
  return new Set([...text.matchAll(DECLARATION)].map((match) => match[1]));
}

const themeTokens = declaredIn(readFileSync(THEME, "utf8"));
const problems = [];

for (const file of globSync(SOURCES)) {
  const text = readFileSync(file, "utf8");
  const localTokens = declaredIn(text);
  text.split("\n").forEach((line, index) => {
    for (const [, name] of line.matchAll(USAGE)) {
      if (!themeTokens.has(name) && !localTokens.has(name)) {
        problems.push(
          `${file}:${index + 1}  ${name} is not declared in ${THEME}`,
        );
      }
    }
  });
}

if (problems.length > 0) {
  console.error(problems.join("\n"));
  console.error(
    `\n✖ ${problems.length} undefined custom ${problems.length === 1 ? "property" : "properties"}`,
  );
  process.exit(1);
}
console.warn(
  `✔ every var(--…) is declared (${themeTokens.size} tokens in ${THEME})`,
);
