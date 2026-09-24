import { z } from "zod"

export const createProjectSchema = z.object({
  titleAr: z.string().trim().min(2, "Arabic title is required"),
  titleEn: z.string().trim().min(2, "English title is required"),
  descriptionAr: z.string().trim().min(10, "Arabic description is required"),
  descriptionEn: z.string().trim().min(10, "English description is required"),
  imageUrl: z.string().trim().url("Invalid image URL").optional().or(z.literal("")),
  targetAmount: z.coerce.number().positive("Target amount must be positive"),
  beneficiariesCount: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "PAUSED"]),
  isUrgent: z.boolean().optional(),
  categoryId: z.string().trim().min(1, "Category ID is required"),
})

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, "At least one field must be provided")

export const projectFormSchema = createProjectSchema

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectFormValues = CreateProjectInput
