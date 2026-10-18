# Commits, hooks, branches and releases

How changes reach `main` (requirements §13.2). The hooks are a fast local filter; the CI quality gate (T-19) is the authority.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/), checked by commitlint (`commitlint.config.js`) on every commit:

```text
<type>: <subject in lowercase> (t-<id>)

<body: what changed and why, wrapped by hand>

<footer: trailers such as Co-Authored-By>
```

- **Types:** `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`. Anything else is rejected.
- **Header:** at most 100 characters; the subject starts in lowercase and has no final period.
- **Task reference:** the `TASKS.md` id in parentheses at the end of the subject, e.g. `chore: add markdownlint (t-11)`. Decisions add their `d-xx` ids.
- **Body and footer:** each preceded by a blank line; body lines up to 500 characters.
- **A body line must not start with `word:` or with one word and a `#`** (e.g. `theme: axe measured…`, `a #contact section…`): the parser reads the first as a trailer and the second as an issue reference like `Closes #12`, so the footer starts there and `footer-leading-blank` fails. Reword or rewrap the line; backticks around the hash (`` `#contact` ``) also work.

## Hooks

husky installs them on `npm install` (the `prepare` script). They live in `.husky/`.

| Hook         | Runs                                                                                                                                                           | Cost                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `pre-commit` | lint-staged on the staged files only: ESLint, Stylelint, markdownlint fixes, Prettier, then cspell                                                             | Seconds                   |
| `commit-msg` | commitlint on the message                                                                                                                                      | Instant                   |
| `pre-push`   | The whole-project gates: `version:check`, `lint`, `lint:css`, `css:check`, `check`, `build`, HTML validation, internal links, unit tests, ESLint rule fixtures | Tens of seconds, per push |

The whole-project gates run on push rather than on commit: a branch with ten commits pays for them once. lint-staged only sees staged files, so `pre-push` also catches what a change breaks elsewhere (an import left orphaned in an untouched file).

## Branches

- `main` is always releasable. Work happens on short-lived branches named `<type>/t-<id>-<slug>`, e.g. `chore/t-13-git-hooks`, merged through a pull request: `main` is protected (T-19), and nobody, admins included, pushes to it directly. The one exception to the name is Renovate's `renovate/<group or package>` branches (see [Dependency updates](#dependency-updates)).
- No `release` branch: every pull request gets a preview deploy (T-23).

## Pull requests and CI

`.github/workflows/ci.yml` runs one job, **Quality gate**, on every pull request and on every push to `main`. It installs with `npm ci` on the Node version in `.nvmrc`, then runs, cheapest first: `version:check`, `format:check`, `lint`, `test:eslint-rules`, `lint:css`, `css:check`, `lint:md`, `lint:spell`, `check`, `npm test`, `build`, `validate:html`, `links:check`, the dependency audit, `test:e2e` (Playwright's Chromium, installed in the job) and `lighthouse`. The Lighthouse reports are always uploaded as an artifact, with a summary table in the job summary; the Playwright report and traces only on a failure.

`main` is protected:

- changes arrive only through a pull request, and **Quality gate** must pass on a branch that is up to date with `main`;
- the rule applies to admins too;
- history stays linear: pull requests are merged with **rebase**, so each `type: subject (t-xx)` commit lands on `main` as written;
- no approving review is required (one maintainer can't approve their own pull request).

Dependency audit policy: runtime dependencies fail on a `high` advisory (`npm audit --omit=dev --audit-level=high`); the whole tree fails only on `critical`, because some `high` advisories in lint tooling (`braces`, through Stylelint and markdownlint) have no fix yet. Renovate brings fixes for the dependencies in `package.json` as advisories are published; a fix deeper in the tree takes a lock file refresh (see [Dependency updates](#dependency-updates)).

Actions are pinned to a commit SHA with the release in a comment; Renovate updates them. The workflow has read-only `contents` permission and no secrets.

## Dependency updates

Renovate (requirements §13.8) opens the update pull requests. It runs as the hosted Mend Renovate app; its config is `.github/renovate.jsonc`, whose comments say why each rule is there.

- **When:** new pull requests open on Mondays, Madrid time. An open one is kept current on any day: Renovate rebases it when `main` moves and adds newer releases to it, so the patch group can merge itself midweek. Security fixes and pull requests ticked in the Dependency Dashboard don't wait for Monday either.
- **Release age:** a new npm release waits three days before Renovate proposes it, and the lock file maintenance takes nothing younger (npm `--before`), so a broken or compromised release has time to be pulled. If npm can't resolve the tree that way, Renovate refreshes the lock without the limit and says so in the pull request: leave that one for the next Monday.
- **Groups:** one pull request per group, with any update outside a group in its own.

  | Pull request                    | Holds                                              | Merge                                      |
  | ------------------------------- | -------------------------------------------------- | ------------------------------------------ |
  | `astro packages`                | `astro` and every `@astrojs/*` package             | By hand                                    |
  | `dev dependency patch releases` | Patch releases of the dev dependencies             | Merges itself once **Quality gate** passes |
  | `dev dependency minor releases` | Minor releases of the dev dependencies             | By hand                                    |
  | `github actions`                | Minor, patch and SHA updates of the pinned actions | By hand                                    |
  | `lock file maintenance`         | The lock file refreshed within the ranges in use   | By hand                                    |

  A group merges itself only if every update in it would: an `astro packages` pull request that holds only a patch of `@astrojs/check`, a dev dependency, merges itself.

- **Majors** wait in the Dependency Dashboard (an issue Renovate keeps up to date) under "Pending Approval": tick one to get its pull request, one major at a time (§13.1). TypeScript 7 stays there until `typescript-eslint` supports it. A Node major updates `.nvmrc` and `engines` together (`^24.0.0` becomes `^26.0.0`; a range such as `>=24.0.0 <25` would only be widened); the npm version in `constraints` in `.github/renovate.jsonc` (the npm that ships with Node 24) then changes by hand, to the npm that ships with the new Node.
- **Automerge:** Renovate turns on GitHub's auto-merge, by rebase, and GitHub merges once the gate passes on a branch up to date with `main`. A failing pull request stays open.
- **Commits:** `build: update dependency prettier to v3.9.10 (m-1)`, `build: update astro packages (m-1)`, `ci:` for actions. A group that holds a single update keeps its branch but takes that package's subject: `build: update dependency astro to v7.4.0 (m-1)`. The reference is M-1 in `TASKS.md`, the recurring review, in place of a task id. Renovate's commits skip the local hooks, and CI doesn't run commitlint: the format comes from the config.
- **Security fixes** arrive as soon as an advisory is published, outside the schedule and without the three-day wait, with `[security] (m-1)` at the end of the subject; a patch of a dev dependency merges itself once the gate passes, like any other. Renovate learns of advisories from the repository's Dependabot alerts, so those must be on; Dependabot security updates stay off, or both bots would open the same fix.
- **Advisories deeper in the tree:** Renovate fixes only the dependencies in `package.json`. An advisory in a package they pull in fails the dependency audit in CI (`critical` anywhere, `high` in runtime dependencies), which blocks every pull request until it's fixed: by the Monday lock file maintenance when the fix fits the ranges in use, by updating the package that pulls it in, or by hand with `npm update <package>` on a branch when it can't wait (the lock file maintenance won't take a fix younger than three days).
- **Reviewing (M-1):** read the release notes linked in the pull request body, check the gate, merge with rebase. When an update breaks the gate, push the fix to the Renovate branch (Renovate then stops rebasing it). Closing the pull request of a single package skips that version, or the whole major for a major; a group or lock file maintenance pull request comes back after closing, so to hold a release back add a `packageRules` entry with `allowedVersions` to the config.
- **Setup, once, by a maintainer:** install the app from <https://github.com/apps/renovate> with "Only select repositories" and this repository (with "All repositories" it runs silent and opens nothing), and turn on Dependabot alerts in the repository's security settings. The config is already on `main`, so there is no onboarding pull request.

## Skipping hooks

`--no-verify` skips the local hooks. It is acceptable only when the hook itself is broken (a tool crash, not a failing check) or for a throwaway local commit that will be amended or squashed before pushing. Never use it to push a change that fails a check: CI runs the same gates and will reject it, and fixing the code is cheaper than arguing with the gate.

## Versions and releases

Semver: `0.x` until launch, `1.0.0` at launch (requirements §13.4). `CHANGELOG.md` follows Keep a Changelog: one short line per notable change, written for someone reading the site's history, not a copy of the commit log.

- While working: add a line under `## [Unreleased]` when a change is worth noting (a new check, a page, a fix a visitor would notice). Refactors and docs-only commits usually aren't.
- To release: rename `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD`, open a new empty `[Unreleased]` above it, update the link references at the bottom, commit, then run `npm version x.y.z` (or `minor` / `patch`).

`npm version` bumps `package.json` and the lock file, runs the `version` script (which rewrites the README badge and stages it), commits as `chore: release vx.y.z` (set in `.npmrc`) and tags `vx.y.z`. Push with `git push --follow-tags`.

`npm run version:check` fails when the README badge and `package.json` disagree. `pre-push` and CI run it.
