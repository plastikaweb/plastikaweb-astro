import { describe, expect, it } from "vitest";

import {
  checkBudgets,
  failingAudits,
  pickTemplatePages,
  summarize,
} from "./lighthouse.js";

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

describe("summarize", () => {
  const lhr = {
    categories: {
      performance: { score: 0.93 },
      accessibility: { score: 1 },
      "best-practices": { score: 1 },
      seo: { score: 0.92 },
    },
    audits: {
      "largest-contentful-paint": { numericValue: 2650 },
      "cumulative-layout-shift": { numericValue: 0.004 },
    },
  };

  it("reads the four category scores, LCP and CLS", () => {
    expect(summarize(lhr)).toEqual({
      performance: 0.93,
      accessibility: 1,
      "best-practices": 1,
      seo: 0.92,
      lcpMs: 2650,
      cls: 0.004,
    });
  });

  it("scores a missing or errored category as 0, so it fails", () => {
    const result = summarize({
      ...lhr,
      categories: {
        performance: { score: null },
        accessibility: { score: null },
      },
    });
    expect(result.performance).toBe(0);
    expect(result.accessibility).toBe(0);
    expect(checkBudgets(result).failures.map(({ id }) => id)).toEqual([
      "accessibility",
      "best-practices",
      "seo",
    ]);
  });

  it("treats a missing LCP or CLS as infinite, so it misses", () => {
    const result = summarize({ ...lhr, audits: {} });
    expect(result.lcpMs).toBe(Infinity);
    expect(result.cls).toBe(Infinity);
    expect(checkBudgets(result).misses).toEqual([
      "performance 93",
      "LCP Infinity s",
      "CLS Infinity",
    ]);
  });
});

describe("failingAudits", () => {
  const lhr = {
    categories: {
      accessibility: {
        // Lighthouse zeroes the weight of not-applicable audits (image-alt on a page
        // without images), and some audits never carry weight (empty-heading).
        auditRefs: [
          { id: "color-contrast", weight: 7 },
          { id: "landmark-one-main", weight: 3 },
          { id: "label", weight: 10 },
          { id: "image-alt", weight: 0 },
          { id: "empty-heading", weight: 0 },
        ],
      },
    },
    audits: {
      "color-contrast": { score: 0 },
      "landmark-one-main": { score: 1 },
      label: { score: null },
      "image-alt": { score: null },
      "empty-heading": { score: 0 },
    },
  };

  it("names the weighted audits that failed or errored", () => {
    expect(failingAudits(lhr, "accessibility")).toEqual([
      "color-contrast",
      "label",
    ]);
  });

  it("returns nothing for a category the run lacks", () => {
    expect(failingAudits(lhr, "seo")).toEqual([]);
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

  it.each(["accessibility", "best-practices", "seo"])(
    "fails when %s is below 100",
    (id) => {
      expect(checkBudgets({ ...perfect, [id]: 0.96 }).failures).toEqual([
        { id, score: 0.96 },
      ]);
    },
  );

  it("lists every blocking failure of a run", () => {
    expect(
      checkBudgets({ ...perfect, accessibility: 0.9, seo: 0.8 }).failures,
    ).toEqual([
      { id: "accessibility", score: 0.9 },
      { id: "seo", score: 0.8 },
    ]);
  });

  it("only reports performance and Core Web Vitals misses", () => {
    const result = checkBudgets({
      ...perfect,
      performance: 0.81,
      lcpMs: 2900,
      cls: 0.12,
    });
    expect(result.failures).toEqual([]);
    expect(result.misses).toEqual([
      "performance 81",
      "LCP 2.90 s",
      "CLS 0.120",
    ]);
  });

  it("misses LCP and CLS at their limits, since §1.3 asks for less than", () => {
    expect(checkBudgets({ ...perfect, lcpMs: 2500, cls: 0.1 }).misses).toEqual([
      "LCP 2.50 s",
      "CLS 0.100",
    ]);
    expect(
      checkBudgets({ ...perfect, lcpMs: 2499, cls: 0.0999 }).misses,
    ).toEqual([]);
  });

  it("truncates LCP and CLS instead of rounding them", () => {
    expect(
      checkBudgets({ ...perfect, lcpMs: 2649.9, cls: 0.1239 }).misses,
    ).toEqual(["LCP 2.64 s", "CLS 0.123"]);
  });
});
