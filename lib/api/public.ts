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
import type { Project, ProjectCategory, ProjectsListResponse } from "@/components/admin/projects/types"
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
  /**
   * Filters by category. Omit it entirely for "All" so uncategorized projects
   * (those whose category was deleted) are still returned.
   */
  categoryId?: string
}): Promise<ProjectsListResponse> {
  const response = await http.get<ProjectsListResponse>("/projects", { params })
  return response.data
}

/** Categories that still own live projects — powers the public filter bar. */
export async function getPublicProjectCategories(): Promise<ApiResponse<ProjectCategory[]>> {
  const response = await http.get<ApiResponse<ProjectCategory[]>>("/projects/categories")
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

// ── Project Stats ──────────────────────────────────────────────────

export interface ProjectStats {
  totalProjects: number
  completedProjects: number
  completionPercentage: number
}

export async function getPublicProjectStats(): Promise<ApiResponse<ProjectStats>> {
  const response = await http.get<ApiResponse<ProjectStats>>("/projects/stats")
  return response.data
}

// ── Project history (real monthly series for the progress chart) ───

export interface ProjectHistoryPoint {
  /** Month bucket in `YYYY-MM` form, computed from real `createdAt` values. */
  month: string
  /** Cumulative projects existing by the end of that month. */
  total: number
  /** Of those, how many are now COMPLETED. */
  completed: number
}

/**
 * Real monthly project history derived from the database — not a mock series.
 * `months` is server-clamped to 1..24.
 */
export async function getPublicProjectHistory(
  months = 12
): Promise<ApiResponse<ProjectHistoryPoint[]>> {
  const response = await http.get<ApiResponse<ProjectHistoryPoint[]>>("/projects/history", {
    params: { months },
  })
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

// ── Platform Ratings ───────────────────────────────────────────────

export interface PlatformRatingAggregate {
  /** Real database average, rounded to one decimal. `0` when no ratings exist. */
  average: number
  /** Real number of stored ratings. */
  totalRatings: number
  /** Whether the current viewer (user or guest) has already rated. */
  hasRated: boolean
  /** The viewer's own score, or `null` when they have not rated. */
  viewerRating: number | null
}

/**
 * Public aggregate for the home page rating card.
 * Works for guests: the guest identity travels in an httpOnly cookie that the
 * browser attaches automatically (`withCredentials: true` on the shared client).
 */
export async function getPublicRatingAggregate(): Promise<ApiResponse<PlatformRatingAggregate>> {
  const response = await http.get<ApiResponse<PlatformRatingAggregate>>("/ratings/stats")
  return response.data
}

/**
 * Submits (or updates) the viewer's platform rating.
 * Allowed for both guests and authenticated users — no login required.
 */
export async function submitPlatformRating(
  value: number,
  comment?: string
): Promise<ApiResponse<{ value: number; aggregate: PlatformRatingAggregate }>> {
  const response = await http.post<ApiResponse<{ value: number; aggregate: PlatformRatingAggregate }>>(
    "/ratings",
    { value, ...(comment ? { comment } : {}) }
  )
  return response.data
}
