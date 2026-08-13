import Image from "next/image"
import { CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { NewsArticle } from "@/lib/mock-data"

export function NewsArticleCard({ article }: { article: NewsArticle }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
      </div>
      <CardContent className="flex flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {article.date}
          <CalendarDays className="size-3.5" aria-hidden="true" />
        </span>
        <h3 className="text-balance font-heading text-lg font-bold leading-snug text-foreground">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        <button className="mt-1 self-start text-sm font-semibold text-primary hover:underline">اقرأ المزيد</button>
      </CardContent>
    </Card>
  )
}
