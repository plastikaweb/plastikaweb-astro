// Lighthouse 13 on one page per template, in both themes, against the built site
// (requirements §1.3, §13.3). Run `npm run build` first. Docs: docs/testing.md.

import { spawn } from "node:child_process";
import { appendFileSync, globSync, mkdirSync, writeFileSync } from "node:fs";

import { chromium } from "@playwright/test";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";

const PORT = 4324;
const ORIGIN = `http://localhost:${PORT}`;
const LOCALES = ["ca", "es", "en"];
const THEMES = ["light", "dark"];
// The inline theme script reads this key before first paint (requirements §4.5).
const THEME_STORAGE_KEY = "theme";
const REPORTS = "lighthouse-reports";

// Scores are 0–1. Performance and the Core Web Vitals are reported, not blocking,
// until T-33 replaces the skeleton (requirements §13.3).
export const BUDGETS = {
  blocking: { accessibility: 1, "best-practices": 1, seo: 1 },
  reported: { performance: 1, lcpMs: 2500, cls: 0.1 },
};

/** Groups built pages by template and picks one page each, rotating the locale. */
export function pickTemplatePages(/** @type {string[]} */ files) {
  const pages = files
    .map((file) => file.replace(/^dist\//, "").replace(/index\.html$/, ""))
    .map((path) => path.split("/").filter(Boolean))
    .filter(([locale]) => LOCALES.includes(locale));
  const paths = new Set(pages.map((segments) => segments.join("/")));

  const byTemplate = new Map();
  for (const [locale, ...rest] of pages) {
    // A page whose parent is also a page is an instance: /blog/<slug>/ → "blog/*".
    const parent = rest.slice(0, -1).join("/");
    const template =
      rest.length > 1 && paths.has(`${locale}/${parent}`)
        ? `${parent}/*`
        : rest.join("/") || "home";
    const entries = byTemplate.get(template) ?? [];
    entries.push({ locale, path: `/${[locale, ...rest].join("/")}/` });
    byTemplate.set(template, entries);
  }

  return [...byTemplate.keys()].sort().map((template, index) => {
    const entries = byTemplate
      .get(template)
      .sort((a, b) => a.path.localeCompare(b.path));
    const wanted = LOCALES[index % LOCALES.length];
    const entry = entries.find((page) => page.locale === wanted) ?? entries[0];
    return { template, ...entry };
  });
}

/** Turns a Lighthouse result into the numbers the budgets check. */
export function summarize(/** @type {any} */ lhr) {
  const score = (/** @type {string} */ id) => lhr.categories[id]?.score ?? 0;
  return {
    performance: score("performance"),
    accessibility: score("accessibility"),
    "best-practices": score("best-practices"),
    seo: score("seo"),
    lcpMs: lhr.audits["largest-contentful-paint"]?.numericValue ?? Infinity,
    cls: lhr.audits["cumulative-layout-shift"]?.numericValue ?? Infinity,
  };
}

/** Lists blocking failures and reported misses for one summarized run. */
export function checkBudgets(
  /** @type {ReturnType<typeof summarize>} */ result,
) {
  const failures = Object.entries(BUDGETS.blocking)
    .filter(([id, min]) => result[id] < min)
    .map(([id]) => `${id} ${Math.round(result[id] * 100)}`);
  const { performance, lcpMs, cls } = BUDGETS.reported;
  const misses = [
    result.performance < performance &&
      `performance ${Math.round(result.performance * 100)}`,
    result.lcpMs > lcpMs && `LCP ${(result.lcpMs / 1000).toFixed(1)} s`,
    result.cls > cls && `CLS ${result.cls.toFixed(2)}`,
  ].filter(Boolean);
  return { failures, misses };
}

/** Audits behind a category score below 1, so a failure says what to fix. */
function failingAudits(/** @type {any} */ lhr, /** @type {string} */ category) {
  return lhr.categories[category].auditRefs
    .filter((ref) => ref.weight > 0 && (lhr.audits[ref.id].score ?? 1) < 1)
    .map((ref) => ref.id);
}

async function startPreview() {
  const server = spawn(
    "npx",
    ["astro", "preview", "--port", String(PORT), "--ignore-lock"],
    {
      stdio: "ignore",
    },
  );
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(ORIGIN)).ok) {
        return server;
      }
    } catch {
      // Not listening yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  server.kill();
  throw new Error(`astro preview didn't answer on ${ORIGIN}`);
}

async function audit(
  /** @type {{ port: number }} */ chrome,
  /** @type {any} */ browser,
  page,
  theme,
) {
  // The theme goes in localStorage, which disableStorageReset keeps. That flag also keeps
  // the HTTP cache, so it is cleared here: Lighthouse must measure a cold first visit.
  // The page itself is used because "/" redirects with a meta refresh.
  const tab = await browser.newPage();
  await tab.goto(`${ORIGIN}${page.path}`);
  await tab.evaluate(
    (key, value) => localStorage.setItem(key, value),
    THEME_STORAGE_KEY,
    theme,
  );
  const cdp = await tab.createCDPSession();
  await cdp.send("Network.clearBrowserCache");
  await tab.close();

  const run = await lighthouse(`${ORIGIN}${page.path}`, {
    port: chrome.port,
    output: ["json", "html"],
    logLevel: "error",
    disableStorageReset: true,
  });
  const name = `${page.template.replaceAll(/[/*]/g, "_")}-${page.locale}-${theme}`;
  writeFileSync(`${REPORTS}/${name}.html`, run.report[1]);
  return run.lhr;
}

function report(/** @type {any[]} */ rows) {
  const percent = (/** @type {number} */ value) => Math.round(value * 100);
  const lines = [
    "| Page | Theme | Perf | A11y | BP | SEO | LCP | CLS | Result |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows
      .map(({ page, theme, result, failures, misses }) =>
        [
          `\`${page.path}\``,
          theme,
          percent(result.performance),
          percent(result.accessibility),
          percent(result["best-practices"]),
          percent(result.seo),
          `${(result.lcpMs / 1000).toFixed(1)} s`,
          result.cls.toFixed(2),
          failures.length > 0
            ? `✖ ${failures.join("; ")}`
            : misses.length > 0
              ? `⚠ ${misses.join(", ")}`
              : "✔",
        ].join(" | "),
      )
      .map((row) => `| ${row} |`),
  ].join("\n");
  console.warn(lines);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `## Lighthouse\n\n${lines}\n`,
    );
  }
}

async function auditAndCheck(chrome, browser, page, theme) {
  const lhr = await audit(chrome, browser, page, theme);
  const result = summarize(lhr);
  const { failures, misses } = checkBudgets(result);
  for (const failure of failures) {
    const [category] = failure.split(" ");
    const audits = failingAudits(lhr, category).join(", ");
    console.error(`✖ ${page.path} ${theme}: ${failure} (${audits})`);
  }
  return { page, theme, result, failures, misses };
}

if (import.meta.main) {
  const pages = pickTemplatePages(globSync("dist/**/index.html"));
  mkdirSync(REPORTS, { recursive: true });
  const server = await startPreview();
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    // GitHub's Ubuntu runners block Chrome's sandbox; Playwright disables it there too.
    chromeFlags: [
      "--headless=new",
      ...(process.env.CI ? ["--no-sandbox"] : []),
    ],
  });
  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
  });
  const rows = [];

  try {
    for (const page of pages) {
      for (const theme of THEMES) {
        rows.push(await auditAndCheck(chrome, browser, page, theme));
      }
    }
  } finally {
    await browser.disconnect();
    chrome.kill();
    server.kill();
  }

  report(rows);
  if (rows.some((row) => row.failures.length > 0)) {
    process.exit(1);
  }
}
