# Commits, hooks and branches

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

| Hook         | Runs                                                                                       | Cost                      |
| ------------ | ------------------------------------------------------------------------------------------ | ------------------------- |
| `pre-commit` | lint-staged on the staged files only: ESLint, Stylelint, markdownlint fixes, then Prettier | Seconds                   |
| `commit-msg` | commitlint on the message                                                                  | Instant                   |
| `pre-push`   | The whole-project gates: `lint`, `lint:css`, `css:check`, `check`, `build`, unit tests     | Tens of seconds, per push |

The whole-project gates run on push rather than on commit: a branch with ten commits pays for them once. lint-staged only sees staged files, so `pre-push` also catches what a change breaks elsewhere (an import left orphaned in an untouched file).

## Branches

- `main` is always releasable. Work happens on short-lived branches named `<type>/t-<id>-<slug>`, e.g. `chore/t-13-git-hooks`, merged with a fast-forward or a pull request once T-19 protects `main`.
- No `release` branch: every pull request gets a preview deploy (T-23).

## Skipping hooks

`--no-verify` skips the local hooks. It is acceptable only when the hook itself is broken (a tool crash, not a failing check) or for a throwaway local commit that will be amended or squashed before pushing. Never use it to push a change that fails a check: CI runs the same gates and will reject it, and fixing the code is cheaper than arguing with the gate.
