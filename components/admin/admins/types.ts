export type AdminRole = "SUPER_ADMIN" | "ADMIN"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  createdAt: string
  updatedAt?: string
  addedDate?: string
}

export interface AdminListResponse {
  success: boolean
  message?: string
  data: {
    data: AdminUser[]
    total: number
    page: number
    limit: number
  }
}
