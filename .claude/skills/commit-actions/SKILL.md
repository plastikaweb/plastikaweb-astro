---
name: commit-actions
description: Use when committing on this repo, or when the user asks to commit, merge or release. Refuses `main`, runs the pre-commit gate, drafts a Conventional Commit with the task id, adds the changelog line when the change is notable, runs the release steps when the user asks for a release, confirms before committing and never pushes on its own. Gates the merge of a feature-sized branch on /task-audit.
---

# Commit actions

You produce commits that follow `docs/commits.md` (the authoritative reference; read it once per session). Machine enforcement lives in `commitlint.config.js` and `.husky/`. Walk the steps in order; skip one only when the user opts out for this commit.

## Step 1 — Prerequisites

1. **Branch.** `git branch --show-current`.
   - A task branch `<type>/t-<id>-<slug>` (e.g. `chore/t-13-git-hooks`): continue.
   - `main`: never commit there. Propose a branch name from the task (`TASKS.md`), confirm it, then `git switch -c <name>` (uncommitted changes come along). Base is the current `main`.
2. **Staged changes.** `git status --short`. If nothing is staged, ask which files to stage. Never `git add -A` without confirming the list; never stage `.env*`, `wip/`, `test-results/`, `coverage/` or `CLAUDE.local.md`.
3. **Task id.** From the branch: `t-(\d+)` → `(t-<id>)`. A decision closed in the commit adds its id: `(t-xx, d-yy)`. No task in the branch name → ask.
4. **Artifacts the change implies.** Ask before composing when the staged paths suggest:
   - logic in `src/lib/`, `scripts/` or `eslint-rules/` → was its test added or updated?
   - a new or changed page → does `e2e/` cover it?
   - UI copy → is it in the three locales?
   - a new convention, script or hook → do `docs/`, `CLAUDE.md` and the README command table say so?
   - a task finished → is its status `done` in `TASKS.md`?
   - a `D-xx` decided → is it recorded in `docs/requirements.md` §12 and §14?

If a check fails, say so and wait before composing.

## Step 2 — Pre-commit gate

The hook runs `lint-staged` (ESLint, Stylelint, markdownlint fixes, then Prettier on the staged files). Run it first so a rejection costs seconds, not a drafted message:

```sh
npx lint-staged
```

If it fails, report the output and stop. The whole-project gates (`version:check`, `lint`, `lint:css`, `css:check`, `check`, `build`, unit tests, ESLint rule fixtures) run on `pre-push`, not here.

## Step 3 — Type and subject

One type from `commitlint.config.js`:

| Type       | When the staged diff is mostly…                                            |
| ---------- | -------------------------------------------------------------------------- |
| `feat`     | New visitor-facing functionality (a page, a section, a feature)            |
| `fix`      | A bug fix                                                                  |
| `docs`     | Documentation only (requirements, TASKS, docs/, README)                    |
| `refactor` | Restructuring without behaviour change                                     |
| `perf`     | A performance improvement                                                  |
| `test`     | Tests only                                                                 |
| `build`    | Dependencies, the lock file, the build pipeline                            |
| `ci`       | Workflows and CI scripts                                                   |
| `chore`    | Tooling and repo housekeeping (lint config, hooks, agent settings, skills) |

No scope: the task id carries the context. Subject: lowercase, imperative (`add`, not `added`), no final period, task id at the end, header at most 100 characters. Example: `chore: add markdownlint (t-11)`.

## Step 4 — Body and footer

A body whenever the subject can't carry the change: what changed and why, not a file list. Blank line before the body and before the footer (commitlint enforces both). The footer holds trailers: the attribution line the session specifies for agent-written commits, and `BREAKING CHANGE:` if one applies.

## Step 5 — Changelog and version

`CHANGELOG.md` (Keep a Changelog) and semver (`0.x` until launch, `1.0.0` at launch), per `docs/commits.md` → "Versions and releases":

- **Every commit:** if the change is notable (a page, a feature, a fix a visitor would notice, a new check or tool), add one short line under `## [Unreleased]` in the right group (`Added`, `Changed`, `Fixed`, `Removed`) and stage it. Refactors, tests and docs-only commits usually aren't notable. Written for someone reading the site's history, in English, not a copy of the subject.
- **Never bump the version in an ordinary commit.** `package.json`, the lock file and the README badge change only in a release.
- **Release, only when the user asks for one:** propose the version (`minor` for new features while `0.x`; `1.0.0` at launch), then: rename `[Unreleased]` to `[x.y.z] - YYYY-MM-DD`, add a new empty `[Unreleased]` above it, update the link references at the bottom, commit that (`docs: prepare release vx.y.z`), and run `npm version x.y.z`. It bumps, rewrites the badge, commits `chore: release vx.y.z` and tags. Never push the tag without asking.

## Step 6 — Show and confirm

```text
Header:    <type>: <subject> (t-<id>)     (<N>/100 chars)
Body:      <body or "—">
Footer:    <trailers>
Changelog: <line under [Unreleased], or "none — not notable">
Staged:    <file list>
```

Wait for an explicit yes. Apply any change the user asks for and show it again.

## Step 7 — Commit

Use a heredoc so the blank lines survive:

```sh
git commit -F - <<'EOF'
<type>: <subject> (t-<id>)

<body>

<trailers>
EOF
```

If a hook rejects it, nothing was committed: fix the cause, re-stage and retry. Amend only the last commit, only while it is unpushed, and only for a fix to that same commit.

## Step 8 — Audit gate, merge and push

Never push on your own. After the commit, ask whether the branch is ready to merge. If it is:

1. **Audit gate.** If the branch is feature-sized (about 10 or more touched files against `origin/main`, not docs-only) and `/task-audit` hasn't run since the last substantial change, say so and run it first. The user can skip it explicitly.
2. **Ask before publishing.** Show the commits (`git log --oneline origin/main..HEAD`) and ask. `main` is protected (`docs/commits.md` → "Pull requests and CI"): after the user's yes, push the branch (`git push -u origin <branch>`) and open a pull request (`gh pr create`, title = the main commit's header, body = what changed and how it was verified).
3. **Merge only when CI passes and the user says so:** `gh pr checks <n> --watch`, then `gh pr merge <n> --rebase --delete-branch`, then `git switch main && git pull --ff-only`. Never merge with a failing or pending **Quality gate**, and never ask for the protection to be lifted to get a change in.
4. **The push runs the whole-project gates** (`.husky/pre-push`, tens of seconds): warn before starting it rather than after.

## Hook bypass

`--no-verify` only when the user asks for it, or a hook itself is broken (a tool crash, not a failing check). Warn and confirm first. Never to get a failing check through: CI runs the same gates.

## Out of scope

Rewriting pushed history, rebasing other branches, reverting (use `git revert`; commitlint accepts its default message), and anything in ClickUp.
