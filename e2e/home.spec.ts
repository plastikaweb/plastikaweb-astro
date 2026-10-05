import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The skeleton serves the home page at /en/ until routing is decided (T-25).
const HOME = "/en/";

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(`home page, ${colorScheme} theme`, () => {
    test.use({ colorScheme });

    test("renders with one h1 and the expected theme", async ({ page }) => {
      await page.goto(HOME);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        colorScheme,
      );
    });

    test("has no WCAG 2.2 AA violations", async ({ page }) => {
      await page.goto(HOME);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      // Rule, impact and selectors are enough to find the problem; the full axe object is noise.
      const violations = results.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        targets: nodes.map((node) => node.target.join(" ")),
      }));
      expect(violations).toEqual([]);
    });
  });
}
