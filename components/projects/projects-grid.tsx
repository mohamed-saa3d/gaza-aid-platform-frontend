"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ProjectCard } from "@/components/project-card"
import { CategoryFilterBar, type FilterValue } from "@/components/projects/category-filter-bar"
import { getPublicProjects, getPublicProjectCategories } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import type { Project, ProjectCategory } from "@/components/admin/projects/types"
import { Loader2 } from "lucide-react"

const PAGE_SIZE = 6

export function ProjectsGrid() {
  // `locale` is a dependency of both loaders: switching language re-fetches the
  // localized content from the backend instead of only re-labelling the UI.
  const { locale } = useLocale()
  const [filter, setFilter] = useState<FilterValue>("all")
  const [page, setPage] = useState(1)

  const [projects, setProjects] = useState<Project[]>([])
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [loading, setLoading] = useState(true)

  // The filter bar is loaded independently of the project list so changing the
  // filter never re-fetches (and never flickers) the category buttons.
  useEffect(() => {
    let cancelled = false

    getPublicProjectCategories()
      .then((res) => {
        if (!cancelled) setCategories(Array.isArray(res?.data) ? res.data : [])
      })
      .catch((error) => console.error("Failed to load project categories", error))

    return () => {
      cancelled = true
    }
  }, [locale])

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      // "all" sends no categoryId at all, so the backend returns every project
      // including the uncategorized ones. A specific category filters server-side,
      // which keeps pagination correct.
      const categoryId = filter === "all" || filter === "urgent" ? undefined : filter
      const res = await getPublicProjects({ page, limit: PAGE_SIZE, categoryId })

      setProjects(Array.isArray(res?.data) ? res.data : [])
      setTotal(res?.meta?.total ?? 0)
    } catch (error) {
      console.error("Failed to load projects", error)
    } finally {
      setLoading(false)
    }
  }, [filter, page, locale])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-8">
      <CategoryFilterBar active={filter} onChange={handleFilterChange} categories={categories} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">لا توجد مشاريع في هذا التصنيف حالياً.</p>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.max(1, p - 1))
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setPage((p) => Math.min(totalPages, p + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
