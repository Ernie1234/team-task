import { expect, test } from "bun:test";
import { createWorkspaceSchema, updateWorkspaceSchema } from "#shared/validation/workspace";

test("empty description is accepted", () => {
  expect(createWorkspaceSchema.safeParse({ name: "Team", description: "" }).success).toBe(true);
});

test("name is required and trimmed", () => {
  expect(createWorkspaceSchema.safeParse({ name: "   " }).success).toBe(false);
  expect(createWorkspaceSchema.parse({ name: "  Team " }).name).toBe("Team");
});

test("update allows a partial body", () => {
  expect(updateWorkspaceSchema.safeParse({ description: "New" }).success).toBe(true);
});
