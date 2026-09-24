"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, Loader2 } from "lucide-react"
import { DonationWaysCard } from "@/components/home/donation-ways-card"
import { FeaturedProjectCarousel } from "@/components/home/featured-project-carousel"
import { PlatformRatingCard } from "@/components/home/platform-rating-card"
import { getPublicProjects } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import type { Project } from "@/components/admin/projects/types"

export function LifeSavingProjects() {
  const { locale, t } = useLocale()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await getPublicProjects({ limit: 6 })
        const data = Array.isArray(res?.data) ? res.data : []
        setProjects(data)
      } catch (err) {
        console.error("Failed to load home projects", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [locale])

  const featured = projects.slice(0, 3)

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{t.home.projectsTitle}</h2>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ChevronLeft className="size-4 ltr:rotate-180" />
          {t.home.viewAllProjects}
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary size-8" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:items-stretch">
            {/* Left Column on Desktop */}
            <div className="flex flex-col gap-8">
              <DonationWaysCard />
              <div className="flex-1">
                <PlatformRatingCard />
              </div>
            </div>

            {/* Right Column on Desktop */}
            <div className="flex flex-col gap-8">
              <FeaturedProjectCarousel projects={featured} />
            </div>
          </div>
        </>
      )}
    </section>
  )
}
