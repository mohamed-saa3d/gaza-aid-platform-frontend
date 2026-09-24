"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectProgress } from "@/components/project-progress"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import type { Project } from "@/components/admin/projects/types"

export function FeaturedProjectCarousel({ projects }: { projects: Project[] }) {
  const { t } = useLocale()
  const [active, setActive] = useState(0)

  if (!projects || projects.length === 0) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-muted-foreground">{t.home.noFeatured}</p>
      </div>
    )
  }

  const project = projects[active]

  const title = project.title || project.titleAr || project.titleEn || ""
  const description = project.description || project.descriptionAr || project.descriptionEn || ""
  const image = project.imgUrl || project.imageUrl || project.image || "/placeholder.svg"

  const target = project.targetAmount || 0
  const collected = project.collectedAmount || 0
  const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0
  const remaining = Math.max(target - collected, 0)

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/9] w-full">
        <Image src={image} alt={title} fill className="object-cover" priority />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <ProjectProgress progress={progress} funded={collected} remaining={remaining} />

        <div className="flex items-center gap-3">
          <Button asChild className="flex-1 rounded-full">
            <Link href={`/donate?project=${project.id}`}>{t.common.contributeNow}</Link>
          </Button>
          <Button variant="outline" className="rounded-full">
            <Share2 className="size-4" data-icon="inline-start" />
            {t.common.shareAction}
          </Button>
        </div>

        {projects.length > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2">
            {projects.map((p, i) => {
              const pTitle = p.title || p.titleAr || p.titleEn || p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`${t.home.viewItemAria} ${pTitle}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/40",
                  )}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
