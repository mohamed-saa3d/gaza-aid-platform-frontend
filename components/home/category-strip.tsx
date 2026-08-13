import Link from "next/link"
import { BookOpen, Droplets, HeartPulse, Home, LayoutGrid, Users, Utensils, type LucideIcon } from "lucide-react"
import { categories } from "@/lib/mock-data"

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Users,
  BookOpen,
  HeartPulse,
  Home,
  Utensils,
  Droplets,
}

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((category) => {
          const Icon = iconMap[category.icon]
          return (
            <Link
              key={category.id}
              href={`/projects?category=${category.id}`}
              className="group flex flex-col items-center gap-3 rounded-2xl p-3 text-center transition-colors hover:bg-secondary"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" />
              </span>
              <span className="text-xs font-medium text-foreground/80 sm:text-sm">{category.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
