import { Home, ChevronLeft, Sprout } from "lucide-react"
import Link from "next/link"
import { ProjectsGrid } from "@/components/projects/projects-grid"

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="size-4" />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft className="size-4 ltr:rotate-180" />
        <span className="font-medium text-foreground">مشاريعنا</span>
      </nav>

      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
          <Sprout className="size-7 text-primary" aria-hidden="true" />
          تصفح المشاريع
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          اختر المشروع الذي ترغب في المساهمة فيه
        </p>
      </div>

      <ProjectsGrid />
    </main>
  )
}
