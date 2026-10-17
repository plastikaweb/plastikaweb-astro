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

// Truncated, not rounded: a 2499 ms LCP must not print as the 2.5 s limit it passes.
const seconds = (/** @type {number} */ ms) =>
  `${(Math.floor(ms / 10) / 100).toFixed(2)} s`;
const shift = (/** @type {number} */ cls) =>
  (Math.floor(cls * 1000) / 1000).toFixed(3);

/** Lists blocking failures and reported misses for one summarized run. */
export function checkBudgets(
  /** @type {ReturnType<typeof summarize>} */ result,
) {
  const failures = Object.entries(BUDGETS.blocking)
    .filter(([id, min]) => result[id] < min)
    .map(([id]) => ({ id, score: result[id] }));
  // §1.3 asks for LCP < 2.5 s and CLS < 0.1, so the limits themselves miss.
  const { performance, lcpMs, cls } = BUDGETS.reported;
  const misses = [
    result.performance < performance &&
      `performance ${Math.round(result.performance * 100)}`,
    result.lcpMs >= lcpMs && `LCP ${seconds(result.lcpMs)}`,
    result.cls >= cls && `CLS ${shift(result.cls)}`,
  ].filter(Boolean);
  return { failures, misses };
}

/** Audits behind a category score below 1, so a failure says what to fix. */
export function failingAudits(
  /** @type {any} */ lhr,
  /** @type {string} */ category,
) {
  // Lighthouse zeroes the weight of not-applicable audits, so a weighted null score
  // is an audit that errored: it nulls the category score and must be named.
  return (lhr.categories[category]?.auditRefs ?? [])
    .filter((ref) => ref.weight > 0 && lhr.audits[ref.id]?.score !== 1)
    .map((ref) => ref.id);
}

/** The response at ORIGIN, or null when nothing answers there within 2 s. */
async function probe() {
  try {
    return await fetch(ORIGIN, { signal: AbortSignal.timeout(2000) });
  } catch {
    return null;
  }
}

async function startPreview() {
  // A server already on the port would be audited instead of this build.
  if (await probe()) {
    throw new Error(`${ORIGIN} is already in use: stop that server first`);
  }
  const server = spawn(
    "npx",
    ["astro", "preview", "--port", String(PORT), "--ignore-lock"],
    {
      stdio: "ignore",
    },
  );
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if ((await probe())?.ok) {
      return server;
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
  // If the layout stops reading this key, every run would audit the same theme.
  await tab.reload();
  const applied = await tab.evaluate(
    () => document.documentElement.dataset.theme,
  );
  if (applied !== theme) {
    throw new Error(
      `${page.path} shows the ${applied} theme with "${THEME_STORAGE_KEY}" set to ${theme}`,
    );
  }
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
          seconds(result.lcpMs),
          shift(result.cls),
          failures.length > 0
            ? `✖ ${failures.map(({ id, score }) => `${id} ${percent(score)}`).join("; ")}`
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
  for (const { id, score } of failures) {
    // A page that fails to load errors every audit: its cause beats a list of all of them.
    const detail = lhr.runtimeError
      ? `${lhr.runtimeError.code}: ${lhr.runtimeError.message}`
      : failingAudits(lhr, id).join(", ") || "no weighted audits";
    console.error(
      `✖ ${page.path} ${theme}: ${id} ${Math.round(score * 100)} (${detail})`,
    );
  }
  return { page, theme, result, failures, misses };
}

if (import.meta.main) {
  const pages = pickTemplatePages(globSync("dist/**/index.html"));
  // A dist/ without locale pages must fail, not pass with nothing audited.
  if (!pages.some((page) => page.template === "home")) {
    throw new Error(
      "dist/ has no locale home pages: run `npm run build` first",
    );
  }
  mkdirSync(REPORTS, { recursive: true });
  const rows = [];
  let server;
  let chrome;
  let browser;

  try {
    server = await startPreview();
    chrome = await chromeLauncher.launch({
      chromePath: chromium.executablePath(),
      // GitHub's Ubuntu runners block Chrome's sandbox; Playwright disables it there too.
      chromeFlags: [
        "--headless=new",
        ...(process.env.CI ? ["--no-sandbox"] : []),
      ],
    });
    browser = await puppeteer.connect({
      browserURL: `http://127.0.0.1:${chrome.port}`,
    });
    for (const page of pages) {
      for (const theme of THEMES) {
        rows.push(await auditAndCheck(chrome, browser, page, theme));
      }
    }
  } finally {
    await browser?.disconnect();
    chrome?.kill();
    server?.kill();
  }

  report(rows);
  if (rows.some((row) => row.failures.length > 0)) {
    process.exit(1);
  }
}
