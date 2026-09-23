"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { useLocale } from "@/components/locale-provider"
import { getPublicProjectHistory, type ProjectHistoryPoint } from "@/lib/api/public"

const chartConfig: ChartConfig = {
  total: {
    label: "إجمالي المشاريع",
    color: "var(--chart-2)",
  },
  completed: {
    label: "المشاريع المكتملة",
    color: "var(--chart-1)",
  },
}

const ranges = [
  { id: "6", label: "6 أشهر", count: 6 },
  { id: "12", label: "12 شهر", count: 12 },
  { id: "24", label: "24 شهر", count: 24 },
] as const

export function ProgressOverTimeChart() {
  const isMounted = useIsMounted()
  const { locale } = useLocale()
  const [range, setRange] = useState<(typeof ranges)[number]["id"]>("12")

  const [series, setSeries] = useState<ProjectHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const requestedMonths = ranges.find((r) => r.id === range)?.count ?? 12

  // The series comes from the real Project collection (`GET /projects/history`).
  // There is deliberately no mock fallback: if the request fails the chart shows
  // an honest error state instead of inventing a plausible-looking curve.
  const loadHistory = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await getPublicProjectHistory(requestedMonths)
      setSeries(Array.isArray(res?.data) ? res.data : [])
    } catch (err) {
      console.error("Failed to load project history", err)
      setSeries([])
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [requestedMonths, locale])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const data = useMemo(
    () =>
      series.map((point) => ({
        ...point,
        rate: point.total > 0 ? Math.round((point.completed / point.total) * 100) : 0,
      })),
    [series]
  )

  if (!isMounted) {
    return (
      <Card className="border-border/60">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
          <CardTitle className="font-heading text-lg font-bold">
            نسبة تقدم المشاريع مع مرور الوقت
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full animate-pulse rounded-xl bg-muted" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
        <CardTitle className="font-heading text-lg font-bold">
          نسبة تقدم المشاريع مع مرور الوقت
        </CardTitle>
        <ToggleGroup
          value={[range]}
          onValueChange={(value) => {
            const next = value[0]
            if (next) setRange(next as typeof range)
          }}
          variant="outline"
          size="sm"
        >
          {ranges.map((r) => (
            <ToggleGroupItem key={r.id} value={r.id} className="rounded-full px-4">
              {r.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-[320px] items-center justify-center">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="flex h-[320px] items-center justify-center rounded-md border border-amber-300 bg-amber-50 p-3 text-center text-sm text-amber-900">
            تعذّر تحميل سجل تقدم المشاريع حالياً. يرجى تحديث الصفحة للمحاولة مرة أخرى.
          </p>
        ) : data.length === 0 ? (
          <p className="flex h-[320px] items-center justify-center text-center text-sm text-muted-foreground">
            لا توجد بيانات مشاريع كافية لعرض المخطط بعد.
          </p>
        ) : (
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-completed)" stopOpacity={0.5} />
                <stop offset="95%" stopColor="var(--color-completed)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.split(" ")[0]}
              fontSize={11}
            />            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => `${value}%`}
              domain={[0, 100]}
              fontSize={11}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="month"
                  formatter={(value, name, item) => {
                    if (name === "rate") return null
                    const label = chartConfig[name as keyof typeof chartConfig]?.label ?? name
                    return (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">{label}:</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Area
              dataKey="total"
              type="monotone"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              strokeWidth={2}
            />
            <Area
              dataKey="completed"
              type="monotone"
              fill="url(#fillCompleted)"
              stroke="var(--color-completed)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
