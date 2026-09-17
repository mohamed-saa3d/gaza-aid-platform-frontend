import { http, type ApiResponse } from "@/lib/http"
import type { News, NewsListResponse } from "./types"
import type { CreateNewsInput } from "./schema"

export async function getNews(params?: {
  page?: number
  limit?: number
}): Promise<NewsListResponse> {
  const response = await http.get<NewsListResponse>("/news", { params })
  return response.data
}

export async function getNewsById(id: string): Promise<ApiResponse<News>> {
  const response = await http.get<ApiResponse<News>>(`/news/${id}`)
  return response.data
}

export async function createNews(
  data: CreateNewsInput,
  imageFile?: File
): Promise<ApiResponse<News>> {
  const formData = new FormData()

  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, String(val))
    }
  })

  if (imageFile) {
    formData.append("image", imageFile)
  }

  const response = await http.post<ApiResponse<News>>("/news", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export async function updateNews(
  id: string,
  data: Partial<CreateNewsInput>,
  imageFile?: File
): Promise<ApiResponse<News>> {
  const formData = new FormData()

  Object.entries(data).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      formData.append(key, String(val))
    }
  })

  if (imageFile) {
    formData.append("image", imageFile)
  }

  const response = await http.put<ApiResponse<News>>(`/news/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

export async function deleteNews(id: string): Promise<ApiResponse<null>> {
  const response = await http.delete<ApiResponse<null>>(`/news/${id}`)
  return response.data
}
