import { expect, test } from "bun:test";
import { createProjectSchema, projectIdSchema } from "#shared/validation/project";

const ID = "64b7f0c2a1b2c3d4e5f60718";

test("empty description is accepted", () => {
  expect(createProjectSchema.safeParse({ name: "Site", description: "", workspace: ID, createdBy: ID }).success).toBe(true);
});

test("project id must be 24-char hex", () => {
  expect(projectIdSchema.safeParse("abcdefghijkl").success).toBe(false);
});
