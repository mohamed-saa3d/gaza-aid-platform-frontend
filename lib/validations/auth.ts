import { z } from "zod"

// ---------------------------------------------------------
// 1. Login Schema
// ---------------------------------------------------------
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z
    .string()
    .min(1, "يرجى إدخال كلمة المرور"),
})

// ---------------------------------------------------------
// 2. Register Form Schema
// ---------------------------------------------------------
export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(50, "الاسم طويل جداً")
      .regex(/^[\u0600-\u06FFa-zA-Z\s]+$/, "الاسم يجب أن يحتوي على حروف فقط"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("يرجى إدخال بريد إلكتروني صحيح")
      .max(255, "البريد الإلكتروني طويل جداً"),

    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .max(64, "كلمة المرور طويلة جداً")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "كلمة المرور يجب أن تحتوي على حرف ورقم على الأقل"
      ),

    confirmPassword: z
      .string()
      .min(1, "يرجى تأكيد كلمة المرور"),

    agreed: z
      .boolean()
      .refine((val) => val === true, "يجب الموافقة على الشروط والأحكام"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

// ---------------------------------------------------------
// 3. OTP Schema
// ---------------------------------------------------------
export const otpSchema = z.object({
  code: z.string().min(4, "رمز التحقق مكون من 4 أو 6 أرقام"),
})
export type OtpInput = z.infer<typeof otpSchema>

// ---------------------------------------------------------
// 4. Forgot & Reset Password Schemas
// ---------------------------------------------------------
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("يرجى إدخال بريد إلكتروني صحيح"),
})

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "رمز إعادة التعيين غير صالح"),
    password: z
      .string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .max(64, "كلمة المرور طويلة جداً")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "كلمة المرور يجب أن تحتوي على حرف ورقم على الأقل"
      ),
    confirmPassword: z.string().min(1, "يرجى تأكيد كلمة المرور"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  })

// ---------------------------------------------------------
// Infer Types
// ---------------------------------------------------------
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const formatRegisterPayload = (data: RegisterInput) => {
  const { confirmPassword, ...payload } = data
  return payload
}