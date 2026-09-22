"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Layers, Info, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getPublicProjectStats } from "@/lib/api/public"

const FALLBACK = { overallRate: 85, completedCount: 72, activeCount: 85 }

export function CompletionRateCard() {
  const [overallRate, setOverallRate] = useState<number | null>(null)
  const [completedCount, setCompletedCount] = useState<number | null>(null)
  const [activeCount, setActiveCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicProjectStats()
      .then((res) => {
        const d = res?.data
        if (d) {
          setOverallRate(d.completionPercentage)
          setCompletedCount(d.completedProjects)
          setActiveCount(d.totalProjects)
        }
      })
      .catch(() => {
        // silently fall through to fallback values below
      })
      .finally(() => setLoading(false))
  }, [])

  const displayRate = overallRate ?? FALLBACK.overallRate
  const displayCompleted = completedCount ?? FALLBACK.completedCount
  const displayActive = activeCount ?? FALLBACK.activeCount

  return (
    <Card className="flex flex-col justify-between border-border/60">
      <CardContent className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">نسبة الإنجاز العام</h3>
          <Info className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <div>
          {loading ? (
            <div className="flex items-center gap-2 py-1">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            <p className="font-heading text-5xl font-bold text-primary">{displayRate}%</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">من إجمالي المشاريع النشطة</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="font-heading text-xl font-bold">
                {loading ? <Loader2 className="size-4 animate-spin" /> : displayCompleted}
              </p>
              <p className="text-xs text-muted-foreground">مشروع مكتمل</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
            <Layers className="size-5 text-accent-foreground" aria-hidden="true" />
            <div>
              <p className="font-heading text-xl font-bold">
                {loading ? <Loader2 className="size-4 animate-spin" /> : displayActive}
              </p>
              <p className="text-xs text-muted-foreground">إجمالي المشاريع</p>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-auto w-full justify-center rounded-full"
        >
          معاً نصنع فرقاً حقيقياً ومستداماً
        </Button>
      </CardContent>
    </Card>
  )
}
