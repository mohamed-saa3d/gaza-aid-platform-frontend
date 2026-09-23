export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED'

export interface ProjectCategory {
  id: string
  nameAr: string
  nameEn: string
  /** Locale-resolved name produced by the backend for public responses. */
  name?: string
}

export interface Project {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  imgUrl?: string
  targetAmount: number
  collectedAmount: number
  beneficiariesCount: number
  status: ProjectStatus
  /**
   * Populated by the API as an object when the project is categorized, and
   * `null` when the project is uncategorized (e.g. after its category was
   * deleted). Only the admin form/legacy responses ever send a plain id string.
   */
  category: ProjectCategory | string | null
  /**
   * Optional already-localized category name supplied by locale-aware API
   * responses. Preferred over `category.nameAr` when present so an English
   * visitor does not see an Arabic category. Only a legacy fallback otherwise.
   */
  categoryName?: string | null
  /**
   * Locale-resolved display values produced by the backend for the requested
   * locale. Present on public responses; absent on admin payloads (which edit
   * the raw AR/EN fields instead).
   */
  title?: string
  description?: string
  createdAt?: string
  updatedAt?: string
  progressPercentage?: number
  // Legacy/lowercase aliases kept for backward compatibility with older payloads.
  slug?: string
  image?: string
  imageUrl?: string
  progress?: number
  funded?: number
  remaining?: number
  target?: number
  beneficiaries?: number | null
  categoryId?: string
}

export interface ProjectsListResponse {
  success: boolean
  message: string
  data: Project[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProjectFormData {
  slug?: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  categoryId: string
  status: ProjectStatus | string
  targetAmount: number
  beneficiariesCount?: number
  location?: string
  imageUrl?: string
  image?: File | null
  title?: string
  description?: string
  target?: number
  category?: string
}
