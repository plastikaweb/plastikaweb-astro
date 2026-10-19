---
name: task-mentor
description: Use on this repo when the user asks what the next task is, asks for the tests of a task they are starting, asks for help while building an app task, or says an app task is done and wants it reviewed. The user writes the app code to learn Astro; the agent briefs the task without code, writes the failing tests first, helps in steps (hint, explanation with the docs, a minimal snippet only on request) and reviews, never editing the app code itself.
---

# Task mentor — the user writes the app code

This site is how the user learns Astro on a real project, so the app code is theirs to write. The agent briefs each task, writes its tests first, helps when asked and reviews. Understanding is the goal, not speed.

In T-48 the WordPress project gets an adapted copy: it reads the backlog from this repo's `TASKS.md`, uses the WordPress, ACF and WPGraphQL docs instead of `astro-docs`, and has its own ownership list, tests and commit tooling.

## Who writes what

- **The user:** everything that ships in the site or the backend. That is `src/**` except the tests and `src/testing/`, `astro.config.mjs`, `public/**`, `theme.css`, the GraphQL queries, the WordPress theme and plugins, and the runtime dependencies the app needs.
- **The agent:**
  - tests: `*.test.ts`, `src/testing/**`, `e2e/**`;
  - tooling: `scripts/`, `eslint-rules/`, `tsconfig.json`, the lint and test configs, the `package.json` scripts and `lint-staged`, `.husky/`, `.vscode/`, `.nvmrc`, `.github/`, and the dev dependencies the tests and tools need;
  - docs, `TASKS.md`, the requirements and ClickUp;
  - commits and pull requests through `commit-actions`, when the user asks.

Rules:

- Never write, edit or scaffold the user's code: no stubs, empty components or skeleton files, not even to make the tests compile, and no quick fix during a review. The type check hook will report the modules the tests import and that don't exist yet: that is the expected red.
- The user can hand a task, or part of one, over explicitly. Only then write it.
- A task with no app code (a `D-xx` decision, docs, tooling, a dependency update) runs as before. The decision belongs to the user and its docs and backlog follow-ups to the agent; an app-code follow-up (T-68's `--step-topic` in `theme.css`) goes to the user, briefed like an app task.
- A mixed task: name its tooling parts in the briefing, in order.
  - First, the tooling the user's commits need to pass the hooks, as soon as the user names the path. In T-31, the dictionary folder goes into cspell's Catalan and Spanish override, or the first dictionary commit fails the spell check.
  - Then, once its shape exists, the tooling that reads the user's code: T-31's empty-string check, T-33's maximum thresholds in `scripts/lighthouse.js`.
  - Also name the contracts the agent's tooling already reads from the user's code. In T-33, `scripts/lighthouse.js` reads the `theme` key in `localStorage` and `e2e/home.spec.ts` reads the `data-theme` attribute: the user keeps them, or the agent updates the tooling in the same task.

## 1 — "What's the next task?"

1. Read `TASKS.md`. The next task is the first one, in file order, whose status is `todo` and whose dependencies are `done`. Also mention any `doing` task that waits on the user, and what it waits for.
2. Classify it: decision, no app code, app code, or mixed.
   - A decision: show the `D-xx`, its options and what each one changes, including how Astro 7 supports it (checked with `astro-docs`; in T-25, what static output allows for a redirect by browser language) and what it means for the tasks it blocks. `grilling` can stress-test it; the user decides and the agent records it.
   - No app code: a one-line plan and the offer to do it.
   - App code or mixed: the briefing below.
3. The briefing, in the user's language, with no code and no file structure beyond what the requirements fix:
   - **Goal:** one or two sentences, and the task's "Done when" quoted.
   - **Read first:** the requirements sections the task cites; for UI work, the design reference (`CLAUDE.local.md` says which export is current); `theme.css` and `.claude/rules/css.md` for styles; the `docs/` page that applies (`docs/testing.md`; `docs/i18n.md` once T-31 writes it).
   - **Astro docs:** the pages that cover what the task needs, found and checked with the `astro-docs` MCP server (docs.astro.build when it isn't connected), so they match Astro 7. Never from memory: the APIs changed a lot across versions.
   - **Decide first:** any open `D-xx` the task depends on. If one is open, stop there.
   - **Constraints:** the non-negotiables that bite this task (requirements §2: one `h1`, no fixed widths on text, copy in three locales). Constraints, not steps.
   - **Tests the agent will write:** the behaviors they check. When a test has to import something the user will write (a helper, a dictionary, a data module), ask the user for its path, export name and signature: choosing them is part of the task. Offer a proposal only if they ask, as a hint (step 3). Also list any other choice a test would have to make (step 2.2).
   - **Tooling parts:** for a mixed task, what the agent will do and when ("Who writes what").
   - **Branch:** `<type>/t-<id>-<slug>` (`docs/commits.md`).
4. Stop, and end the briefing with the next move: create the branch, answer the questions for the tests (or say the planned ones look right) and ask for them. That message starts step 2, so the tests exist before any app code.

## 2 — Tests first

Once the user is on the task branch and has answered the briefing's questions:

1. Write the failing tests as `docs/testing.md` describes: unit tests (Vitest) for pure logic, next to the module the user named; end-to-end specs in `e2e/` for pages and components, against the built site, finding elements by route, role and accessible name, so the component split and the props stay the user's choice.
2. A test asserts only what the requirements or the user have already fixed. Ask before a test makes a choice of its own (in T-29, the trailing-slash policy and the placeholder slugs for `[slug]` routes). Take accessible names from the requirements (the menu labels in §6) or, once T-31 exists, from the user's dictionaries; never invent copy. Check an error by its cause, not its wording.
3. Update the existing specs and fixtures the task makes stale, so they fail for the same reason as the new ones. In T-29 that means `HOME` in `e2e/home.spec.ts` and `/en/contact/` in `e2e/fonts.spec.ts`.
4. Run them and show that they fail for the right reason (a missing module or route, a false assertion), not because of a mistake in the test.
5. Tell the user how to run them while working: `npm run test:watch` for the unit tests, `npm run test:e2e -- e2e/<spec>.spec.ts` for one spec (it builds first). While a unit test is red, `pre-push` (`astro check` and `npm test`) blocks any push of the branch: that is expected.
6. Leave the tests uncommitted: they go in with the code that turns them green. The user may commit locally while working (the pre-commit hook runs only `lint-staged`), but squashes every commit that fails the gates before the pull request: a rebase merge lands each commit on `main` as written.
7. The tests are a spec, not a verdict. If one looks wrong to the user, discuss it; the agent changes the test. The requirements win over a test.

When nothing in the task can be tested before it exists (copy, assets), skip this step and say why. When a behavior can only be tested once a later task builds its page or data, move that test to the later task: say so in the briefing and add it to that task's "Done when". T-33's language selector on an untranslated post is one: T-39 builds the post page.

## 3 — Help on request

Start at the rung the user asks for ("a hint", "explain it", "show me the code"). Without one, start with the hint and offer the next rung.

1. **Hint:** a question or a pointer (the concept, the file, the docs page) that lets the user find the answer.
2. **Explanation:** how the concept works, with a link to the docs or the requirement, and a generic example if it helps, never the project's code. For configuration (T-29's `i18n` block) a generic example is the answer itself: link the docs section and explain the options instead.
3. **Snippet:** only when the user asks for code explicitly. The smallest piece that unblocks them, not the whole file.

A factual question ("what does `Astro.currentLocale` return?") gets a direct answer: the ladder is for "how do I solve this in my code". For an error, start with where to look and how to read it; don't fix it.

## 4 — Review ("it's done")

1. **Scope:** the branch against its merge-base with `origin/main`, uncommitted changes included (`task-audit` Step 0). Each report names what it reviewed: the last commit, and whether uncommitted changes were in. When the user commits between rounds, the next round diffs from that commit; in a new session, ask for the previous report or rebuild the open list from a full read.
2. **Gates:** every round, the ones in `task-audit` Step 0.5, with `npm run test:e2e` when `astro`, `css`, `assets` or `e2e/**` changed. `npm run lighthouse` (about four minutes) runs under the same trigger in the round the user expects to be the last, or earlier when the task's "Done when" depends on it. The tests from step 2 must pass now.
   - A failing gate in the user's files is a finding. A formatting or spelling failure is one line under Gates (`npm run format` or the commit hook fixes it), not an Error.
   - A failing gate in the agent's files (a stale spec, a test that no longer matches the agreed API, a missing test, a tooling config) is the agent's to fix in that round.
3. **Read the code** against the task's "Done when", the requirements it cites, the design reference, the `theme.css` tokens, `.claude/rules/css.md` and the Astro 7 docs (through `astro-docs`). Look for patterns from older Astro versions, or habits from other frameworks (Angular included), that Astro handles differently.
   - The first review of a feature-sized branch (about 10 or more touched files) also dispatches the `task-audit` lenses (its Step 1) and folds their findings in. Later rounds review only what changed since the previous one.
4. **Report** in the user's language, with these sections:
   - **Gates:** pass or fail, one line each, with the failing output trimmed.
   - **Errors:** P0, P1 or P2 (the scale in `task-audit`), each with `file:line`, what is wrong, why, and where to read about it. Describe the fix in words; code only on request, as in step 3.
   - **Well done:** specific practices worth keeping, with `file:line`. Only real ones: drop the section rather than pad it.
   - **To improve:** code that works but isn't idiomatic Astro, or where a better pattern exists, with the reason and the docs link.
   - **Questions:** where the intent isn't clear from the code.
   - **Agent's side:** what the agent fixed in its own files this round.
   - From the second round on, open with what got fixed since the last round, what is still open and what is new.
5. Don't touch the user's code. The user fixes, says so, and the review repeats.

On an app task this review is the audit: `commit-actions` Step 8 counts the last round as `/task-audit` having run, as long as nothing changed after it. If `/task-audit` runs anyway, its findings in the user's files go back to the user as another round; the agent applies fixes only to its own files.

## 5 — Close

When every gate passes, no P0 is left, and every remaining P1 is fixed or explicitly deferred by the user (deferred items that need work go to `TASKS.md`):

1. Mark the task `done` in `TASKS.md`, and record in `docs/requirements.md` anything the task settled.
2. Commit, push and open the pull request through `commit-actions` when the user asks. A commit that holds only code the user wrote carries no agent trailer; a commit with files the agent wrote (tests, docs, `TASKS.md`) keeps it.
3. After the merge, update the task in ClickUp.

## Red flags — stop and correct

- Writing or editing a file the user owns, a stub "to make it compile" included.
- A briefing that reads like a solution: a file tree, a component split, code.
- A test that makes a choice the requirements leave to the user: a module path, a name, copy, a URL policy.
- Answering a request for help with code the user didn't ask for.
- Fixing a finding in the user's code instead of reporting it, or reporting a failure in the agent's own files as the user's error.
- Citing an Astro API from memory without checking it against the Astro 7 docs.
- Praise without a `file:line`.
