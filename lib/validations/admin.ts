// Re-export feature-sliced co-located schemas for admin feature modules
export {
  createProjectSchema,
  updateProjectSchema,
  projectFormSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
  type ProjectFormValues,
} from "@/components/admin/projects/schema"

export {
  createNewsSchema,
  updateNewsSchema,
  newsFormSchema,
  type CreateNewsInput,
  type UpdateNewsInput,
  type NewsFormValues,
} from "@/components/admin/news/schema"

export {
  createLiveStreamSchema,
  updateLiveStreamSchema,
  livestreamFormSchema,
  type CreateLiveStreamInput,
  type UpdateLiveStreamInput,
  type LivestreamFormValues,
} from "@/components/admin/livestreams/schema"

export {
  createFaqSchema,
  updateFaqSchema,
  faqFormSchema,
  type CreateFaqInput,
  type UpdateFaqInput,
  type FAQFormValues,
} from "@/components/admin/faqs/schema"
