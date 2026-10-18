// @ts-check
import { defineConfig, fontProviders } from "astro/config";

const COMMIT_MONO = "./src/assets/fonts/subset-CommitMono";

// https://astro.build/config
export default defineConfig({
  // Every family is served from the site's own domain (requirements §4.2, D-07):
  // the Google ones are downloaded at build time, Commit Mono is local.
  // theme.css maps these variables to --font-display, --font-sans and --font-mono.
  // Latin subset only: with latin-ext, Astro sized the fallbacks wrongly (§4.2).
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Space Grotesk",
      cssVariable: "--font-space-grotesk",
      weights: [700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Bricolage Grotesque",
      cssVariable: "--font-bricolage",
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
      options: {
        experimental: { variableAxis: { opsz: [["12", "96"]] } },
      },
    },
    {
      provider: fontProviders.local(),
      name: "Commit Mono",
      cssVariable: "--font-commit-mono",
      fallbacks: ["monospace"],
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: [`${COMMIT_MONO}-Regular.woff2`],
          },
          {
            weight: 400,
            style: "italic",
            src: [`${COMMIT_MONO}-Italic.woff2`],
          },
          { weight: 700, style: "normal", src: [`${COMMIT_MONO}-Bold.woff2`] },
          {
            weight: 700,
            style: "italic",
            src: [`${COMMIT_MONO}-BoldItalic.woff2`],
          },
        ],
      },
    },
  ],
});
