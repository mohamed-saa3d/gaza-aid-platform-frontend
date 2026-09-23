"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Layers, Info, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPublicProjectStats, type ProjectStats } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"

export function CompletionRateCard() {
  const { t } = useLocale()
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    getPublicProjectStats()
      .then((res) => {
        if (cancelled) return
        setStats(res?.data ?? null)
        setError(!res?.data)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("Failed to load project stats", err)
        // No invented numbers: show an honest empty state instead.
        setStats(null)
        setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (error || !stats) {
    return (
      <Card className="flex flex-col justify-between border-border/60">
        <CardContent className="flex flex-1 flex-col gap-4 p-6">
          <h3 className="font-heading text-lg font-bold">{t.updates.completionRateTitle}</h3>
          {loading ? (
            <div className="flex items-center gap-2 py-1">
              <Loader2 className="size-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">{t.updates.completionRateLoading}</span>
            </div>
          ) : (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              {t.updates.completionRateFailed}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col justify-between border-border/60">
      <CardContent className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">{t.updates.completionRateTitle}</h3>
          <Info className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div>
          <p className="font-heading text-5xl font-bold text-primary">
            {stats.completionPercentage}%
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{t.updates.ofTotalProjects}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-heading text-xl font-bold">{stats.completedProjects}</p>
              <p className="text-xs text-muted-foreground">{t.updates.completedProjectsLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <Layers className="size-5 text-accent-foreground" aria-hidden="true" />
            <div>
              <p className="font-heading text-xl font-bold">{stats.totalProjects}</p>
              <p className="text-xs text-muted-foreground">{t.updates.totalProjectsLabel}</p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-auto w-full justify-center rounded-full"
        >
          {t.updates.makeDifference}
        </Button>
      </CardContent>
    </Card>
  )
}
