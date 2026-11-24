import { z } from "zod";

/**
 * Sign-in, sign-up and password reset forms. Better Auth checks these on
 * the server; the same rules here give the user the error before sending.
 */

const email = z.string().trim().min(1, "Email is required").email("Enter a valid email address");
const newPassword = z.string().trim().min(8, "Use at least 8 characters");
const code = z.string().trim().length(6, "Enter the 6-digit code from the email");

export const signInSchema = z.object({
  email,
  password: z.string().trim().min(1, "Password is required"),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email,
  password: newPassword,
});

export const verifyEmailSchema = z.object({ otp: code });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ otp: code, password: newPassword, confirm: z.string().trim() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Passwords don't match" });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
