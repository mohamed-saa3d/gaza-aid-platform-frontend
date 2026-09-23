export interface News {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  /**
   * Locale-resolved values returned by the backend for the requested locale.
   * Only present on public (localized) responses; the admin forms edit the
   * raw `titleAr`/`titleEn` fields instead.
   */
  title?: string
  description?: string
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
