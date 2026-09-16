export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED'

export interface ProjectCategory {
  id: string
  nameAr: string
  nameEn: string
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
  category: ProjectCategory | string
  createdAt?: string
  updatedAt?: string
  progressPercentage?: number
  // Optional backward compatibility fields
  slug?: string
  title?: string
  description?: string
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
