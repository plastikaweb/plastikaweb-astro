// PostToolUse hook: runs `astro check` after an agent edits a .ts or .astro file.
// On errors it exits 2 so Claude sees them; the edit itself is already done.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { stripVTControlCharacters } from "node:util";

const input = JSON.parse(readFileSync(0, "utf8"));
const file = input.tool_input?.file_path ?? "";
const skipped = /\/(node_modules|dist|\.astro)\//.test(file);

if (!/\.(ts|astro)$/.test(file) || skipped) {
  process.exit(0);
}

const run = spawnSync("npx", ["astro", "check"], {
  cwd: process.env.CLAUDE_PROJECT_DIR ?? process.cwd(),
  encoding: "utf8",
});

if (run.status !== 0) {
  // Errors (stdout) go last so the 40-line cut keeps them and their summary, not stderr noise.
  // The TypeScript formatter colours its output even with NO_COLOR, so strip the escape codes.
  const output = stripVTControlCharacters(`${run.stderr}${run.stdout}`)
    .trim()
    .split("\n")
    .slice(-40)
    .join("\n");
  console.error(`[hook] astro check failed after editing ${file}:\n${output}`);
  process.exit(2);
}
