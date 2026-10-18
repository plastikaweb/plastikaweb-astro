# Changelog

Notable changes to the site, newest first. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [semver](https://semver.org/): `0.x` until launch, `1.0.0` at launch.

## [Unreleased]

### Added

- Requirements, task backlog and product brief; Home design approved in Claude Design.
- Node 24 LTS and Astro 7.
- Prettier, ESLint (TypeScript, Astro, strict jsx-a11y) and a local rule for short comments.
- Stylelint with the design-token rules, and a check for undefined CSS custom properties.
- markdownlint, `astro check`, Git hooks and Conventional Commits.
- Vitest unit tests with coverage.
- Playwright smoke and axe accessibility tests on the home page, both themes, 375 and 1440 px.
- Claude Code guard hooks and command allow list.
- Project skills for commits (`commit-actions`) and branch audits (`task-audit`, ten read-only review lenses).
- Changelog and a README version badge checked against `package.json`.
- CI quality gate on every pull request; `main` is protected and requires it.
- Lighthouse on every page template in both themes, HTML validation and an internal link check, all in the quality gate.

### Changed

- The starter skeleton passes the CSS, accessibility, HTML and Lighthouse checks: tokens, logical properties, sharp corners, AA text contrast, named language links, underlined breadcrumb links, no external placeholder images.
- Every font is served from the site's own domain through the Astro Fonts API, with no requests to Google Fonts; Space Grotesk is preloaded only on the pages that use it.
- Design tokens from the approved designs: input borders, data and category colours, code syntax colours, hard shadows, border widths, hero and post-title sizes, motion durations.

### Removed

- Astro starter leftovers (Welcome component, default layout and assets).
- The muted text colour, which failed AA contrast; secondary text and placeholders use the secondary grey.

[Unreleased]: https://github.com/plastikaweb/plastikaweb-astro/commits/main
