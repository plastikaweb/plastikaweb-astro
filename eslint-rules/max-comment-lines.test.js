// Fixtures for the local `max-comment-lines` rule: `npm run test:eslint-rules`.

import { describe, it } from "node:test";

import { RuleTester } from "eslint";

import rule from "./max-comment-lines.js";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: "module" },
});

const options = [{ max: 5 }];

ruleTester.run("max-comment-lines", rule, {
  valid: [
    {
      name: "a block comment at exactly the limit",
      options,
      code: `
/**
 * one
 * two
 * three
 * four
 * five
 */
export const a = 1;
`,
    },
    {
      name: "JSDoc tag lines do not count, so a documented signature is never penalised",
      options,
      code: `
/**
 * one
 * two
 * three
 * @param a first
 * @param b second
 * @param c third
 * @param d fourth
 * @returns something
 */
export function f(a, b, c, d) {
  return [a, b, c, d];
}
`,
    },
    {
      name: "blank lines and bare gutters are not text",
      options,
      code: `
/**
 * one
 *
 * two
 *
 * three
 *
 * four
 *
 * five
 */
export const b = 2;
`,
    },
    {
      name: "directive comments are never counted, however long the run",
      options,
      code: `
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-undef
// eslint-disable-next-line no-console
// @ts-expect-error deliberate
// prettier-ignore
// istanbul ignore next
const c = 3;
`,
    },
    {
      name: "two short runs separated by code are two blocks, not one",
      options,
      code: `
// one
// two
// three
const d = 4;
// four
// five
// six
const e = 5;
`,
    },
    {
      name: "the default limit is 5 when no options are given",
      code: `
// one
// two
// three
// four
// five
const g = 6;
`,
    },
  ],
  invalid: [
    {
      name: "a block comment one line over the limit",
      options,
      code: `
/**
 * one
 * two
 * three
 * four
 * five
 * six
 */
export const f1 = 1;
`,
      errors: [{ messageId: "tooLong", data: { count: "6", max: "5" } }],
    },
    {
      name: "a run of consecutive line comments accumulates across the run",
      options,
      code: `
// one
// two
// three
// four
// five
// six
const g = 7;
`,
      errors: [{ messageId: "tooLong" }],
    },
    {
      name: "JSDoc prose over the limit is still reported despite the tags",
      options,
      code: `
/**
 * one
 * two
 * three
 * four
 * five
 * six
 * @param a first
 * @returns something
 */
export function h(a) {
  return a;
}
`,
      errors: [{ messageId: "tooLong", data: { count: "6", max: "5" } }],
    },
    {
      name: "countTagLines makes tag lines count",
      options: [{ max: 5, countTagLines: true }],
      code: `
/**
 * one
 * two
 * three
 * @param a first
 * @param b second
 * @returns something
 */
export function k(a, b) {
  return a + b;
}
`,
      errors: [{ messageId: "tooLong", data: { count: "6", max: "5" } }],
    },
  ],
});
