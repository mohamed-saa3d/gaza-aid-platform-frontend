"use client"

import { useMemo, useState } from "react"
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
import { projects } from "@/lib/mock-data"

const PAGE_SIZE = 6

export function ProjectsGrid() {
  const [filter, setFilter] = useState<FilterValue>("all")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (filter === "all") return projects
    if (filter === "urgent") return projects.filter((p) => p.status === "urgent")
    return projects.filter((p) => p.category === filter)
  }, [filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-8">
      <CategoryFilterBar active={filter} onChange={handleFilterChange} />

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
