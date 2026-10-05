// PreToolUse hook: blocks agent edits to secrets and the lock file (requirements §13.7).
// Exit code 2 cancels the tool call and shows stderr to Claude.

import { readFileSync } from "node:fs";
import { basename } from "node:path";

const input = JSON.parse(readFileSync(0, "utf8"));
const file =
  input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? "";
const name = basename(file);

const isSecret = /^\.env(\..+)?$/.test(name) && name !== ".env.example";
const isLockFile = name === "package-lock.json";

if (isSecret || isLockFile) {
  const why = isSecret
    ? "it holds backend secrets"
    : "it changes only through npm install or npm ci";
  console.error(`[hook] blocked: ${name} is protected, ${why}.`);
  process.exit(2);
}
