import Image from "next/image"
import Link from "next/link"
import { Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProjectProgress } from "@/components/project-progress"
import type { Project } from "@/lib/mock-data"

export function ProjectCard({ project }: { project: Project }) {
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
          <Button variant="outline" size="icon" className="rounded-full" aria-label="مشاركة المشروع">
            <Share2 className="size-4" />
          </Button>
          <Button asChild className="flex-1 rounded-full">
            <Link href={`/donate?project=${project.slug}`}>ساهم الآن</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
