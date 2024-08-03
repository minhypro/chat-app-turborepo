const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true,
  },
  plugins: ["only-warn", "simple-import-sort"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    "dist/",
    ".*.js",
    "node_modules/",
  ],
  overrides: [{ files: ["*.js", "*.ts"] }],
};
