import { z } from "zod"

export const createLiveStreamSchema = z.object({
  titleAr: z.string().trim().min(2, "Arabic title is required"),
  titleEn: z.string().trim().min(2, "English title is required"),
  youtubeUrl: z.string().trim().url("Invalid YouTube URL"),
  isActive: z.boolean().optional(),
})

export const updateLiveStreamSchema = createLiveStreamSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided")

export const livestreamFormSchema = createLiveStreamSchema

export type CreateLiveStreamInput = z.infer<typeof createLiveStreamSchema>
export type UpdateLiveStreamInput = z.infer<typeof updateLiveStreamSchema>
export type LivestreamFormValues = CreateLiveStreamInput
