import { describe, expect, it } from "vitest";

import { badgeFor, syncBadge } from "./version-badge.js";

describe("badgeFor", () => {
  it("puts the version in the alt text and the shields.io path", () => {
    expect(badgeFor("0.1.0")).toBe(
      "![Version 0.1.0](https://img.shields.io/badge/version-0.1.0-informational)",
    );
  });

  it("doubles dashes and underscores so shields.io keeps them", () => {
    expect(badgeFor("1.0.0-rc_1")).toContain("version-1.0.0--rc__1-");
  });
});

describe("syncBadge", () => {
  const readme = `# Title\n\n${badgeFor("0.0.1")}\n\nText.\n`;

  it("leaves a matching README unchanged", () => {
    expect(syncBadge(readme, "0.0.1")).toBe(readme);
  });

  it("replaces only the badge when the version moved", () => {
    expect(syncBadge(readme, "0.2.0")).toBe(
      `# Title\n\n${badgeFor("0.2.0")}\n\nText.\n`,
    );
  });

  it("throws when the README has no badge", () => {
    expect(() => syncBadge("# Title\n", "0.0.1")).toThrow(/no version badge/);
  });
});
