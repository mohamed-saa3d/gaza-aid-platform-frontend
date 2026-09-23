import { z } from "zod"
import { isYouTubeUrl, canEmbedYouTubeUrl } from "@/lib/youtube"

/**
 * A live stream link must be a real YouTube URL that can actually be embedded.
 * A bare `https://www.youtube.com/` passes a plain `url()` check but has no video
 * in it — the stream would then be saved as active and never appear on the public
 * site. Requiring an extractable video id is what stops that silent failure.
 */
const youtubeUrlSchema = z
  .string()
  .trim()
  .url("Invalid YouTube URL")
  .refine(isYouTubeUrl, "Must be a YouTube link")
  .refine(canEmbedYouTubeUrl, "This YouTube link has no video — use a watch, live, or youtu.be link")

export const createLiveStreamSchema = z.object({
  titleAr: z.string().trim().min(2, "Arabic title is required"),
  titleEn: z.string().trim().min(2, "English title is required"),
  youtubeUrl: youtubeUrlSchema,
  isActive: z.boolean().optional(),
})

export const updateLiveStreamSchema = createLiveStreamSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided")

export const livestreamFormSchema = createLiveStreamSchema

export type CreateLiveStreamInput = z.infer<typeof createLiveStreamSchema>
export type UpdateLiveStreamInput = z.infer<typeof updateLiveStreamSchema>
export type LivestreamFormValues = CreateLiveStreamInput
