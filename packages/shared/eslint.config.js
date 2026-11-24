import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["src/**/*.ts"],
    rules: {
      // Shared code must stay runtime-neutral: no app, React or server imports
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/*", "mongoose", "express", "react", "react-*", "socket.io*", "axios"],
              message: "Shared code runs in every app: no app aliases, React or server packages.",
            },
            // Import through #shared/… (resolved by this package.json), never ./ or ../
            { regex: "^\\.{1,2}/", message: "Use #shared/…, e.g. #shared/validation/helpers." },
          ],
        },
      ],
    },
  },
);
