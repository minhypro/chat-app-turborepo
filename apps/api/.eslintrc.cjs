/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/node.js'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: './', // Add this line to specify the root directory of the tsconfig.json file
  },
  ignorePatterns: ['.eslintrc.cjs'], // Add this line to exclude the .eslintrc.cjs file from ESLint's list of included files
  rules: {
    'no-unused-vars': [1, { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
};
