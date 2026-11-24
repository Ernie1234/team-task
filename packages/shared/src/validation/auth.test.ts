import { expect, test } from "bun:test";
import { forgotPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema, verifyEmailSchema } from "./auth";

test("sign-up password needs 8 characters", () => {
  const r = signUpSchema.safeParse({ name: "A", email: "a@b.co", password: "short" });
  expect(r.success).toBe(false);
  expect(r.error?.issues[0]?.path).toEqual(["password"]);
  expect(r.error?.issues[0]?.message).toBe("Use at least 8 characters");
});

test("sign-up accepts a valid account", () => {
  expect(signUpSchema.safeParse({ name: "Ada", email: "ada@b.co", password: "longenough" }).success).toBe(true);
});

test("sign-in needs an email and a password", () => {
  expect(signInSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  expect(signInSchema.safeParse({ email: "a@b.co", password: "" }).success).toBe(false);
  expect(signInSchema.safeParse({ email: " a@b.co ", password: "x" }).success).toBe(true);
});

test("reset confirm must match, error on confirm", () => {
  const r = resetPasswordSchema.safeParse({ otp: "123456", password: "longenough", confirm: "different" });
  expect(r.success).toBe(false);
  expect(r.error?.issues[0]?.path).toEqual(["confirm"]);
  expect(r.error?.issues[0]?.message).toBe("Passwords don't match");
});

test("reset password needs 8 characters", () => {
  expect(resetPasswordSchema.safeParse({ otp: "123456", password: "short", confirm: "short" }).success).toBe(false);
});

test("codes are 6 characters", () => {
  expect(verifyEmailSchema.safeParse({ otp: "12345" }).success).toBe(false);
  expect(verifyEmailSchema.safeParse({ otp: "123456" }).success).toBe(true);
});

test("forgot password needs a valid email", () => {
  expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false);
});

test("reset matches when both fields have the same trailing space", () => {
  expect(resetPasswordSchema.safeParse({ otp: "123456", password: "longenough ", confirm: "longenough " }).success).toBe(true);
});
