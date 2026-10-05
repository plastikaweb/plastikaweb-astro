// Keeps the README version badge in step with package.json (requirements §13.4).
// No flag: fails if they differ. `--write`: rewrites the badge (run by `npm version`).

import { readFileSync, writeFileSync } from "node:fs";

const README = "README.md";
const BADGE =
  /!\[Version [^\]]*\]\(https:\/\/img\.shields\.io\/badge\/version-[^)]*\)/;

/** Shields.io reads `-` and `_` as separators, so a literal one is doubled. */
export function badgeFor(/** @type {string} */ version) {
  const escaped = version.replaceAll("-", "--").replaceAll("_", "__");
  return `![Version ${version}](https://img.shields.io/badge/version-${escaped}-informational)`;
}

/** Returns the README with the badge for `version`; throws if it has no badge. */
export function syncBadge(
  /** @type {string} */ readme,
  /** @type {string} */ version,
) {
  if (!BADGE.test(readme)) {
    throw new Error(
      `${README} has no version badge (expected ${badgeFor(version)})`,
    );
  }
  return readme.replace(BADGE, badgeFor(version));
}

if (import.meta.main) {
  const { version } = JSON.parse(readFileSync("package.json", "utf8"));
  const readme = readFileSync(README, "utf8");
  const synced = syncBadge(readme, version);

  if (process.argv.includes("--write")) {
    writeFileSync(README, synced);
    console.warn(`✔ ${README} badge set to ${version}`);
  } else if (synced !== readme) {
    console.error(
      `✖ ${README} badge doesn't match package.json ${version}: run \`node scripts/version-badge.js --write\``,
    );
    process.exit(1);
  } else {
    console.warn(`✔ ${README} badge matches package.json (${version})`);
  }
}
