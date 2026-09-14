import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request Interceptor: Auth Token & Language Headers
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const locale = window.localStorage.getItem("preferred-locale") || "ar"
    if (config.headers) {
      config.headers["Accept-Language"] = locale
    }
  }
  return config
})

// Interceptor State for Token Refresh Queue
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

// Response Interceptor: Auto Refresh & Global Error Toasting
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Check if error is 401 Unauthorized and request hasn't been retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(apiClient(originalRequest))
            },
            reject: (err: unknown) => {
              reject(err)
            },
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = data.accessToken
        if (typeof window !== "undefined") {
          window.localStorage.setItem("accessToken", newAccessToken)
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        processQueue(null, newAccessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("accessToken")
          if (window.location.pathname.startsWith("/admin")) {
            window.location.href = "/admin/login"
          } else {
            window.location.href = "/login"
          }
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Toast unhandled error messages
    if (typeof window !== "undefined" && error.response?.status !== 401) {
      const errorMessage = error.response?.data?.message || error.message || "حدث خطأ في الاتصال بالخادم"
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

export default apiClient
