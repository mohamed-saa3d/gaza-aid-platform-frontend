import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح"),
  phone: z.string().trim().min(8, "يرجى إدخال رقم هاتف صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  agreed: z.boolean().refine((value) => value, "يجب الموافقة على الشروط والأحكام"),
})

export const otpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "يرجى إدخال البريد الإلكتروني أو رقم الهاتف")
    .refine(
      (val) => z.string().email().safeParse(val).success || /^\d{8,15}$/.test(val),
      { message: "يرجى إدخال بريد إلكتروني أو رقم هاتف صحيح" }
    ),
  otp: z.string().trim().regex(/^\d{4}$/, "رمز التحقق يجب أن يتكون من 4 أرقام"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type OtpInput = z.infer<typeof otpSchema>
