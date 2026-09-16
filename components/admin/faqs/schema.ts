import { z } from "zod"

export const createFaqSchema = z.object({
  questionAr: z.string().trim().min(2, "Arabic question is required"),
  questionEn: z.string().trim().min(2, "English question is required"),
  answerAr: z.string().trim().min(5, "Arabic answer is required"),
  answerEn: z.string().trim().min(5, "English answer is required"),
  isActive: z.boolean().optional(),
})

export const updateFaqSchema = createFaqSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided")

export const faqFormSchema = createFaqSchema

export type CreateFaqInput = z.infer<typeof createFaqSchema>
export type UpdateFaqInput = z.infer<typeof updateFaqSchema>
export type FAQFormValues = CreateFaqInput
