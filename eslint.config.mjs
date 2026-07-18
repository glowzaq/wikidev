import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname ensures relative module paths are resolved correctly
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "next/typescript"
    ],
    settings: {
      next: {
        // Points ESLint to the correct root folder
        rootDir: ".",
      },
    },
  }),
];

export default eslintConfig;