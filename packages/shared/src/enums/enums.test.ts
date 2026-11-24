import { expect, test } from "bun:test";
import { Permissions, Roles, TaskPriorityEnum, TaskStatusEnum } from "./index";

test("task status values", () => {
  expect(Object.values(TaskStatusEnum)).toEqual(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]);
});

test("task priority values", () => {
  expect(Object.values(TaskPriorityEnum)).toEqual(["LOW", "MEDIUM", "HIGH"]);
});

test("roles and a permission", () => {
  expect(Object.values(Roles)).toEqual(["OWNER", "ADMIN", "MEMBER"]);
  expect(Permissions.CHANGE_MEMBER_ROLE).toBe("CHANGE_MEMBER_ROLE");
});
