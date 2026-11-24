import { expect, test } from "bun:test";
import { appearanceSchema, emailPrefsSchema, updateProfileSchema } from "#shared/validation/user";

const validAppearance = {
  mode: "system",
  theme: "teamtask",
  customAccent: "#7C5CF6",
  customSidebar: "#1E1B3A",
  sidebarStyle: "themed",
  font: "default",
  fontSize: 16,
  radius: "default",
  reduceMotion: false,
  updatedAt: 0,
};

test("appearance accepts the defaults", () => {
  expect(appearanceSchema.safeParse(validAppearance).success).toBe(true);
});

test("appearance is strict", () => {
  expect(appearanceSchema.safeParse({ ...validAppearance, extra: 1 }).success).toBe(false);
});

test("emailPrefs rejects an unknown time zone", () => {
  expect(emailPrefsSchema.safeParse({ timeZone: "Mars/Olympus" }).success).toBe(false);
  expect(emailPrefsSchema.safeParse({ timeZone: "Africa/Lagos" }).success).toBe(true);
});

test("profile update rejects unknown keys", () => {
  expect(updateProfileSchema.safeParse({ name: "Ada", isAdmin: true }).success).toBe(false);
});
