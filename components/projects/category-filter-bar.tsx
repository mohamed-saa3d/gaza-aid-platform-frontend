"use client"

import { cn } from "@/lib/utils"
import { filterCategories, type CategoryId } from "@/lib/mock-data"

export type FilterValue = CategoryId | "all" | "urgent"

export function CategoryFilterBar({
  active,
  onChange,
}: {
  active: FilterValue
  onChange: (value: FilterValue) => void
}) {
  return (
    <div className="-mx-4 px-4 md:-mx-8 md:px-8">
      <div className="flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-2 pb-2 md:overflow-visible md:flex-wrap md:justify-center md:gap-3">
        {filterCategories.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id as FilterValue)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
