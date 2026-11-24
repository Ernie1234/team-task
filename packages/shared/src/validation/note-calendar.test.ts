import { expect, test } from "bun:test";
import { noteIdSchema, updateNoteSchema } from "#shared/validation/note";
import { createEventSchema, eventIdSchema, updateEventSchema } from "#shared/validation/calendar";

test("note and event ids reject a 12-char string", () => {
  expect(noteIdSchema.safeParse("abcdefghijkl").success).toBe(false);
  expect(eventIdSchema.safeParse("abcdefghijkl").success).toBe(false);
});

test("note and event updates reject unknown keys", () => {
  expect(updateNoteSchema.safeParse({ title: "x", owner: "me" }).success).toBe(false);
  expect(updateEventSchema.safeParse({ title: "x", owner: "me" }).success).toBe(false);
});

test("an event can't end before it starts", () => {
  const r = createEventSchema.safeParse({ title: "Standup", start: "2026-12-01T10:00:00Z", end: "2026-12-01T09:00:00Z" });
  expect(r.success).toBe(false);
});
