# Lens: docs — requirements, TASKS, docs/, README and changelog

You verify that the prose still tells the truth about what the branch changed. You're dispatched when docs or config changed, or a script, hook or convention moved: that's how docs go stale.

## Already mechanical (input, not work)

markdownlint on every Markdown file (in-file heading fragments included) and Prettier. Neither checks links across files or whether a claim is true: that's you.

## Judgement checks

1. **Requirements.** A decision taken on the branch is recorded in `docs/requirements.md`, the matching `D-xx` in §12 is closed, and §14 has a history line. Nothing in the requirements contradicts the code now.
2. **TASKS.md.** The task's status is updated; its "Done when" is actually met (each clause, checked against the code); dependencies and order still hold for the tasks the change affects.
3. **`docs/*.md` vs. the code.** `code-quality.md` tables vs. `eslint.config.js` and `stylelint.config.js`; `testing.md` vs. `vitest.config.ts`, `playwright.config.ts` and the specs; `commits.md` vs. `.husky/`, `commitlint.config.js` and the release scripts.
4. **CLAUDE.md.** Commands, "Current state of the code", "Agent guardrails" and "Recommended skills" paragraphs affected by the change are updated, and nothing there points to a removed file or script.
5. **README.md.** The command table matches `package.json` scripts; the version badge is handled by `version:check`, not by you.
6. **CHANGELOG.md.** A notable change has a line under `[Unreleased]`: short, in English, written for someone reading the site's history (not a copy of the commit log); no forward references to unshipped tasks.
7. **Links.** Relative links and `file:line` references in touched docs resolve to files that exist.
8. **Deleted or renamed files.** Grep each old path across `README.md`, `docs/`, `CLAUDE.md`, `TASKS.md` and `.claude/`: no dangling reference.
9. **Language.** Committed docs are in English; prose is plain and concrete.
