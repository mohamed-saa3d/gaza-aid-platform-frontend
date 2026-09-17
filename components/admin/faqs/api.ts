import { http, type ApiResponse } from "@/lib/http"
import type { FAQ, FAQListResponse } from "./types"
import type { CreateFaqInput } from "./schema"

export async function getFaqs(params?: {
  page?: number
  limit?: number
}): Promise<FAQListResponse> {
  const response = await http.get<FAQListResponse>("/faq", { params })
  return response.data
}

export async function getFaqById(id: string): Promise<ApiResponse<FAQ>> {
  const response = await http.get<ApiResponse<FAQ>>(`/faq/${id}`)
  return response.data
}

export async function createFaq(data: CreateFaqInput): Promise<ApiResponse<FAQ>> {
  const response = await http.post<ApiResponse<FAQ>>("/faq", data)
  return response.data
}

export async function updateFaq(
  id: string,
  data: Partial<CreateFaqInput>
): Promise<ApiResponse<FAQ>> {
  const response = await http.put<ApiResponse<FAQ>>(`/faq/${id}`, data)
  return response.data
}

export async function deleteFaq(id: string): Promise<ApiResponse<null>> {
  const response = await http.delete<ApiResponse<null>>(`/faq/${id}`)
  return response.data
}
