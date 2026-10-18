import { expect, test } from "@playwright/test";

// Astro only warns when a Google font fails to download at build time, and the build
// still passes, so these checks are the only thing that notices a missing font
// (requirements §4.2). They also guard the generated fallbacks, which Astro once
// measured on the wrong subset file (T-30).
const HOME = "/en/";
// A page that doesn't use Space Grotesk, so it must not preload it.
const WITHOUT_DISPLAY_FONT = "/en/contact/";
const FONT_PRELOAD = 'link[rel="preload"][as="font"]';

test("the home page loads every web font from the site's own domain", async ({
  page,
}) => {
  const fontUrls: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "font") {
      fontUrls.push(request.url());
    }
  });
  await page.goto(HOME);
  const faces = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((face) => !face.family.includes("fallback"))
      .map((face) => ({ family: face.family, status: face.status }));
  });

  for (const family of ["Space Grotesk", "Bricolage Grotesque"]) {
    const statuses = faces
      .filter((face) => face.family.includes(family))
      .map((face) => face.status);
    expect(statuses, `${family} faces`).toContain("loaded");
  }
  expect(faces.some((face) => face.family.includes("Commit Mono"))).toBe(true);

  const origin = new URL(page.url()).origin;
  expect(fontUrls.length).toBeGreaterThan(0);
  for (const url of fontUrls) {
    expect(new URL(url).origin).toBe(origin);
  }
});

test("only pages that use Space Grotesk preload it", async ({ page }) => {
  await page.goto(HOME);
  await expect(page.locator(FONT_PRELOAD)).toHaveCount(1);
  await page.goto(WITHOUT_DISPLAY_FONT);
  await expect(page.locator(FONT_PRELOAD)).toHaveCount(0);
});

test("the generated fallbacks are sized close to their web fonts", async ({
  page,
}) => {
  await page.goto(HOME);
  const fallbacks = await page.evaluate(() =>
    [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .filter((rule) => rule instanceof CSSFontFaceRule)
      .map((rule) => ({
        family: rule.style.getPropertyValue("font-family"),
        sizeAdjust: rule.style.getPropertyValue("size-adjust"),
      }))
      .filter((face) => face.family.includes("fallback")),
  );

  for (const family of [
    "Space Grotesk",
    "Bricolage Grotesque",
    "Commit Mono",
  ]) {
    expect(
      fallbacks.some((face) => face.family.includes(family)),
      `${family} fallback`,
    ).toBe(true);
  }
  // A fallback drawn far larger or smaller than the web font jumps when the font arrives.
  for (const { family, sizeAdjust } of fallbacks) {
    const percent = Number.parseFloat(sizeAdjust);
    expect(percent, `${family} size-adjust`).toBeGreaterThanOrEqual(90);
    expect(percent, `${family} size-adjust`).toBeLessThanOrEqual(110);
  }
});
