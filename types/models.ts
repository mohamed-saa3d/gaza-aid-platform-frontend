// Enums
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"
export type AdminRole = "SUPER_ADMIN" | "CONTENT_MANAGER" | "FINANCE_MANAGER"
export type ProjectStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "ongoing" | "urgent" | "completed" | "paused"
export type DonationStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED"
export type CategoryId = "water" | "food" | "shelter" | "orphans" | "health" | "education" | "other" | string

// Base Entity Interfaces
export interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  role: Role
  avatar?: string | null
  createdAt: string
  updatedAt: string
}

export interface Admin {
  id: string
  userId: string
  user: User
  adminRole: AdminRole
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  slug: string
  title: string
  titleAr?: string
  titleEn?: string
  description: string
  descriptionAr?: string
  descriptionEn?: string
  image: string
  imageUrl?: string
  category: CategoryId
  categoryId?: string
  status: ProjectStatus
  progress: number
  funded: number
  remaining: number
  target: number
  targetAmount?: number
  beneficiaries?: number | null
  beneficiariesCount?: number | null
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  createdAt: string
  updatedAt: string
}

export interface NewsItem {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  detailsUrl?: string
  isUrgent: boolean
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface LivestreamItem {
  id: string
  titleAr: string
  titleEn: string
  youtubeUrl: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Donation {
  id: string
  amount: number
  currency: string
  status: DonationStatus
  donorId?: string | null
  donor?: User | null
  projectId?: string | null
  project?: Project | null
  paymentMethod: string
  transactionId?: string | null
  createdAt: string
  updatedAt: string
}

// Form Data Type for Create / Update Forms
export interface ProjectFormData {
  slug?: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  categoryId: string
  status: "ACTIVE" | "COMPLETED" | "PAUSED" | string
  targetAmount: number
  beneficiariesCount?: number
  location?: string
  imageUrl?: string
  image?: File | null
  // Legacy / fallback fields
  title?: string
  description?: string
  target?: number
  category?: string
}

// API Response & Query Interfaces
export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiSuccess<T> {
  success: boolean
  message?: string
  data: T
}
