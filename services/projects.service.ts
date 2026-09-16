import apiClient from "@/lib/api-client"
import type { Project, ProjectFormData } from "@/components/admin/projects/types"
import type { QueryParams, PaginatedResponse, ApiSuccess } from "@/types/models"

/**
 * Helper to convert ProjectFormData object into a FormData payload
 * required for multipart/form-data requests with file uploads.
 */
function createProjectFormDataPayload(data: Partial<ProjectFormData>): FormData {
  const formData = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (key === "image") {
      if (value instanceof File) {
        formData.append("image", value)
      } else if (typeof value === "string") {
        formData.append("imageUrl", value)
      }
    } else {
      formData.append(key, String(value))
    }
  })

  return formData
}

export const projectsService = {
  /**
   * Fetch paginated projects list with optional search, category, and status filters.
   */
  async getProjects(params?: QueryParams): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get<PaginatedResponse<Project>>("/projects", {
      params,
    })
    return response.data
  },

  /**
   * Fetch single project details by ID or Slug.
   */
  async getProjectBySlug(slug: string): Promise<ApiSuccess<Project>> {
    const response = await apiClient.get<ApiSuccess<Project>>(`/projects/${slug}`)
    return response.data
  },

  /**
   * Create a new project using multipart/form-data.
   */
  async createProject(data: ProjectFormData): Promise<ApiSuccess<Project>> {
    const formData = createProjectFormDataPayload(data)
    const response = await apiClient.post<ApiSuccess<Project>>("/projects", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  /**
   * Update an existing project using multipart/form-data.
   */
  async updateProject(id: string, data: Partial<ProjectFormData>): Promise<ApiSuccess<Project>> {
    const formData = createProjectFormDataPayload(data)
    const response = await apiClient.patch<ApiSuccess<Project>>(`/projects/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  /**
   * Delete a project by ID.
   */
  async deleteProject(id: string): Promise<ApiSuccess<void>> {
    const response = await apiClient.delete<ApiSuccess<void>>(`/projects/${id}`)
    return response.data
  },
}

export default projectsService
