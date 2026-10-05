// @ts-check

/*
 * Local rule: a comment block may hold at most `max` lines of prose. A block is
 * one block comment or a run of line comments on consecutive lines. Delimiters,
 * bare `*` gutters, blank lines and JSDoc tag lines don't count; directive
 * comments (`eslint-*`, `@ts-*`, `prettier-ignore`, coverage pragmas) are skipped.
 */

/** @typedef {import('estree').Comment & { range: [number, number]; loc: import('estree').SourceLocation }} LocatedComment */
/** @typedef {{ start: LocatedComment; end: LocatedComment; lines: number }} CommentBlock */

const DIRECTIVE =
  /^\s*(eslint|@ts-|prettier-ignore|global\b|exported\b|istanbul|v8 |c8 )/;

/**
 * Text lines in a comment once markers are stripped; tag lines only count
 * when `countTagLines` is true, because the rule targets prose, not signatures.
 * @param {LocatedComment} comment
 * @param {boolean} countTagLines
 * @returns {number}
 */
function textLineCount(comment, countTagLines) {
  return comment.value.split("\n").filter((line) => {
    const text = line.replace(/^\s*\*+\s?/, "").trim();
    return text !== "" && (countTagLines || !text.startsWith("@"));
  }).length;
}

/**
 * True when only whitespace separates two consecutive comments.
 * @param {import('eslint').SourceCode} sourceCode
 * @param {LocatedComment} previous
 * @param {LocatedComment} next
 * @returns {boolean}
 */
function onlyWhitespaceBetween(sourceCode, previous, next) {
  return sourceCode.text.slice(previous.range[1], next.range[0]).trim() === "";
}

/**
 * Groups comments into blocks: each block comment alone, consecutive line comments together.
 * @param {import('eslint').SourceCode} sourceCode
 * @param {boolean} countTagLines
 * @returns {CommentBlock[]}
 */
function collectBlocks(sourceCode, countTagLines) {
  /** @type {CommentBlock[]} */
  const blocks = [];
  /** @type {CommentBlock | null} */
  let run = null;

  for (const raw of sourceCode.getAllComments()) {
    const comment = /** @type {LocatedComment} */ (raw);
    if (DIRECTIVE.test(comment.value)) {
      run = null;
      continue;
    }
    const lines = textLineCount(comment, countTagLines);
    if (comment.type === "Block") {
      blocks.push({ start: comment, end: comment, lines });
      run = null;
      continue;
    }
    if (
      run !== null &&
      comment.loc.start.line === run.end.loc.end.line + 1 &&
      onlyWhitespaceBetween(sourceCode, run.end, comment)
    ) {
      run.end = comment;
      run.lines += lines;
      continue;
    }
    run = { start: comment, end: comment, lines };
    blocks.push(run);
  }
  return blocks;
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce a maximum number of prose lines per comment block (JSDoc included).",
    },
    schema: [
      {
        type: "object",
        properties: {
          max: { type: "integer", minimum: 1 },
          countTagLines: { type: "boolean" },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      tooLong:
        "Comment block has {{count}} lines of text (max {{max}}). Keep the why in one short note; " +
        "move long explanations to docs/ and link them, or split the code so it explains itself.",
    },
  },

  create(context) {
    const options = context.options[0] ?? {};
    const max = options.max ?? 5;
    const countTagLines = options.countTagLines === true;

    return {
      Program() {
        for (const block of collectBlocks(context.sourceCode, countTagLines)) {
          if (block.lines > max) {
            context.report({
              loc: { start: block.start.loc.start, end: block.end.loc.end },
              messageId: "tooLong",
              data: { count: String(block.lines), max: String(max) },
            });
          }
        }
      },
    };
  },
};
