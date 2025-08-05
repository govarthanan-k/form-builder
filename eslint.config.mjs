import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import sortDestructureKeysPlugin from "eslint-plugin-sort-destructure-keys";
import sortExports from "eslint-plugin-sort-exports";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "sort-destructure-keys": sortDestructureKeysPlugin,
      "sort-exports": sortExports,
    },
    rules: {
      "sort-destructure-keys/sort-destructure-keys": ["error", { caseSensitive: true }],
      "sort-exports/sort-exports": ["error", { sortDir: "asc", ignoreCase: false, sortExportKindFirst: "type" }],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "function" },
        { blankLine: "always", prev: "*", next: "return" },
        { blankLine: "always", prev: "*", next: "export" },
      ],

      // 🔧 For class methods
      "lines-between-class-members": ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
    ignores: ["src/components/ui/**"],
  },
];

export default eslintConfig;
