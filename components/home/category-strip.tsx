"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutGrid, Loader2 } from "lucide-react"
import { getPublicCategories } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import { resolveCategoryIcon } from "@/lib/category-icons"
import type { Category } from "@/components/admin/categories/types"

/** How many categories the Home strip shows before collapsing the rest. */
const PRIMARY_CATEGORY_COUNT = 6

export function CategoryStrip() {
  const { locale, t } = useLocale()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    // Uses the full category listing (not `/projects/categories`), because the
    // Home strip should present the six intended default categories even before
    // any project exists for them. The backend orders by `order` then `nameEn`,
    // so defaults come first without any client-side re-sorting.
    getPublicCategories({ limit: 100 })
      .then((res) => {
        if (!cancelled) setCategories(Array.isArray(res?.data) ? res.data : [])
      })
      .catch((err) => console.error("Failed to load categories", err))
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

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

  // The Home strip deliberately shows a bounded set instead of every category in
  // the database. Everything beyond the first six is reachable through a single
  // "Other Project Categories" entry that opens the full project filter list.
  const primary = categories.slice(0, PRIMARY_CATEGORY_COUNT)
  const hasOverflow = categories.length > PRIMARY_CATEGORY_COUNT

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap justify-center gap-4">
        {primary.map((category) => {
          const Icon = resolveCategoryIcon(category.icon)
          const label = category.name || category.nameAr || category.nameEn

          return (
            <Link
              key={category.id}
              href={`/projects?category=${category.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl p-3 text-center transition-colors hover:bg-secondary w-[100px]"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" />
              </span>
              <span className="text-xs font-medium text-foreground/80 sm:text-sm">{label}</span>
            </Link>
          )
        })}

        {hasOverflow && (
          <Link
            href="/projects"
            className="group flex flex-col items-center gap-3 rounded-2xl p-3 text-center transition-colors hover:bg-secondary w-[100px]"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <LayoutGrid className="size-6" />
            </span>
            <span className="text-xs font-medium text-foreground/80 sm:text-sm">
              {t.home.otherCategories}
            </span>
          </Link>
        )}
      </div>
    </section>
  )
}
