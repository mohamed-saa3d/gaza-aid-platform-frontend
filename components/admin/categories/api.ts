import { adminHttp, type ApiResponse } from "@/lib/http"
import axios from "axios"
import type {
  Category,
  CategoryDeleteConfirmationRequired,
  CategoryListResponse,
  DeleteCategoryResult,
} from "./types"
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

/**
 * Attempts to delete a category.
 *
 * Without `confirmUnassignProjects`, the backend refuses to delete a category
 * that still owns projects and answers with a `CATEGORY_HAS_PROJECTS` payload
 * holding the authoritative linked-project count. That is returned to the
 * caller (not thrown) so the UI can warn before anything is written.
 */
export async function deleteCategory(
  id: string,
  options?: { confirmUnassignProjects?: boolean },
): Promise<DeleteCategoryResult> {
  const body = options?.confirmUnassignProjects
    ? { confirmUnassignProjects: true }
    : undefined

  try {
    const response = await adminHttp.delete<DeleteCategoryResult>(`/categories/${id}`, {
      data: body,
      // The interceptor toasts every 409 globally; this one is handled in UI.
      silentStatuses: [409],
    })
    return response.data
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 409 &&
      (error.response.data as CategoryDeleteConfirmationRequired | undefined)?.code ===
      "CATEGORY_HAS_PROJECTS"
    ) {
      return error.response.data as CategoryDeleteConfirmationRequired
    }
    throw error
  }
}
