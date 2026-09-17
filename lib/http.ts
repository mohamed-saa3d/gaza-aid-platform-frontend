import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Attach Access Token
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Response Interceptor: 401 Handling & Token Refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Array<{ message: string }> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(http(originalRequest))
            },
            reject: (err: unknown) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = data.accessToken
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", newAccessToken)
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        processQueue(null, newAccessToken)
        return http(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken")
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Standard Backend API Response Structure
 */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Array<{ message: string }>
}

/**
 * Helper to safely extract error message from standard backend error object
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as { message?: string; errors?: Array<{ message: string }> }
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(", ")
    }
    if (data.message) {
      return data.message
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  return "An unexpected error occurred"
}

export default http
