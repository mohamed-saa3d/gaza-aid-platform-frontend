"use client"

import { useMemo, useState, useEffect } from "react"
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
import { getPublicProjects } from "@/lib/api/public"
import { getPublicCategories } from "@/lib/api/public"
import type { Project } from "@/components/admin/projects/types"
import type { Category } from "@/components/admin/categories/types"
import { Loader2 } from "lucide-react"

const PAGE_SIZE = 6

export function ProjectsGrid() {
  const [filter, setFilter] = useState<FilterValue>("all")
  const [page, setPage] = useState(1)
  
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [projRes, catRes] = await Promise.all([
          getPublicProjects({ limit: 100 }),
          getPublicCategories({ limit: 100 })
        ])
        
        const rawProjects = Array.isArray(projRes?.data) ? projRes.data : []
        const rawCategories = Array.isArray(catRes?.data) ? catRes.data : []
        
        setProjects(rawProjects)
        setCategories(rawCategories)
      } catch (error) {
        console.error("Failed to load projects", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (filter === "all") return projects
    // Wait, backend urgent vs ongoing might not exist directly. 
    // We check if it maps to any specific status or property. For now let's say "urgent" might be a flag or category.
    // If we only have categoryId, we can match category.
    if (filter === "urgent") {
       // Filter by an "isUrgent" or similar field if it existed, otherwise fallback
       return projects // Adjust if there's an urgent flag
    }
    
    return projects.filter((p) => {
      const catId = typeof p.category === "string" ? p.category : p.category?.id
      return catId === filter || p.categoryId === filter
    })
  }, [filter, projects])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-primary size-8" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <CategoryFilterBar active={filter} onChange={handleFilterChange} categories={categories} />

      {paged.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((project) => (
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
