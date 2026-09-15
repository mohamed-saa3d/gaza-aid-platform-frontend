import { z } from "zod"

// ---------------------------------------------------------
// 1. Login Schema (بسيطة ومستقبلية دون تعقيد)
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
// 2. Register Form Schema (لواجهة المستخدم والتحقق)
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
  // التحقق من المطابقة في الـ Schema
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"], // ربط الرسالة بحقل تأكيد كلمة المرور
  })

// ---------------------------------------------------------
// 3. Infer Types & API Payload Handler
// ---------------------------------------------------------
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// دالة مساعدة لتجهيز بيانات التسجيل لإرسالها للـ API بدون confirmPassword
export const formatRegisterPayload = (data: RegisterInput) => {
  const { confirmPassword, ...payload } = data
  return payload
}