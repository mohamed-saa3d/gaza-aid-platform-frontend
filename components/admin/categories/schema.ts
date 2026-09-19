import { z } from "zod"

export const categoryFormSchema = z.object({
  nameAr: z.string().trim().min(2, "الاسم بالعربية مطلوب (حرفين على الأقل)"),
  nameEn: z.string().trim().min(2, "الاسم بالإنجليزية مطلوب"),
  descriptionAr: z.string().optional(),
  descriptionEn: z.string().optional(),
})

export type CategoryFormInput = z.infer<typeof categoryFormSchema>
