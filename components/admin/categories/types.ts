export interface Category {
  id: string
  nameAr: string
  nameEn: string
  descriptionAr?: string
  descriptionEn?: string
  createdAt?: string
  updatedAt?: string
}

export interface CategoryListResponse {
  success: boolean
  data: Category[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
