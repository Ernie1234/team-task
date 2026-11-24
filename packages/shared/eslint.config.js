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
        { patterns: ["@/*", "mongoose", "express", "react", "react-*", "socket.io*", "axios"] },
      ],
    },
  },
);
