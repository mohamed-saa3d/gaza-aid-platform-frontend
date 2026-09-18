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
  token: string | null
  login: (token: string, user: UserProfile) => void
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`
  }
}

function removeAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax"
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("userRole")
      removeAuthCookie()
    }
  }, [])

  const login = useCallback((newToken: string, newUser: UserProfile) => {
    setToken(newToken)
    setUser(newUser)
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", newToken)
      localStorage.setItem("userRole", newUser.role)
      setAuthCookie(newToken)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (typeof window === "undefined") return
    const storedToken = localStorage.getItem("accessToken")
    const publicPages = ["/login", "/register", "/verify-otp", "/verify-email", "/forgot-password", "/reset-password"]
    const isPublicPage = publicPages.some((path) => window.location.pathname.startsWith(path))

    if (!storedToken) {
      setIsLoading(false)
      return
    }

    try {
      setToken(storedToken)
      setAuthCookie(storedToken)
      const res = await http.get<{ data?: UserProfile; user?: UserProfile }>("/users/profile")
      const profile = res.data.data || res.data.user || (res.data as unknown as UserProfile)
      if (profile && profile.role) {
        setUser(profile)
        localStorage.setItem("userRole", profile.role)
      }
    } catch (err) {
      if (isPublicPage) {
        logout()
      } else {
        const storedRole = (localStorage.getItem("userRole") as UserRole) || "USER"
        setUser((prev) => prev || { id: "me", name: "User", email: "", role: storedRole })
      }
    } finally {
      setIsLoading(false)
    }
  }, [logout])

  useEffect(() => {
    refreshProfile()
  }, [refreshProfile])

  const value: AuthContextType = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    logout,
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
