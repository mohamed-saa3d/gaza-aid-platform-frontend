// Enums
export type Role = "USER" | "ADMIN" | "SUPER_ADMIN"
export type AdminRole = "SUPER_ADMIN" | "CONTENT_MANAGER" | "FINANCE_MANAGER"
export type ProjectStatus = "ongoing" | "urgent" | "completed" | "paused"
export type DonationStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED"
export type CategoryId = "water" | "food" | "shelter" | "orphans" | "health" | "education" | "other"

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
  description: string
  image: string
  category: CategoryId
  status: ProjectStatus
  progress: number
  funded: number
  remaining: number
  target: number
  beneficiaries?: number | null
  location?: string | null
  startDate?: string | null
  endDate?: string | null
  createdAt: string
  updatedAt: string
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
  slug: string
  title: string
  description: string
  category: CategoryId
  status: ProjectStatus
  target: number
  beneficiaries?: number
  location?: string
  image: File | null
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
