import { z } from "zod"
import { dictionary, type LocaleDictionary } from "@/lib/dictionary"

/**
 * Validation messages are STATIC UI copy, so they come from the i18n dictionary
 * instead of being hardcoded Arabic. The schemas are therefore factory functions
 * that take the `validation` section for the active locale.
 *
 * `admin`-only callers (e.g. the Admin login page) keep using the Arabic default
 * below, so nothing regressed there.
 */
export type ValidationMessages = LocaleDictionary["validation"]

const defaultMessages: ValidationMessages = dictionary.ar.validation
// ---------------------------------------------------------
// 1. Login Schema
// ---------------------------------------------------------
export const createLoginSchema = (m: ValidationMessages = defaultMessages) =>
  z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(m.emailInvalid),
    password: z
      .string()
      .min(1, m.passwordRequired),
  })

// ---------------------------------------------------------
// 2. Register Form Schema
// ---------------------------------------------------------
export const createRegisterSchema = (m: ValidationMessages = defaultMessages) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(2, m.nameMin)
        .max(50, m.nameMax)
        .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, m.nameLettersOnly),

      email: z
        .string()
        .trim()
        .toLowerCase()
        .email(m.emailInvalid)
        .max(255, m.emailMax),

      password: z
        .string()
        .min(8, m.passwordMin)
        .max(64, m.passwordMax)
        .regex(
          /^(?=.*[a-zA-Z])(?=.*\d)/,
          m.passwordStrength
        ),

      confirmPassword: z
        .string()
        .min(1, m.confirmPasswordRequired),

      agreed: z
        .boolean()
        .refine((val) => val === true, m.termsRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: m.passwordsMismatch,
      path: ["confirmPassword"],
    })

// ---------------------------------------------------------
// 3. OTP Schema
// ---------------------------------------------------------
export const createOtpSchema = (m: ValidationMessages = defaultMessages) =>
  z.object({
    code: z.string().length(6, m.otpLength),
  })

// ---------------------------------------------------------
// 4. Forgot & Reset Password Schemas
// ---------------------------------------------------------
export const createForgotPasswordSchema = (m: ValidationMessages = defaultMessages) =>
  z.object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(m.emailInvalid),
  })

export const createResetPasswordSchema = (m: ValidationMessages = defaultMessages) =>
  z
    .object({
      token: z.string().min(1, m.resetTokenInvalid),
      password: z
        .string()
        .min(8, m.passwordMin)
        .max(64, m.passwordMax)
        .regex(
          /^(?=.*[a-zA-Z])(?=.*\d)/,
          m.passwordStrength
        ),
      confirmPassword: z.string().min(1, m.confirmPasswordRequired),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: m.passwordsMismatch,
      path: ["confirmPassword"],
    })

// ---------------------------------------------------------
// Default (Arabic) instances — used by Admin-scoped callers.
// ---------------------------------------------------------
export const loginSchema = createLoginSchema()
export const registerSchema = createRegisterSchema()
export const otpSchema = createOtpSchema()
export const forgotPasswordSchema = createForgotPasswordSchema()
export const resetPasswordSchema = createResetPasswordSchema()

// ---------------------------------------------------------
// Infer Types
// ---------------------------------------------------------
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>
export type OtpInput = z.infer<ReturnType<typeof createOtpSchema>>
export type ForgotPasswordInput = z.infer<ReturnType<typeof createForgotPasswordSchema>>
export type ResetPasswordInput = z.infer<ReturnType<typeof createResetPasswordSchema>>

export const formatRegisterPayload = (data: RegisterInput) => {
  const { confirmPassword, ...payload } = data
  return payload
}