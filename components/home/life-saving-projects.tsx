import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { projects } from "@/lib/mock-data"
import { DonationWaysCard } from "@/components/home/donation-ways-card"
import { FeaturedProjectCarousel } from "@/components/home/featured-project-carousel"
import { PlatformRatingCard } from "@/components/home/platform-rating-card"
import { ProjectCard } from "@/components/project-card"

export function LifeSavingProjects() {
  const featured = projects.slice(2, 5)
  const secondary = projects.slice(3, 6)

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">مشاريع تنقذ الحياة</h2>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="size-4 ltr:rotate-180" />
          عرض جميع المشاريع
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <DonationWaysCard />
        <FeaturedProjectCarousel projects={featured} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <PlatformRatingCard />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {secondary.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
