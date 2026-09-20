"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutGrid, Loader2 } from "lucide-react"
import { getPublicCategories } from "@/lib/api/public"
import type { Category } from "@/components/admin/categories/types"

export function CategoryStrip() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await getPublicCategories({ limit: 10 })
        const data = Array.isArray(res?.data) ? res.data : []
        setCategories(data)
      } catch (err) {
        console.error("Failed to load categories", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-primary size-6" />
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/projects?category=${category.id}`}
            className="group flex flex-col items-center gap-3 rounded-2xl p-3 text-center transition-colors hover:bg-secondary w-[100px]"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <LayoutGrid className="size-6" />
            </span>
            <span className="text-xs font-medium text-foreground/80 sm:text-sm">
              {category.nameAr || category.nameEn}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
