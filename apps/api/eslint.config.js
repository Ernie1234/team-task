import tseslint from "typescript-eslint";

// Only the import rule for now; the full recommended set can come later
export default tseslint.config(
  { ignores: ["dist", "node_modules", "logs", "uploads"] },
  {
    files: ["src/**/*.ts"],
    languageOptions: { parser: tseslint.parser },
    rules: {
      // Import through the @/ alias (@/services/task-service), never ./ or ../
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: "^\\.{1,2}/", message: "Use the @/ alias, e.g. @/services/task-service." }] },
      ],
    },
  },
);
