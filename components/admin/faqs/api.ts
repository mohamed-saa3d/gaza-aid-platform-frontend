import { adminHttp, type ApiResponse } from "@/lib/http"
import type { FAQ, FAQListResponse } from "./types"
import type { CreateFaqInput } from "./schema"

export async function getFaqs(params?: {
  page?: number
  limit?: number
}): Promise<FAQListResponse> {
  const response = await adminHttp.get<FAQListResponse>("/faqs", { params })
  return response.data
}

export async function getFaqById(id: string): Promise<ApiResponse<FAQ>> {
  const response = await adminHttp.get<ApiResponse<FAQ>>(`/faqs/${id}`)
  return response.data
}

export async function createFaq(data: CreateFaqInput): Promise<ApiResponse<FAQ>> {
  const response = await adminHttp.post<ApiResponse<FAQ>>("/faqs", data)
  return response.data
}

export async function updateFaq(
  id: string,
  data: Partial<CreateFaqInput>
): Promise<ApiResponse<FAQ>> {
  const response = await adminHttp.put<ApiResponse<FAQ>>(`/faqs/${id}`, data)
  return response.data
}

export async function deleteFaq(id: string): Promise<ApiResponse<null>> {
  const response = await adminHttp.delete<ApiResponse<null>>(`/faqs/${id}`)
  return response.data
}
