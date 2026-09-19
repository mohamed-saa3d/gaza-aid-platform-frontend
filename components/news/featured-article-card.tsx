import Image from "next/image"
import { CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { News } from "@/components/admin/news/types"

export function FeaturedArticleCard({ article }: { article: News }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2 lg:items-center lg:gap-10">
        <div className="flex flex-col gap-4">
          {article.isUrgent ? <Badge className="w-fit rounded-full bg-destructive/10 text-destructive">عاجل</Badge> : null}
          <h2 className="text-balance font-heading text-xl font-bold leading-snug text-foreground sm:text-2xl">
            {article.titleAr || article.titleEn}
          </h2>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {article.createdAt ?? ""}
            <CalendarDays className="size-3.5" aria-hidden="true" />
          </span>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            {article.descriptionAr || article.descriptionEn}
          </p>
          <Button className="w-fit rounded-full">اقرأ التفاصيل</Button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-auto lg:h-full lg:min-h-[280px]">
          <Image
            src={article.imageUrl || "/placeholder.svg"}
            alt={article.titleAr || article.titleEn}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  )
}
