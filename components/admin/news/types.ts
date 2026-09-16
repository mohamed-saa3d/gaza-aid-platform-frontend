export interface News {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  imageUrl: string
  detailsUrl?: string | null
  isUrgent: boolean
  createdAt?: string
  updatedAt?: string
}

export interface NewsListResponse {
  success: boolean
  message: string
  data: {
    data: News[]
    total: number
    page: number
    limit: number
  }
}

export type NewsItemData = News
