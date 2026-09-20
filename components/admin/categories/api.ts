import { adminHttp, type ApiResponse } from "@/lib/http"
import type { Category, CategoryListResponse } from "./types"
import type { CategoryFormInput } from "./schema"

export async function getCategories(params?: { page?: number; limit?: number; search?: string }): Promise<CategoryListResponse> {
  const response = await adminHttp.get<CategoryListResponse>("/categories", { params })
  const responseData: any = response.data
  return responseData.data && responseData.meta ? responseData : {
    success: true,
    data: responseData.data || responseData || [],
    meta: responseData.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
  } as CategoryListResponse
}

export async function createCategory(data: CategoryFormInput): Promise<ApiResponse<Category>> {
  const response = await adminHttp.post<ApiResponse<Category>>("/categories", data)
  return response.data
}

export async function updateCategory(id: string, data: CategoryFormInput): Promise<ApiResponse<Category>> {
  const response = await adminHttp.put<ApiResponse<Category>>(`/categories/${id}`, data)
  return response.data
}

export async function deleteCategory(id: string): Promise<ApiResponse<null>> {
  const response = await adminHttp.delete<ApiResponse<null>>(`/categories/${id}`)
  return response.data
}
