export interface LiveStream {
  id: string
  titleAr: string
  titleEn: string
  youtubeUrl: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LiveStreamListResponse {
  success: boolean
  message: string
  data: {
    data: LiveStream[]
    total: number
    page: number
    limit: number
  }
}

export type LivestreamItemData = LiveStream
