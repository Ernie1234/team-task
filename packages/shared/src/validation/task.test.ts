import { expect, test } from "bun:test";
import { createTaskBodySchema, taskParamsSchema, updateTaskBodySchema } from "#shared/validation/task";

const ID = "64b7f0c2a1b2c3d4e5f60718";

test("dueDate '' and null clear the date", () => {
  expect(updateTaskBodySchema.parse({ dueDate: "" }).dueDate).toBeNull();
  expect(updateTaskBodySchema.parse({ dueDate: null }).dueDate).toBeNull();
});

test("dueDate string becomes a Date", () => {
  expect(updateTaskBodySchema.parse({ dueDate: "2026-12-01" }).dueDate).toBeInstanceOf(Date);
});

test("params reject a 12-char id", () => {
  expect(taskParamsSchema.safeParse({ workspaceId: "abcdefghijkl", projectId: ID }).success).toBe(false);
  expect(taskParamsSchema.safeParse({ workspaceId: ID, projectId: ID }).success).toBe(true);
});

test("create needs a title and rejects an unknown status", () => {
  expect(createTaskBodySchema.safeParse({ title: " " }).success).toBe(false);
  expect(createTaskBodySchema.safeParse({ title: "Ship", status: "LATER" }).success).toBe(false);
  expect(createTaskBodySchema.safeParse({ title: "Ship", status: "TODO", description: "" }).success).toBe(true);
});
