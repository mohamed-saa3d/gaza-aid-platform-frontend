import { z } from "zod"

export const createNewsSchema = z.object({
  titleAr: z.string().trim().min(2, "Arabic title is required"),
  titleEn: z.string().trim().min(2, "English title is required"),
  descriptionAr: z.string().trim().min(10, "Arabic description is required"),
  descriptionEn: z.string().trim().min(10, "English description is required"),
  imageUrl: z.string().trim().url("Must be a valid URL").optional().or(z.literal("")),
  detailsUrl: z.string().trim().url("Invalid details URL").optional().or(z.literal("")).nullable(),
  isUrgent: z.boolean().optional(),
})

export const updateNewsSchema = createNewsSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided")

export const newsFormSchema = createNewsSchema

export type CreateNewsInput = z.infer<typeof createNewsSchema>
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>
export type NewsFormValues = CreateNewsInput
