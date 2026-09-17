import { z } from "zod"

export const createAdminSchema = z.object({
  name: z.string().trim().min(2, "الاسم الكامل مطلوب (حرفين على الأقل)"),
  email: z.string().trim().toLowerCase().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
})

export const updateAdminSchema = createAdminSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided")

export type CreateAdminInput = z.infer<typeof createAdminSchema>
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>
