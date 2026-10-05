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

## Hooks

husky installs them on `npm install` (the `prepare` script). They live in `.husky/`.

| Hook         | Runs                                                                                                                          | Cost                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `pre-commit` | lint-staged on the staged files only: ESLint, Stylelint, markdownlint fixes, then Prettier                                    | Seconds                   |
| `commit-msg` | commitlint on the message                                                                                                     | Instant                   |
| `pre-push`   | The whole-project gates: `version:check`, `lint`, `lint:css`, `css:check`, `check`, `build`, unit tests, ESLint rule fixtures | Tens of seconds, per push |

The whole-project gates run on push rather than on commit: a branch with ten commits pays for them once. lint-staged only sees staged files, so `pre-push` also catches what a change breaks elsewhere (an import left orphaned in an untouched file).

## Branches

- `main` is always releasable. Work happens on short-lived branches named `<type>/t-<id>-<slug>`, e.g. `chore/t-13-git-hooks`, merged through a pull request: `main` is protected (T-19), and nobody, admins included, pushes to it directly.
- No `release` branch: every pull request gets a preview deploy (T-23).

## Pull requests and CI

`.github/workflows/ci.yml` runs one job, **Quality gate**, on every pull request and on every push to `main`. It installs with `npm ci` on the Node version in `.nvmrc`, then runs, cheapest first: `version:check`, `format:check`, `lint`, `test:eslint-rules`, `lint:css`, `css:check`, `lint:md`, `check`, `npm test`, `build`, the dependency audit and `test:e2e` (Playwright's Chromium, installed in the job). On a failure it uploads the Playwright report and traces as an artifact.

`main` is protected:

- changes arrive only through a pull request, and **Quality gate** must pass on a branch that is up to date with `main`;
- the rule applies to admins too;
- history stays linear: pull requests are merged with **rebase**, so each `type: subject (t-xx)` commit lands on `main` as written;
- no approving review is required (one maintainer can't approve their own pull request).

Dependency audit policy: runtime dependencies fail on a `high` advisory (`npm audit --omit=dev --audit-level=high`); the whole tree fails only on `critical`, because some `high` advisories in lint tooling (`braces`, through Stylelint and markdownlint) have no fix yet. Renovate (T-21) brings the fixes as they ship.

Actions are pinned to a commit SHA with the release in a comment; Renovate updates them. The workflow has read-only `contents` permission and no secrets.

## Skipping hooks

`--no-verify` skips the local hooks. It is acceptable only when the hook itself is broken (a tool crash, not a failing check) or for a throwaway local commit that will be amended or squashed before pushing. Never use it to push a change that fails a check: CI runs the same gates and will reject it, and fixing the code is cheaper than arguing with the gate.

## Versions and releases

Semver: `0.x` until launch, `1.0.0` at launch (requirements §13.4). `CHANGELOG.md` follows Keep a Changelog: one short line per notable change, written for someone reading the site's history, not a copy of the commit log.

- While working: add a line under `## [Unreleased]` when a change is worth noting (a new check, a page, a fix a visitor would notice). Refactors and docs-only commits usually aren't.
- To release: rename `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD`, open a new empty `[Unreleased]` above it, update the link references at the bottom, commit, then run `npm version x.y.z` (or `minor` / `patch`).

`npm version` bumps `package.json` and the lock file, runs the `version` script (which rewrites the README badge and stages it), commits as `chore: release vx.y.z` (set in `.npmrc`) and tags `vx.y.z`. Push with `git push --follow-tags`.

`npm run version:check` fails when the README badge and `package.json` disagree. `pre-push` and CI run it.
