import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "test-results/",
      "playwright-report/",
      "blob-report/",
      "playwright/.cache/",
      ".playwright/",
      ".playwright-cli/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    // Playwright fixtures with no dependencies must destructure `{}`
    files: ["lib/fixtures/**/*.ts"],
    rules: { "no-empty-pattern": "off" },
  },
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      // POM assertion helpers count as assertions
      "playwright/expect-expect": [
        "warn",
        { assertFunctionNames: ["checkPageUrl"] },
      ],
    },
  },
);
