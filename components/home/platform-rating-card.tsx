import { useCallback, useEffect, useState } from "react"
import { Loader2, Star } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  getPublicRatingAggregate,
  submitPlatformRating,
  type PlatformRatingAggregate,
} from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import { getErrorMessage } from "@/lib/http"
import { formatNumber } from "@/lib/currency"
import { cn } from "@/lib/utils"

/**
 * Platform rating card.
 *
 * The average and count come from the real Rating collection — there is no mock
 * score anymore. Both guests and authenticated users can rate: the backend
 * identifies a guest through an httpOnly cookie it issues itself, so this
 * component never has to (and never does) send any identity of its own.
 */
export function PlatformRatingCard() {
  const { locale, t } = useLocale()
  const copy = t.rating

  const [aggregate, setAggregate] = useState<PlatformRatingAggregate | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadAggregate = useCallback(async () => {
    try {
      const res = await getPublicRatingAggregate()
      const data = res?.data ?? null
      setAggregate(data)
      setLoadError(false)
      if (data?.hasRated && data.viewerRating) {
        setSelected(data.viewerRating)
      }
    } catch (error) {
      console.error("Failed to load platform rating", error)
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAggregate()
  }, [loadAggregate, locale])

  const handleSubmit = async () => {
    if (!selected) {
      toast.warning(copy.selectRating)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitPlatformRating(selected)
      const updated = res?.data?.aggregate ?? null
      setAggregate(updated)
      toast.success(res?.message || copy.submitted)
    } catch (error) {
      toast.error(getErrorMessage(error) || copy.loadFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  const average = aggregate?.average ?? 0
  const totalRatings = aggregate?.totalRatings ?? 0
  const hasRated = aggregate?.hasRated ?? false
  const displayStars = hovered ?? selected ?? 0

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h3 className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
        <Star className="size-4 fill-accent text-accent" />
        {copy.title}
      </h3>
      <p className="text-xs text-muted-foreground">{copy.subtitle}</p>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : loadError ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          {copy.loadFailed}
        </p>
      ) : (
        <>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-3xl font-extrabold text-foreground">
              {average.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{copy.outOfFive}</span>
          </div>

          <div className="flex items-center gap-1" aria-label={`${average.toFixed(1)} ${copy.outOfFive}`}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={
                  index < Math.round(average)
                    ? "size-5 fill-accent text-accent"
                    : "size-5 text-border"
                }
              />
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            {totalRatings > 0
              ? copy.ratingCount.replace("{count}", formatNumber(totalRatings, locale))
              : copy.noRatings}
          </p>

          {/* Submission — open to guests and signed-in users alike. */}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <p className="text-xs font-medium text-foreground">
              {hasRated ? copy.yourRating : copy.selectRating}
            </p>

            <div
              className="flex items-center gap-1"
              role="radiogroup"
              aria-label={copy.selectRating}
              onMouseLeave={() => setHovered(null)}
            >
              {Array.from({ length: 5 }).map((_, index) => {
                const value = index + 1
                const isFilled = value <= displayStars

                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected === value}
                    aria-label={copy.starLabel.replace("{value}", String(value))}
                    disabled={isSubmitting}
                    onMouseEnter={() => setHovered(value)}
                    onClick={() => setSelected(value)}
                    className="rounded-md p-0.5 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Star
                      className={cn(
                        "size-6 transition-colors",
                        isFilled ? "fill-accent text-accent" : "text-border"
                      )}
                    />
                  </button>
                )
              })}
            </div>

            <Button
              type="button"
              size="sm"
              className="mt-1 w-full rounded-full"
              onClick={handleSubmit}
              disabled={isSubmitting || !selected}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="me-2 size-4 animate-spin" />
                  {copy.submitting}
                </>
              ) : hasRated ? (
                copy.updated
              ) : (
                copy.submit
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
