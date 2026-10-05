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

### Changed

- The starter skeleton passes the CSS and accessibility checks: tokens, logical properties, sharp corners, AA text contrast and named language links.

### Removed

- Astro starter leftovers (Welcome component, default layout and assets).

[Unreleased]: https://github.com/plastikaweb/plastikaweb-astro/commits/main
