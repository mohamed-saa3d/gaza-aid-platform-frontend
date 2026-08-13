"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectProgress } from "@/components/project-progress"
import { cn } from "@/lib/utils"
import type { Project } from "@/lib/mock-data"

export function FeaturedProjectCarousel({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0)
  const project = projects[active]

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/9] w-full">
        <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" priority />
      </div>

      <div className="flex flex-col gap-4 p-6">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">{project.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
        </div>

        <ProjectProgress progress={project.progress} funded={project.funded} remaining={project.remaining} />

        <div className="flex items-center gap-3">
          <Button asChild className="flex-1 rounded-full">
            <Link href={`/donate?project=${project.slug}`}>ساهم الآن</Link>
          </Button>
          <Button variant="outline" className="rounded-full">
            <Share2 className="size-4" data-icon="inline-start" />
            مشاركة
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              aria-label={`عرض ${p.title}`}
              onClick={() => setActive(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === active ? "w-6 bg-primary" : "w-2 bg-border hover:bg-primary/40",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
