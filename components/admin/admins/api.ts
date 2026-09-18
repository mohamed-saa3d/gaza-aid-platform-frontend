import { http, type ApiResponse } from "@/lib/http"
import type { AdminUser, AdminListResponse } from "./types"
import type { CreateAdminInput, UpdateAdminInput } from "./schema"

export async function getAdmins(params?: { page?: number; limit?: number }): Promise<AdminListResponse> {
  const response = await http.get<AdminListResponse>("/admin", { params })
  return response.data
}

export async function getAdminById(id: string): Promise<ApiResponse<AdminUser>> {
  const response = await http.get<ApiResponse<AdminUser>>(`/admin/${id}`)
  return response.data
}

export async function createAdmin(data: CreateAdminInput): Promise<ApiResponse<AdminUser>> {
  const response = await http.post<ApiResponse<AdminUser>>("/admin", data)
  return response.data
}

export async function updateAdmin(id: string, data: UpdateAdminInput): Promise<ApiResponse<AdminUser>> {
  const response = await http.put<ApiResponse<AdminUser>>(`/admin/${id}`, data)
  return response.data
}

export async function deleteAdmin(id: string): Promise<ApiResponse<null>> {
  const response = await http.delete<ApiResponse<null>>(`/admin/${id}`)
  return response.data
}
