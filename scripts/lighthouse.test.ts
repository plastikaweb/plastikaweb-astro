import { describe, expect, it } from "vitest";

import { checkBudgets, pickTemplatePages } from "./lighthouse.js";

const built = [
  "dist/index.html",
  "dist/ca/index.html",
  "dist/es/index.html",
  "dist/en/index.html",
  "dist/ca/blog/index.html",
  "dist/es/blog/index.html",
  "dist/en/blog/index.html",
  "dist/ca/blog/b-post/index.html",
  "dist/ca/blog/a-post/index.html",
  "dist/en/blog/a-post/index.html",
  "dist/en/contact/index.html",
];

describe("pickTemplatePages", () => {
  const picked = pickTemplatePages(built);

  it("picks one page per template and skips pages outside a locale", () => {
    expect(picked.map((page) => page.template)).toEqual([
      "blog",
      "blog/*",
      "contact",
      "home",
    ]);
  });

  it("rotates the locale across templates (ca, es, en, ca…)", () => {
    expect(picked[0].path).toBe("/ca/blog/");
    expect(picked[2].path).toBe("/en/contact/");
    expect(picked[3].path).toBe("/ca/");
  });

  it("falls back to the first page when the rotated locale lacks the template", () => {
    // "blog/*" wants es, which has no posts here.
    expect(picked[1].path).toBe("/ca/blog/a-post/");
  });
});

describe("checkBudgets", () => {
  const perfect = {
    performance: 1,
    accessibility: 1,
    "best-practices": 1,
    seo: 1,
    lcpMs: 1200,
    cls: 0,
  };

  it("passes a perfect run", () => {
    expect(checkBudgets(perfect)).toEqual({ failures: [], misses: [] });
  });

  it("fails on accessibility, best practices or SEO below 100", () => {
    expect(checkBudgets({ ...perfect, accessibility: 0.96 }).failures).toEqual([
      "accessibility 96",
    ]);
  });

  it("only reports performance and Core Web Vitals misses", () => {
    const result = checkBudgets({ ...perfect, performance: 0.81, lcpMs: 2900 });
    expect(result.failures).toEqual([]);
    expect(result.misses).toEqual(["performance 81", "LCP 2.9 s"]);
  });
});
