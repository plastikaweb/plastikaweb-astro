import { describe, expect, it } from "vitest";

import { postSlugs } from "../../testing/fixtures";
import { assertNoReservedSlugs } from "./reserved-slugs";

describe("assertNoReservedSlugs", () => {
  it("accepts ordinary post slugs", () => {
    expect(() => assertNoReservedSlugs(postSlugs)).not.toThrow();
  });

  it("names every reserved slug a post uses", () => {
    expect(() =>
      assertNoReservedSlugs([...postSlugs, "tag", "category"]),
    ).toThrow("Reserved blog slugs used by posts: tag, category");
  });

  it("only matches whole slugs", () => {
    expect(() =>
      assertNoReservedSlugs(["tagging-posts", "categorical"]),
    ).not.toThrow();
  });
});
