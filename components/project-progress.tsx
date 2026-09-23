import { Progress } from "@/components/ui/progress"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"

export function ProjectProgress({
  progress,
  funded,
  remaining,
}: {
  progress: number
  funded: number
  remaining: number
}) {
  // Currency formatting is centralized in `@/lib/currency` so every amount on the
  // site renders in the same display currency (USD) with the same rules.
  const { locale, t } = useLocale()
  const copy = t.common

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-semibold text-primary">
        <span />
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {copy.remaining}:{" "}
          <span className="font-semibold text-foreground">
            {formatCurrency(remaining, locale)}
          </span>
        </span>
        <span>
          {copy.funded}:{" "}
          <span className="font-semibold text-foreground">{formatCurrency(funded, locale)}</span>
        </span>
      </div>
    </div>
  )
}
