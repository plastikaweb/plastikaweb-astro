---
name: task-audit
description: Use when a task branch is functionally complete and about to be merged or turned into a pull request, and it is feature-sized (about 10 or more touched files, not docs-only). Runs the mechanical gates, then one read-only audit-lens agent per relevant lens, and ends with one deduplicated report for the user to triage. Not for one-file fixes or docs-only branches — review those inline.
---

# Task audit — review of a task branch before it reaches `main`

Audits only what the branch touched. Principle: **tools prove, agents interpret.** Everything with a binary answer runs as a command first; the lens agents get those results as facts and spend their tokens on judgement. The audit ends with findings triaged by the user, approved fixes committed and the gates green.

Don't run it on trivial branches: the fan-out costs real tokens and only pays off on feature-sized work.

## Step 0 — Resolve the scope

Branches start from `main` (`docs/commits.md`). Compare the working tree against the merge-base, so committed, staged, unstaged and untracked changes are all in scope and deleted files drop out:

```sh
BASE=$(git merge-base HEAD origin/main)
{ git diff --name-only --diff-filter=d "$BASE"; git ls-files --others --exclude-standard; } | sort -u
```

Partition the files:

| Partition | Files                                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `astro`   | `src/**/*.astro`                                                                                                                                  |
| `ts`      | `*.ts`, `*.js`, `*.mjs` outside tests (`src/`, `scripts/`, `eslint-rules/`, `*.config.*`, `.claude/hooks/`)                                       |
| `css`     | `src/**/*.css` (styles inside `.astro` files count through `astro`)                                                                               |
| `tests`   | `*.test.ts`, `e2e/**`                                                                                                                             |
| `i18n`    | UI string dictionaries and i18n helpers (T-31), locale-dependent content and mock data under `src/data/`                                          |
| `docs`    | `*.md`                                                                                                                                            |
| `config`  | `package.json`, `package-lock.json`, `astro.config.*`, `tsconfig.json`, `.github/**`, `public/_headers`, `public/_redirects`, `public/robots.txt` |
| `assets`  | `public/**` other than the above                                                                                                                  |

**Stacked branch?** If this branch sits on another unmerged branch, use that branch's HEAD as `BASE` and say so: auditing the parent is the parent's job.

Show the user the base, the file count and the partition before dispatching anything.

## Step 0.5 — Mechanical gates (main thread, once)

Run them all (each takes seconds) and keep the output: it goes to the lenses verbatim.

```sh
npm run format:check
npm run lint
npm run lint:css
npm run css:check
npm run lint:md
npm run check
npm test
npm run test:eslint-rules
npm run version:check
npm run build
```

When `astro`, `css` or `e2e/**` changed, also run `npm run test:e2e` (build, preview and Playwright with axe, both themes, 375 and 1440 px). It opens a local port: inside a sandbox that blocks it, say so and ask instead of skipping it silently.

What these tools report is settled. Agents don't re-verify it or re-derive rules the tools enforce (`docs/code-quality.md`, `docs/testing.md` list them). A failure in a file the branch touched is already a finding; carry it into the report as P0.

## Step 1 — Dispatch the lenses in parallel

One message, one `audit-lens` agent per lens whose trigger holds. Skip the rest.

`audit-lens` (`.claude/agents/audit-lens.md`) has no write tools, so a lens can't touch the tree, and it pins a cheaper model: the fan-out is up to ten agents, each re-reading the project context. If a lens comes back thin on a branch you know has depth, re-dispatch that one lens with `model: "opus"`.

| Lens                                                    | File                    | Dispatch when                                                                                                                               |
| ------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Code — TypeScript, Astro components, data layer         | `lenses/code.md`        | `ts` or `astro` non-empty                                                                                                                   |
| Styles — tokens, modern CSS, themes                     | `lenses/styles.md`      | `css` non-empty, or an `astro` file with a `<style>` block                                                                                  |
| Accessibility — WCAG 2.2 AA                             | `lenses/a11y.md`        | `astro` non-empty, or client scripts changed                                                                                                |
| Docs — requirements, TASKS, docs/, README, changelog    | `lenses/docs.md`        | `docs` or `config` non-empty, or a script, hook or convention changed                                                                       |
| i18n — three locales, localized routes                  | `lenses/i18n.md`        | `i18n` non-empty, or `astro`/`ts` under `src/pages`, `src/layouts`, `src/components` changed                                                |
| UX — hierarchy, states, fidelity to the design          | `lenses/ux.md`          | `astro` or `css` under `src/pages`, `src/layouts`, `src/components` changed                                                                 |
| Tests — coverage of the change                          | `lenses/tests.md`       | `ts` with logic (`src/lib/`, `scripts/`, `eslint-rules/`) or pages changed                                                                  |
| Security — headers, sinks, secrets, dependencies, forms | `lenses/security.md`    | `config` non-empty, a form changed, or a touched file matches `set:html\|innerHTML\|import.meta.env\|fetch(\|localStorage\|target="_blank"` |
| SEO — metadata, hreflang, structured data               | `lenses/seo.md`         | `src/pages/**` or `src/layouts/**` changed, or `astro.config.*`, `robots.txt`, redirects                                                    |
| Performance — JS, fonts, images, Core Web Vitals        | `lenses/performance.md` | `astro` or `css` changed, a client script or `client:*` directive added, `assets` or dependencies changed                                   |

Every agent gets this prompt (fill the brackets; nothing else):

> Repository: `<absolute repo path>`. Base commit: `<BASE>`. Work off the working tree — uncommitted changes are in scope.
> Read `<absolute path>/.claude/skills/task-audit/lenses/<lens>.md` first and follow it exactly.
> Files in your scope: `<list for this lens>`.
> Mechanical facts already verified by tools (input, not something to re-check): `<relevant Step 0.5 output, or "all gates passed">`.
> Report contract — return ONLY this:
>
> ```text
> ## <lens> — <N> findings (P0 <x> / P1 <y> / P2 <z>)
> - `path/file.ext:LINE` — P0|P1|P2 — <issue, one sentence> — fix: <one or two concrete sentences>
> …
> Unverified: <`file:line` items you could not confirm in the code, or "none">
> ```
>
> Verify every claim at its `file:line` in the actual code before reporting it. Don't restate rules the tools already enforce. Prefer fewer, confirmed findings over volume.

**Severity** (agents and triage use the same scale; it is the P0/P1 convention in `CLAUDE.md`):

| Severity | Means                                                                                                                                                                                                                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Blocks the merge: a failing gate; user-visible defect or regression; silent no-op (undefined token, missing translation rendering a key); WCAG failure (unnamed control, keyboard trap, lost focus, AA contrast); security exposure; a non-negotiable from requirements §2 broken; a doc that lies |
| P1       | Fix before merging unless the user defers it: convention violation with maintenance cost, missing test for real logic, stale doc paragraph, a11y or UX degradation, SEO or performance regression that stays under the budget                                                                      |
| P2       | Nits: naming, ordering, micro-simplifications, polish                                                                                                                                                                                                                                              |

A finding's identity is its `file:line`. Two lenses reporting the same `file:line` are one finding.

## Step 2 — Triage (main thread; no fixes yet)

1. Merge the gate failures and every lens report; deduplicate by `file:line` (a11y, UX and styles overlap a lot), keeping the highest severity.
2. Re-verify every P0 and P1 at its `file:line` yourself: agents overclaim. Drop or downgrade what doesn't hold.
3. Findings that depend on an open `D-xx` become questions, not fixes.
4. Present ONE report grouped by file: severity, lens, `file:line`, issue, proposed fix, and a fix/skip recommendation each.
5. Wait for the user's triage. Don't touch code before it.

## Step 3 — Apply approved fixes

- Batch them into a few cohesive commits through the `commit-actions` skill, never one commit per tweak.
- Anything that changes a shared component's props, moves files or touches `theme.css` tokens needs an explicit go-ahead beyond the triage.
- Re-run the Step 0.5 gates until they pass.

## Step 4 — Hand off

The audit is done when the findings are triaged, the approved fixes are committed, every gate passes and the user has the final summary: what was fixed, what was deferred and why. Keep that list; deferred items go to `TASKS.md` if they need a task. Merging and pushing stay with `commit-actions` and the user.

## Red flags — stop and correct

- Dispatching a lens whose trigger doesn't hold ("just in case").
- A lens report that restates tool rules or re-checks tool output: send it back with the mechanical facts.
- Findings without `file:line`, or a fix naming a token, prop or API you didn't confirm exists.
- Editing code before the user's triage.
- Auditing files the branch didn't touch.
