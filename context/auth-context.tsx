"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { http } from "@/lib/http"

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DONOR" | "USER"

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string | null
}

export interface AuthContextType {
  user: UserProfile | null
  role: UserRole | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: UserProfile) => void
  logout: () => Promise<void>
  updateUser: (patch: Partial<UserProfile>) => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
let refreshRequestInFlight = false
const authEpochRef = { current: 0 }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getProfileEndpoint = useCallback((pathname: string) => {
    if (pathname.startsWith('/admin')) {
      return '/admin/profile'
    }

    return '/users/profile'
  }, [])

  const clearClientSession = useCallback(() => {
    authEpochRef.current += 1
    setUser(null)

    if (typeof window !== "undefined") {
      localStorage.removeItem("userRole")
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await http.post("/auth/logout")
    } catch (_error) {
      // Keep the app in a logged-out state even if the backend logout call fails.
    } finally {
      clearClientSession()
    }
  }, [clearClientSession])

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser
      return { ...currentUser, ...patch }
    })
  }, [])

  const login = useCallback((newUser: UserProfile) => {
    authEpochRef.current += 1
    setUser(newUser)

    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", newUser.role)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (typeof window === "undefined") return
    if (refreshRequestInFlight) return

    const bootstrapEpoch = authEpochRef.current
    refreshRequestInFlight = true
    const path = window.location.pathname
    const publicPages = ["/login", "/register", "/verify-otp", "/verify-email", "/forgot-password", "/reset-password"]
    const isPublicPage = publicPages.some((item) => path.startsWith(item))
    const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/profile")

    if (!isProtectedRoute && !isPublicPage) {
      refreshRequestInFlight = false
      setIsLoading(false)
      return
    }

    if (isPublicPage) {
      setIsLoading(false)
      refreshRequestInFlight = false
      return
    }

    setIsLoading(true)

    const profileEndpoint = getProfileEndpoint(path)

    try {
      const res = await http.get<{ data?: UserProfile; user?: UserProfile }>(profileEndpoint)
      const profile = res.data.data || res.data.user || (res.data as unknown as UserProfile)

      if (bootstrapEpoch !== authEpochRef.current) {
        return
      }

      if (profile && profile.role) {
        setUser(profile)
        if (typeof window !== "undefined") {
          localStorage.setItem('userRole', profile.role)
        }
      } else {
        clearClientSession()
      }
    } catch (err) {
      if (bootstrapEpoch !== authEpochRef.current) {
        return
      }

      const status = typeof err === 'object' && err !== null && 'response' in err
        ? Number((err as { response?: { status?: number } }).response?.status)
        : undefined

      if (status === 401 || status === 403) {
        try {
          await http.post('/auth/refresh', {}, { withCredentials: true })

          if (bootstrapEpoch !== authEpochRef.current) {
            return
          }

          const retryResponse = await http.get<{ data?: UserProfile; user?: UserProfile }>(profileEndpoint)
          const retryProfile = retryResponse.data.data || retryResponse.data.user || (retryResponse.data as unknown as UserProfile)

          if (bootstrapEpoch !== authEpochRef.current) {
            return
          }

          if (retryProfile && retryProfile.role) {
            setUser(retryProfile)
            if (typeof window !== "undefined") {
              localStorage.setItem('userRole', retryProfile.role)
            }
          } else {
            clearClientSession()
          }
        } catch (refreshErr) {
          if (bootstrapEpoch !== authEpochRef.current) {
            return
          }

          clearClientSession()

          if (process.env.NODE_ENV !== 'production') {
            console.error('AuthContext refresh retry failed', refreshErr)
          }
        }
        return
      }

      if (status !== 404) {
        clearClientSession()
      }
    } finally {
      if (bootstrapEpoch === authEpochRef.current) {
        refreshRequestInFlight = false
        setIsLoading(false)
      } else {
        refreshRequestInFlight = false
        setIsLoading(false)
      }
    }
  }, [clearClientSession])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
