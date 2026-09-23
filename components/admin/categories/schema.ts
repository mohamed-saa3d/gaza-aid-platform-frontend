import { z } from "zod"

// Constrained to a safe identifier, matching the backend rule: the value is only
// ever used as a lookup key in the frontend icon registry, never as markup.
const iconKeySchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z][A-Za-z0-9]{1,40}$/, "مفتاح الأيقونة غير صالح")

export const categoryFormSchema = z.object({
  nameAr: z.string().trim().min(2, "الاسم بالعربية مطلوب (حرفين على الأقل)"),
  nameEn: z.string().trim().min(2, "الاسم بالإنجليزية مطلوب"),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  icon: iconKeySchema.optional(),
  order: z.coerce.number().int().min(0).max(9999).optional(),
})

export type CategoryFormInput = z.infer<typeof categoryFormSchema>
