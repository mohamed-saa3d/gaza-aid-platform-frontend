import Image from "next/image"
import { CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { News } from "@/components/admin/news/types"

export function NewsArticleCard({ article }: { article: News }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.imageUrl || "/placeholder.svg"}
          alt={article.titleAr || article.titleEn}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {article.createdAt ?? ""}
          <CalendarDays className="size-3.5" aria-hidden="true" />
        </span>
        <h3 className="text-balance font-heading text-lg font-bold leading-snug text-foreground">
          {article.titleAr || article.titleEn}
        </h3>
        <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {article.descriptionAr || article.descriptionEn}
        </p>
        <button className="mt-1 self-start text-sm font-semibold text-primary hover:underline">اقرأ المزيد</button>
      </CardContent>
    </Card>
  )
}
