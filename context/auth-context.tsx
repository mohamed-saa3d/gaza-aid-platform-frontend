"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { http } from "@/lib/http"

// Visitor (no session) | User (DONOR) | Admin (ADMIN).
// There is no Super Admin / Root Admin tier.
export type UserRole = "ADMIN" | "DONOR"
export type AuthScope = "user" | "admin"

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
  login: (user: UserProfile, scope?: AuthScope) => void
  logout: (scope?: AuthScope) => Promise<void>
  updateUser: (patch: Partial<UserProfile>) => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type SessionState = Record<AuthScope, UserProfile | null>

const getPathScope = (pathname: string): AuthScope => pathname.startsWith('/admin') ? 'admin' : 'user'

const getProfileEndpoint = (scope: AuthScope) => scope === 'admin' ? '/admin/profile' : '/users/profile'

const publicAuthPages = [
  '/login',
  '/admin/login',
  '/register',
  '/verify-otp',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sessions, setSessions] = useState<SessionState>({ user: null, admin: null })
  const [isLoading, setIsLoading] = useState(true)
  const requestIdRef = React.useRef(0)

  const clearClientSession = useCallback((scope: AuthScope) => {
    setSessions((current) => ({ ...current, [scope]: null }))
  }, [])

  const logout = useCallback(async (requestedScope?: AuthScope) => {
    requestIdRef.current += 1
    const scope = requestedScope || (typeof window !== 'undefined' ? getPathScope(window.location.pathname) : 'user')
    try {
      await http.post(scope === 'admin' ? '/admin/logout' : '/auth/user/logout')
    } catch (_error) {
      // Keep the app in a logged-out state even if the backend logout call fails.
    } finally {
      clearClientSession(scope)
    }
  }, [clearClientSession])

  const updateUser = useCallback((patch: Partial<UserProfile>) => {
    const scope = typeof window !== 'undefined' ? getPathScope(window.location.pathname) : 'user'
    setSessions((current) => {
      const currentUser = current[scope]
      if (!currentUser) return current
      return { ...current, [scope]: { ...currentUser, ...patch } }
    })
  }, [])

  const login = useCallback((newUser: UserProfile, requestedScope?: AuthScope) => {
    const scope = requestedScope || (newUser.role === 'ADMIN' ? 'admin' : 'user')
    setSessions((current) => ({ ...current, [scope]: newUser }))
  }, [])

  const refreshProfile = useCallback(async () => {
    if (typeof window === "undefined") return
    const path = window.location.pathname
    const isPublicPage = publicAuthPages.some((item) => path === item || path.startsWith(`${item}/`))
    const isProtectedRoute = path.startsWith("/admin") || path.startsWith("/profile")

    if (!isProtectedRoute && !isPublicPage) {
      setIsLoading(false)
      return
    }

    if (isPublicPage) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    const requestId = ++requestIdRef.current
    const scope = getPathScope(path)
    const profileEndpoint = getProfileEndpoint(scope)

    try {
      const res = await http.get<{ data?: UserProfile; user?: UserProfile }>(profileEndpoint)
      if (requestId !== requestIdRef.current) return
      const profile = res.data.data || res.data.user || (res.data as unknown as UserProfile)

      if (profile && profile.role) {
        setSessions((current) => ({ ...current, [scope]: profile }))
      } else {
        clearClientSession(scope)
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      const status = typeof err === 'object' && err !== null && 'response' in err
        ? Number((err as { response?: { status?: number } }).response?.status)
        : undefined

      if (status === 401) {
        clearClientSession(scope)
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [clearClientSession])

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const scope = (event as CustomEvent<AuthScope>).detail
      if (scope === 'user' || scope === 'admin') clearClientSession(scope)
    }

    window.addEventListener('auth:session-expired', handleSessionExpired)
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired)
  }, [clearClientSession])

  useEffect(() => {
    refreshProfile()
  }, [pathname, refreshProfile])

  const activeScope = getPathScope(pathname || '/')
  const activeUser = sessions[activeScope]

  const value: AuthContextType = {
    user: activeUser,
    role: activeUser?.role || null,
    isAuthenticated: Boolean(activeUser),
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
