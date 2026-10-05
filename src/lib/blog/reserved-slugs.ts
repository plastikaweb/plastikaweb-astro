// Category and tag pages live under /blog/category/ and /blog/tag/, so those two
// words can't be post slugs (requirements §6.4). The build calls this and fails.

export const RESERVED_BLOG_SLUGS = ["category", "tag"] as const;

/** Throws when any slug collides with a reserved blog route segment. */
export function assertNoReservedSlugs(slugs: readonly string[]): void {
  const reserved: readonly string[] = RESERVED_BLOG_SLUGS;
  const collisions = slugs.filter((slug) => reserved.includes(slug));
  if (collisions.length > 0) {
    throw new Error(
      `Reserved blog slugs used by posts: ${collisions.join(", ")}. Rename the posts.`,
    );
  }
}
