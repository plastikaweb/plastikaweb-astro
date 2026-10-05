/// <reference types="vitest/config" />
// Vitest through Astro's Vite config, so tests resolve imports like the build does.

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/testing/**"],
      reporter: ["text", "html"],
    },
  },
});
