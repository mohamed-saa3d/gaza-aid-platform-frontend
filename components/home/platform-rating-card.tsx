import { Star } from "lucide-react"
import { platformRating } from "@/lib/mock-data"

export function PlatformRatingCard() {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h3 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
        <Star className="size-4 fill-accent text-accent" />
        تقييم المنصة
      </h3>
      <p className="text-xs text-muted-foreground">شاركنا تقييمك لتحسين تجربتك</p>

      <div className="flex items-baseline gap-1">
        <span className="font-heading text-3xl font-extrabold text-foreground">{platformRating.score}</span>
        <span className="text-sm text-muted-foreground">/5</span>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={i < Math.round(platformRating.score) ? "size-5 fill-accent text-accent" : "size-5 text-border"}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">من {platformRating.count.toLocaleString("ar")} تقييم</p>
    </div>
  )
}
