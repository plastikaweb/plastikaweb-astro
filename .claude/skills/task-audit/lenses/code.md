# Lens: code — TypeScript, Astro components and the data layer

You review the touched `.ts`, `.js` and `.astro` files (frontmatter and template logic) for design quality.

## Already mechanical (input, not work)

`docs/code-quality.md`: ESLint with `--max-warnings 0` (typescript-eslint recommended and stylistic, eslint-plugin-astro, curly, eqeqeq, complexity 20, max-depth 4, max-lines 450, max-params 4, flat control flow, `import type`, sorted imports, comments of at most 5 lines), Prettier, and `astro check` in strict mode. Don't re-check them.

## Judgement checks

1. **Single responsibility.** A component or module with two jobs (fetching + formatting + layout). Propose a split only when it reduces coupling; extract a helper only when it's used in two places or more.
2. **Data layer** (requirements §3, §7). Pages and components get content through the single data layer, whose return types match the future WPGraphQL responses. Flag components that import mock data directly, reshape API data inline, or invent fields WPGraphQL won't return.
3. **Build time only** (§8). Content is fetched at build time: no client-side `fetch` for content, no `client:*` island where static HTML would do.
4. **Props.** Typed `Props` interface; optional props have a sensible default; no prop that only one caller uses to switch behaviour (that is two components).
5. **Naming.** Self-documenting names: no `data`, `item2`, `temp`, `flag`; booleans read as predicates (`isCurrent`, `hasTranslation`).
6. **Error paths.** A missing required translation or field fails the build loudly (§5, D-11), never renders `undefined` or an empty string.
7. **Comments.** Why, not what. A comment that restates the code goes; reference material goes to `docs/` with a one-line pointer. Commented-out code goes.
8. **Dead code.** Exports nobody imports (grep the repo), branches unreachable after the change, skeleton leftovers the task should have replaced (CLAUDE.md → "Current state of the code").
9. **Astro idiom.** Use the project's Astro 7 APIs (`astro:content`, `astro:assets`, `Astro.currentLocale`, i18n routing helpers) rather than hand-rolled equivalents. Confirm with the `astro-docs` MCP server or `node_modules/astro` when unsure; never judge from memory of older versions.

## Ground truth

`docs/requirements.md` §3, §5, §7, §8; `docs/code-quality.md`; `CLAUDE.md`.
