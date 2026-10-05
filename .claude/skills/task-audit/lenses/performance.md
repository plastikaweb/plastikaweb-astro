# Lens: performance — JavaScript, fonts, images and Core Web Vitals

Budget: Lighthouse 100 in all four categories; LCP < 2.5 s, CLS < 0.1, INP < 200 ms (requirements §1.3, §2, §8). Read the built output in `dist/` for the touched pages: it is what ships.

## Already mechanical (input, not work)

Lighthouse CI and the build-output checks once T-20 lands. Until then you estimate from the code and `dist/`.

## Judgement checks

1. **Client JavaScript** (§2). Scripts only where interaction needs them (theme toggle, language selector, filters, contact form, tech timeline). A `client:*` island or `<script>` for something HTML and CSS can do → P1; a framework runtime shipped for static content → P0. Check the size of the new chunks in `dist/_astro/`.
2. **LCP.** The H1 and the portrait render from the first frame (§4.4): no fade-in, no lazy loading, no client-side rendering on them; the LCP image has `fetchpriority="high"` and explicit dimensions.
3. **CLS.** Every image and embed has width and height (or `aspect-ratio`); fonts with `font-display: swap` and fallback metrics close enough not to shift; nothing injected above existing content after load.
4. **Images** (§8). Through `astro:assets` (`<Image>` / `<Picture>`): responsive `srcset`, modern formats, explicit dimensions, `loading="lazy"` below the fold only.
5. **Fonts** (§4.2). Subset woff2; only Space Grotesk preloaded; no new weights or families without need.
6. **CSS.** No large unused blocks shipped to every page; scoped styles stay scoped; no `@import` chains that block rendering.
7. **INP.** Event handlers do little work on the main thread; no layout thrashing in scroll or resize handlers; scroll-driven effects in CSS, not JS.
8. **Third parties** (§8). Nothing beyond Plausible; Plausible loaded `defer`.
9. **Build-time work.** Data fetched once at build time and reused across pages, not per component.
