// @ts-check

/** @type {import("prettier").Config} */

module.exports = {
  printWidth: 130,
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    // 1. Core frameworks
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "",

    // 2. Third-party modules
    "<THIRD_PARTY_MODULES>",

    "",

    // 3. Type & config layers
    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "",

    // 4. Core utilities and logic
    "^@/lib/(.*)$",
    "^@/utils/(.*)$",
    "^@/constants$", // global constants
    "^@/hooks/(.*)$",
    "",

    // 5. Third-party adapters/framework logic
    "^@/rjsf$",
    "^@/store$",
    "",

    // 6. UI components
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "",

    // 7. Global configuration/styling
    "^@/registry/(.*)$",
    "^@/styles/(.*)$",
    "",

    // 8. App-specific logic
    "^@/app/(.*)$",

    "",

    // 9. Relative imports
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
};
