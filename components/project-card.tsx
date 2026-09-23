"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectProgress } from "@/components/project-progress"
import type { Project } from "@/components/admin/projects/types"

export function ProjectCard({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => setCopied(false), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const handleShare = async () => {
    if (typeof window === "undefined") return

    const shareUrl = `${window.location.origin}/projects/${project.id}`

    try {
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        setCopied(false)
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  // `title`/`description`/`categoryName` are already localized by the backend for
// the locale the visitor selected, so they take precedence. The raw `titleAr`
  // fields remain only as a fallback for non-localized (admin/legacy) payloads.
  const title = project.title || project.titleAr || project.titleEn || ""
  const description = project.description || project.descriptionAr || project.descriptionEn || ""
  const image = project.imgUrl || project.imageUrl || project.image || "/placeholder.svg"
  // Populated by the API as an object; `null` means the project lost its category
  // when that category was deleted, in which case the badge is simply omitted.
  const categoryName =
    project.categoryName ||
    (typeof project.category === "object" ? project.category?.name : undefined)

  const target = project.targetAmount || 0
  const collected = project.collectedAmount || 0
  const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0
  const remaining = Math.max(target - collected, 0)

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          className="absolute end-3 top-3"
          variant={project.status === "ACTIVE" ? "secondary" : "default"}
        >
          {project.status === "ACTIVE" ? "مستمر" : project.status === "PAUSED" ? "متوقف" : "مكتمل"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        {categoryName ? (
          <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {categoryName}
          </span>
        ) : null}
        <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <ProjectProgress progress={progress} funded={collected} remaining={remaining} />

        <div className="mt-1 flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="مشاركة المشروع"
              onClick={handleShare}
            >
              <Share2 className="size-4" />
            </Button>
            {copied && (
              <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background shadow-sm">
                تم نسخ رابط المشاركة
              </span>
            )}
          </div>
          <Button asChild className="flex-1 rounded-full">
            <Link href={`/donate?project=${project.id}`}>ساهم الآن</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
