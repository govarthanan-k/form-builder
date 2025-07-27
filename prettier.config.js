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
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "",

    "<THIRD_PARTY_MODULES>",
    "",

    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "",

    "^@/rjsf$",
    "",

    "^@/store$",
    "^@/lib/(.*)$",
    "^@/utils/(.*)$",
    "^@/constants$",
    "^@/hooks/(.*)$",
    "",

    "^types$",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "",

    "^@/registry/(.*)$",
    "^@/styles/(.*)$",
    "",

    "^@/app/(.*)$",
    "",

    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
};
