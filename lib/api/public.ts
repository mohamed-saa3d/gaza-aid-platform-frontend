/**
 * Public API functions for unauthenticated frontend pages.
 *
 * These wrap the base `http` client (no admin auth scope) so that
 * public GET requests never trigger an admin-scoped token refresh
 * on 401.  The backend endpoints below are all public (no requireAdmin).
 */
import http from "@/lib/http"
import type { FAQ, FAQListResponse } from "@/components/admin/faqs/types"
import type { LiveStream, LiveStreamListResponse } from "@/components/admin/livestreams/types"
import type { Project, ProjectsListResponse } from "@/components/admin/projects/types"
import type { News, NewsListResponse } from "@/components/admin/news/types"
import type { Category, CategoryListResponse } from "@/components/admin/categories/types"
import type { ApiResponse } from "@/lib/http"

// ── FAQ ────────────────────────────────────────────────────────────

export async function getPublicFaqs(params?: {
  page?: number
  limit?: number
}): Promise<FAQListResponse> {
  const response = await http.get<FAQListResponse>("/faqs", { params })
  return response.data
}

// ── Live Streams ───────────────────────────────────────────────────

export async function getPublicLiveStreams(params?: {
  page?: number
  limit?: number
}): Promise<LiveStreamListResponse> {
  const response = await http.get<LiveStreamListResponse>("/live-streams", { params })
  return response.data
}

// ── Projects ───────────────────────────────────────────────────────

export async function getPublicProjects(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ProjectsListResponse> {
  const response = await http.get<ProjectsListResponse>("/projects", { params })
  return response.data
}

export async function getPublicProjectById(id: string): Promise<ApiResponse<Project>> {
  const response = await http.get<ApiResponse<Project>>(`/projects/${id}`)
  return response.data
}

// ── News ───────────────────────────────────────────────────────────

export async function getPublicNews(params?: {
  page?: number
  limit?: number
}): Promise<NewsListResponse> {
  const response = await http.get<NewsListResponse>("/news", { params })
  return response.data
}

export async function getPublicNewsById(id: string): Promise<ApiResponse<News>> {
  const response = await http.get<ApiResponse<News>>(`/news/${id}`)
  return response.data
}

// ── Categories ─────────────────────────────────────────────────────

export async function getPublicCategories(params?: {
  page?: number
  limit?: number
  search?: string
}): Promise<CategoryListResponse> {
  const response = await http.get<CategoryListResponse>("/categories", { params })
  return response.data
}

// ── Settings ───────────────────────────────────────────────────────

export interface PlatformSettings {
  id: string
  siteNameAr: string
  siteNameEn: string
  aboutUsTextAr: string
  aboutUsTextEn: string
  logoUrl: string | null
  aboutUsImageUrl: string | null
  contactPhone: string | null
  contactEmail: string | null
  totalBeneficiaries: number
  foodBaskets: number
  yearsOfGiving: number
  updatedAt: string
}

export async function getPublicSettings(): Promise<ApiResponse<PlatformSettings>> {
  const response = await http.get<ApiResponse<PlatformSettings>>("/settings")
  return response.data
}
