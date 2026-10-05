# Lens: SEO — metadata, hreflang and structured data

Reference: requirements §9 (target keywords, implementation) and §5 (locales, D-11 for posts that exist in only some locales). Read the built HTML in `dist/` for the touched pages: it is what crawlers see.

## Already mechanical (input, not work)

Lighthouse SEO and the build-output checks once T-20 lands; the axe check covers `lang` and the document title's presence.

## Judgement checks

1. **Title and description.** Unique per page and locale, written for the page's intent (§9.1 keywords where they fit naturally), within typical display lengths; translated, not copied across locales.
2. **Canonical.** One absolute canonical per page, matching the trailing-slash policy and the locale's own URL.
3. **`hreflang`.** Alternates for ca, es, en and `x-default` on every page; reciprocal; absolute URLs; only real translations for blog posts and personal entries (D-11).
4. **Headings and content.** The `h1` states the page's topic; headings describe their sections; meaningful link text (no "click here", "read more" without context).
5. **Open Graph and Twitter.** Title, description, URL, locale (`og:locale` and alternates) and a preview image with dimensions and alt.
6. **JSON-LD.** Person, WebSite, BlogPosting, BreadcrumbList where they apply; valid against the schema.org types; data matches the visible page (no invented fields).
7. **Sitemap and robots.** Touched or new routes appear in the multilingual sitemap with their alternates; drafts, 404 and non-indexable pages are excluded; `robots.txt` points to the sitemap.
8. **Redirects** (§9.2). Every indexed URL of the current plastikaweb.com that the change affects maps with a 301 to its new equivalent, or returns a deliberate 404/410.
9. **Images.** Descriptive file names and alt text; no text baked into images where HTML text would do.
