module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["standard-with-typescript", "prettier"],
  overrides: [],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    ecmaVersion: "latest",
  },
  rules: {},
};
