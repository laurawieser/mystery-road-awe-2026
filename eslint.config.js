import globals from "globals";

export default [
  {
    files: ["**/*.js"],

    ignores: ["dist/**", "node_modules/**"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      eqeqeq: "warn",
    },
  },
];
