"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectProgress } from "@/components/project-progress"
import type { Project } from "@/lib/mock-data"

export function ProjectCard({ project }: { project: Project }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return

    const timeoutId = window.setTimeout(() => setCopied(false), 5000)
    return () => window.clearTimeout(timeoutId)
  }, [copied])

  const handleShare = async () => {
    if (typeof window === "undefined") return

    const shareUrl = `${window.location.origin}/projects/${project.slug}`

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

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge
          className="absolute end-3 top-3"
          variant={project.status === "urgent" ? "destructive" : "secondary"}
        >
          {project.status === "urgent" ? "إغاثة عاجلة" : "مستمر"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-lg font-bold text-foreground">{project.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>

        <ProjectProgress progress={project.progress} funded={project.funded} remaining={project.remaining} />

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
            <Link href={`/donate?project=${project.slug}`}>ساهم الآن</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
