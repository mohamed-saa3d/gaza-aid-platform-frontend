import { http, type ApiResponse } from "@/lib/http"
import type { Project, ProjectsListResponse } from "./types"
import type { CreateProjectInput } from "./schema"

export async function getProjects(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ProjectsListResponse> {
  const response = await http.get<ProjectsListResponse>("/projects", { params })
  return response.data
}

export async function getProjectById(id: string): Promise<ApiResponse<Project>> {
  const response = await http.get<ApiResponse<Project>>(`/projects/${id}`)
  return response.data
}

export async function createProject(
  data: CreateProjectInput,
  imageFile?: File
): Promise<ApiResponse<Project>> {
  const formData = new FormData()

  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, String(val))
    }
  })

  if (imageFile) {
    formData.append("image", imageFile)
  }

  const response = await http.post<ApiResponse<Project>>("/projects", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export async function updateProject(
  id: string,
  data: Partial<CreateProjectInput>,
  imageFile?: File
): Promise<ApiResponse<Project>> {
  const formData = new FormData()

  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, String(val))
    }
  })

  if (imageFile) {
    formData.append("image", imageFile)
  }

  const response = await http.put<ApiResponse<Project>>(`/projects/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export async function deleteProject(id: string): Promise<ApiResponse<null>> {
  const response = await http.delete<ApiResponse<null>>(`/projects/${id}`)
  return response.data
}
