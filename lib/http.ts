import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { toast } from "sonner"

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "").replace(/\/api$/, "/api/v1")

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: () => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-otp",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
]

http.interceptors.request.use((config: InternalAxiosRequestConfig) => config)

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; errors?: Array<{ field?: string; message: string }> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = originalRequest?.url || ""
    const isAuthEndpoint =
      requestUrl.includes("/auth/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/verify-email") ||
      requestUrl.includes("/auth/resend-otp") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password")

    const isPublicPage =
      typeof window !== "undefined" &&
      PUBLIC_ROUTES.some((path) => window.location.pathname.startsWith(path))

    if (!error.response) {
      if (typeof window !== "undefined" && !window.navigator.onLine) {
        toast.error("لا يوجد اتصال بالإنترنت، يرجى التحقق من الشبكة", {
          id: "offline-error",
        })
      } else if (error.code === "ECONNABORTED") {
        toast.error("انتهت مهلة الاتصال بالسيرفر، يرجى المحاولة لاحقاً", {
          id: "timeout-error",
        })
      } else {
        toast.error("تعذر الاتصال بالسيرفر، تأكد من تشغيل الباك إند", {
          id: "network-error",
        })
      }
      return Promise.reject(error)
    }

    const status = error.response.status
    const responseData = error.response.data

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isPublicPage) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(http(originalRequest)),
            reject: (err: unknown) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        processQueue(null)
        return http(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)

        if (!isPublicPage) {
          toast.error("جلسة العمل انتهت، يرجى إعادة التسجيل", {
            id: "session-expired-toast",
          })
          setTimeout(() => {
            window.location.href = "/login"
          }, 800)
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (status === 429) {
      toast.warning(responseData?.message || "تجاوزت عدد المحاولات المسموح بها، يرجى الانتظار", {
        id: "rate-limit-warning",
      })
    } else if (status === 400) {
      toast.error(responseData?.message || "يرجى مراجعة البيانات المدخلة", {
        id: "validation-error",
      })
    } else if (status === 403 || status === 404 || status === 409 || status >= 500) {
      const isSilentProfileError = requestUrl.includes("/users/profile") && (status === 401 || status === 403)
      if (!isSilentProfileError) {
        toast.error(responseData?.message || "حدث خطأ غير متوقع", {
          id: `http-error-${status}`,
        })
      }
    }

    return Promise.reject(error)
  }
)

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  errors?: Array<{ message: string }>
}

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

export function extractFieldErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as {
      errors?: Array<{ field?: string; path?: string[]; message: string }>
    }
    if (data.errors && Array.isArray(data.errors)) {
      data.errors.forEach((err) => {
        const key = err.field || (err.path && err.path[0]?.toString())
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = err.message
        }
      })
    }
  }
  return fieldErrors
}

export default http
