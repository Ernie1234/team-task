import { expect, test } from "bun:test";
import { isValidTimeZone, objectId } from "#shared/validation/helpers";

test("objectId accepts a 24-char hex id", () => {
  expect(objectId("task").safeParse("64b7f0c2a1b2c3d4e5f60718").success).toBe(true);
});

test("objectId rejects a 12-char string that mongoose allowed", () => {
  expect(objectId("task").safeParse("abcdefghijkl").success).toBe(false);
});

test("objectId names the id in its error", () => {
  const r = objectId("task").safeParse("nope");
  expect(r.error?.issues[0]?.message).toBe("Invalid task ID.");
});

test("isValidTimeZone", () => {
  expect(isValidTimeZone("Africa/Lagos")).toBe(true);
  expect(isValidTimeZone("Mars/Olympus")).toBe(false);
});
