"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { AxiosError } from "axios"
import Image from "next/image"
import {
  Plus,
  Search,
  FolderKanban,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { getProjects } from "./api"
import { getCategories } from "@/components/admin/categories/api"
import type { Category } from "@/components/admin/categories/types"
import type { Project } from "./types"
import type { PaginatedResponse } from "@/types/models"
import { useDebounce } from "@/hooks/use-debounce"
import { formatCurrency } from "@/lib/currency"
import { CreateProjectDialog } from "./create-project-dialog"
import { UpdateProjectDialog } from "./update-project-dialog"
import { DeleteProjectDialog } from "./delete-project-dialog"

export function ProjectsSection() {
  const [projectsData, setProjectsData] = useState<PaginatedResponse<Project> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Query State
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [search, setSearch] = useState("")
  // The filter value is a REAL category id (or "all"). It is never a hardcoded
  // slug — an earlier version used fake ids like "water"/"food" which the backend
  // rejected, since they are neither MongoDB ObjectIds nor valid statuses.
  const [category, setCategory] = useState<string>("all")
  const [categories, setCategories] = useState<Category[]>([])

  // 🔴 DEBOUNCED SEARCH: Prevents API flooding on rapid keystrokes (350ms delay)
  const debouncedSearch = useDebounce(search, 350)

  // Reset to page 1 whenever debounced search or category filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, category])

  useEffect(() => {
    let cancelled = false
    getCategories({ page: 1, limit: 100 })
      .then((res) => {
        if (!cancelled) setCategories(Array.isArray(res?.data) ? res.data : [])
      })
      .catch((error) => console.error("Failed to load categories for filter", error))
    return () => {
      cancelled = true
    }
  }, [])

  // Fetch Projects Callback
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await getProjects({
        page,
        limit,
        // "all" sends no category, so uncategorized projects stay visible too.
        categoryId: category !== "all" ? category : undefined,
      })
      setProjectsData(response)
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>
      console.error("Failed to fetch projects:", err)
      setError(axiosError?.response?.data?.message || "فشل في تحميل المشاريع من الخادم.")
    } finally {
      setLoading(false)
    }
  }, [page, limit, debouncedSearch, category])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const projects = Array.isArray(projectsData?.data) ? projectsData!.data : [];
  const meta = projectsData?.meta || { total: 0, page: 1, limit: 6, totalPages: 1 }

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderKanban className="text-primary" />
          إدارة المشاريع ({meta.total || 0})
        </CardTitle>

        <CreateProjectDialog
          onSuccess={fetchProjects}
          trigger={
            <Button size="sm" aria-label="إضافة مشروع جديد">
              <Plus className="ml-2 size-4" />
              إضافة مشروع جديد
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between gap-4">
        {/* Filters & Search Header */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pr-9"
              placeholder="ابحث عن مشروع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="w-44">
            <Select
              value={category}
              onValueChange={(val) => {
                if (val) setCategory(val)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل التصنيفات</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameAr || cat.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects List Content */}
        <div className="flex flex-col gap-3 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col gap-3 py-6 items-center justify-center text-muted-foreground my-auto">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">جاري تحميل المشاريع...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center my-auto">
              <AlertCircle className="size-8 text-destructive" />
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchProjects} className="mt-2">
                <RefreshCw className="ml-2 size-3" />
                إعادة المحاولة
              </Button>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center my-auto text-muted-foreground">
              <FolderKanban className="size-10 text-muted-foreground/50" />
              <p className="text-sm font-medium">لم يتم العثور على أي مشاريع.</p>
              <p className="text-xs">جرّب تغيير كلمات البحث أو قم بإضافة مشروع جديد.</p>
            </div>
          ) : (
            projects.map((item) => {
              const targetVal = item.targetAmount || item.target || 0
              const fundedVal = item.collectedAmount || item.funded || 0
              const calcProgress =
                item.progressPercentage ?? item.progress ?? (targetVal > 0 ? Math.round((fundedVal / targetVal) * 100) : 0)
              const itemTitle = item.titleAr || item.title || item.titleEn || "مشروع بدون عنوان"
              const itemImage = item.imgUrl || item.imageUrl || item.image || "/images/placeholder.jpg"

              return (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40"
                >
                  <div className="relative h-24 w-full sm:w-28 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={itemImage}
                      alt={itemTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-sm sm:text-base line-clamp-1">
                          {itemTitle}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground">
                          المستهدف: {formatCurrency(targetVal, "ar")} · تم جمع:{" "}
                          {formatCurrency(fundedVal, "ar")}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <UpdateProjectDialog project={item} onSuccess={fetchProjects} />
                        <DeleteProjectDialog
                          projectId={item.id}
                          projectTitle={itemTitle}
                          onSuccess={fetchProjects}
                        />
                      </div>
                    </div>

                    <Progress value={calcProgress} className="mt-3 h-2" />
                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className="text-primary font-medium">{calcProgress}% مكتمل</span>
                      <span className="text-muted-foreground capitalize">{item.status}</span>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {/* Dynamic Pagination Controls */}
        {meta.totalPages > 1 && (
          <div className="pt-2 border-t">
            <Pagination>
              <PaginationContent className="flex items-center gap-2">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page <= 1 || loading}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <PaginationPrevious />
                  </Button>
                </PaginationItem>

                <span className="text-xs font-medium px-3 text-muted-foreground">
                  صفحة {meta.page} من {meta.totalPages}
                </span>

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= meta.totalPages || loading}
                    onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                  >
                    <PaginationNext />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
