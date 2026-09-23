export interface FAQ {
  id: string
  questionAr: string
  questionEn: string
  answerAr: string
  answerEn: string
  /** Locale-resolved values returned by the backend for the requested locale. */
  question?: string
  answer?: string
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
