import Image from "next/image"
import { CheckCircle2, CalendarDays, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/components/admin/projects/types"

export function CompletedUpdateCard({ project }: { project: Project }) {
  const title = project.title || project.titleAr || project.titleEn || ""
  const description = project.description || project.descriptionAr || project.descriptionEn || ""
  const image = project.imgUrl || project.imageUrl || project.image || "/placeholder.svg"
  const beneficiaries = project.beneficiariesCount ?? project.beneficiaries ?? 0
  const categoryName =
    project.categoryName ||
    (typeof project.category === "object" ? project.category?.name : undefined) ||
    "مشروع مكتمل"
  const dateStr = project.updatedAt ? new Date(project.updatedAt).toLocaleDateString("ar-EG") : ""

  return (
    <Card className="overflow-hidden border-border/60 p-0">
      <div className="relative aspect-video w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Badge className="absolute right-4 top-4 gap-1 rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          100% مكتمل
        </Badge>
        <div className="absolute bottom-4 right-4 max-w-[80%]">
          <p className="text-xs font-medium text-primary-foreground/80">{categoryName}</p>
          <h3 className="font-heading text-lg font-bold text-primary-foreground text-pretty">
            {title}
          </h3>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          {dateStr && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {dateStr}
            </span>
          )}
          {beneficiaries > 0 && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" aria-hidden="true" />
              {beneficiaries.toLocaleString("ar-EG")} مستفيد
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
