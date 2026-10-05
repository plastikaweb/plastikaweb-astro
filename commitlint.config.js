// Conventional Commits with the project's type list (requirements §13.2, docs/commits.md).

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 500],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [2, "always"],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
      ],
    ],
  },
};
