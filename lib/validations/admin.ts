import { z } from "zod"

// Projects Schema
export const projectFormSchema = z.object({
  titleAr: z.string().min(2, "عنوان المشروع بالعربية مطلوب (حرفين على الأقل)"),
  titleEn: z.string().min(2, "English title is required (min 2 characters)"),
  descriptionAr: z.string().min(10, "وصف المشروع بالعربية مطلوب (10 أحرف على الأقل)"),
  descriptionEn: z.string().min(10, "English description is required (min 10 characters)"),
  targetAmount: z.coerce.number().positive("المبلغ المستهدف يجب أن يكون أكبر من 0"),
  beneficiariesCount: z.coerce.number().min(0, "عدد المستفيدين لا يمكن أن يكون بالسالب").optional().default(0),
  status: z.enum(["ACTIVE", "COMPLETED", "PAUSED"]),
  categoryId: z.string().min(1, "يرجى اختيار فئة المشروع"),
  imageUrl: z.string().url("رابط الصورة غير صالح").optional().or(z.literal("")),
})

// News Schema
export const newsFormSchema = z.object({
  titleAr: z.string().min(2, "عنوان الخبر بالعربية مطلوب"),
  titleEn: z.string().min(2, "English news title is required"),
  descriptionAr: z.string().min(10, "تفاصيل الخبر بالعربية مطلوبة"),
  descriptionEn: z.string().min(10, "English news description is required"),
  detailsUrl: z.string().url("رابط التفاصيل غير صالح").optional().or(z.literal("")),
  isUrgent: z.boolean().default(false),
  imageUrl: z.string().url("رابط الصورة غير صالح").optional().or(z.literal("")),
})

// Livestream Schema
export const livestreamFormSchema = z.object({
  titleAr: z.string().min(2, "عنوان البث بالعربية مطلوب"),
  titleEn: z.string().min(2, "English stream title is required"),
  youtubeUrl: z.string().url("يرجى إدخال رابط يوتيوب صحيح"),
  isActive: z.boolean().default(true),
})

// FAQ Schema
export const faqFormSchema = z.object({
  questionAr: z.string().min(2, "السؤال بالعربية مطلوب (حرفين على الأقل)"),
  questionEn: z.string().min(2, "English question is required (min 2 characters)"),
  answerAr: z.string().min(5, "الإجابة بالعربية مطلوبة (5 أحرف على الأقل)"),
  answerEn: z.string().min(5, "English answer is required (min 5 characters)"),
  isActive: z.boolean().default(true),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>
export type NewsFormValues = z.infer<typeof newsFormSchema>
export type LivestreamFormValues = z.infer<typeof livestreamFormSchema>
export type FAQFormValues = z.infer<typeof faqFormSchema>

