export interface FAQ {
  id: string
  questionAr: string
  questionEn: string
  answerAr: string
  answerEn: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FAQListResponse {
  success: boolean
  message: string
  data: {
    data: FAQ[]
    total: number
    page: number
    limit: number
  }
}

export type FAQItemData = FAQ
