import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { toast } from "sonner"

const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
const BASE_URL = RAW_BASE_URL.replace(/\/+$/, "").replace(/\/api$/, "/api/v1")

const makeRequestId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `req-${Date.now()}-${Math.random().toString(16).slice(2)}`)

const getScopeFromPath = (path: string) => {
  if (!path) return 'unknown'
  if (path.startsWith('/admin')) return 'admin'
  if (path.startsWith('/users')) return 'user'
  return 'unknown'
}

export type AuthScope = 'user' | 'admin'

declare module 'axios' {
  export interface AxiosRequestConfig {
    authScope?: AuthScope
  }
}

const getAuthScope = (path: string, config?: Partial<InternalAxiosRequestConfig> & { authScope?: AuthScope }): AuthScope => {
  if (config?.authScope) return config.authScope
  if (path.startsWith('/admin')) return 'admin'
  if (path.startsWith('/users')) return 'user'
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) return 'admin'
  return 'user'
}

const logAuthTrace = (event: string, config: Partial<InternalAxiosRequestConfig> & { url?: string; method?: string }, status?: number, details: Record<string, unknown> = {}) => {
  const requestId = config.headers?.['X-Correlation-Id'] || config.headers?.['x-correlation-id'] || 'n/a'
  const method = config.method?.toUpperCase() || 'UNKNOWN'
  const url = config.url || 'unknown'
  const scope = getScopeFromPath(url)
  const payload = {
    requestId,
    scope,
    event,
    method,
    url,
    status,
    ...details,
  }
  if (typeof window !== 'undefined') {
    console.info('[AUTH TRACE]', payload)
  }
}

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

const refreshPromises: Record<AuthScope, Promise<void> | null> = {
  user: null,
  admin: null,
}

const refreshEndpoints: Record<AuthScope, string> = {
  user: '/auth/user/refresh',
  admin: '/admin/refresh',
}

const refreshScope = (scope: AuthScope): Promise<void> => {
  if (!refreshPromises[scope]) {
    refreshPromises[scope] = axios.post(
      `${BASE_URL}${refreshEndpoints[scope]}`,
      {},
      { withCredentials: true },
    ).then(() => undefined).finally(() => {
      refreshPromises[scope] = null
    })
  }

  return refreshPromises[scope] as Promise<void>
}

const PUBLIC_ROUTES = [
  "/login",
  "/admin/login",
  "/register",
  "/verify-otp",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
]

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const requestId = makeRequestId()
  const headers = { ...(config.headers as Record<string, string> | undefined) }
  headers['X-Correlation-Id'] = requestId
  config.headers = headers as any

  const url = config.url || ''
  const scope = getScopeFromPath(url)
  const credentialsIncluded = Boolean(config.withCredentials)
  logAuthTrace('request-start', config, undefined, { scope, credentialsIncluded, authEndpoint: url.includes('/auth/') || url.includes('/admin/') || url.includes('/users/') })
  return config
})

http.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers?.['X-Correlation-Id'] || response.config.headers?.['x-correlation-id'] || 'n/a'
    logAuthTrace('response-success', response.config, response.status, { requestId, refreshTriggered: false, logoutTriggered: false })
    return response
  },
  async (error: AxiosError<{ message?: string; errors?: Array<{ field?: string; message: string }> }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = originalRequest?.url || ""
    const isAuthEndpoint =
        requestUrl.includes("/auth/user/refresh") ||
        requestUrl.includes("/admin/refresh") ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/admin/login") ||
        requestUrl.includes("/auth/user/logout") ||
        requestUrl.includes("/admin/logout") ||
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
    const requestId = originalRequest.headers?.['X-Correlation-Id'] || originalRequest.headers?.['x-correlation-id'] || 'n/a'
    const scope = getScopeFromPath(requestUrl)
    logAuthTrace('response-error', originalRequest, status, {
      requestId,
      scope,
      reason: responseData?.message || 'unknown',
      triggeredRefresh: false,
      triggeredLogout: false,
      isAuthEndpoint,
    })

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isPublicPage) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      const scope = getAuthScope(requestUrl, originalRequest as any)
      logAuthTrace('refresh-attempt', originalRequest, status, { requestId, scope, reason: '401-on-protected-request', triggeredRefresh: true, triggeredLogout: false })

      try {
        await refreshScope(scope)
        return http(originalRequest)
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent<AuthScope>('auth:session-expired', { detail: scope }))
        }

        return Promise.reject(refreshError)
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

export const adminHttp = {
  get: <T = any>(url: string, config?: import("axios").AxiosRequestConfig) =>
    http.get<T>(url, { ...config, authScope: "admin" }),
  post: <T = any>(url: string, data?: any, config?: import("axios").AxiosRequestConfig) =>
    http.post<T>(url, data, { ...config, authScope: "admin" }),
  put: <T = any>(url: string, data?: any, config?: import("axios").AxiosRequestConfig) =>
    http.put<T>(url, data, { ...config, authScope: "admin" }),
  patch: <T = any>(url: string, data?: any, config?: import("axios").AxiosRequestConfig) =>
    http.patch<T>(url, data, { ...config, authScope: "admin" }),
  delete: <T = any>(url: string, config?: import("axios").AxiosRequestConfig) =>
    http.delete<T>(url, { ...config, authScope: "admin" }),
}

export default http
