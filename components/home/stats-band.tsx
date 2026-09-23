"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ChevronLeft,
  ClipboardCheck,
  Loader2,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react"
import { getPublicSettings, getPublicProjectStats, type PlatformSettings } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import { formatNumber } from "@/lib/currency"

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Users,
  ClipboardCheck,
  CalendarDays,
}

interface StatItem {
  id: string
  label: string
  value: string
  icon: string
}

/**
 * Impact band under the hero.
 *
 * Every number here is real, Admin-controlled data:
 *   - food baskets / beneficiaries / years of giving come from PlatformSettings
 *     (edited in the Admin dashboard);
 *   - the completed-projects figure comes from the live Project collection.
 *
 * There is deliberately NO mock fallback. Previously this component silently
 * substituted a hardcoded `heroStats` array whenever the settings were empty,
 * which meant a fresh or misconfigured platform displayed invented impact numbers
 * as if they were real. A missing value now shows an honest dash instead.
 */
export function StatsBand() {
  const { locale, t } = useLocale()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [completedProjects, setCompletedProjects] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)

    Promise.all([
      getPublicSettings()
        .then((res) => res?.data ?? null)
        .catch(() => null),
      getPublicProjectStats()
        .then((res) => res?.data?.completedProjects ?? null)
        .catch(() => null),
    ])
      .then(([settingsData, completed]) => {
        if (cancelled) return
        setSettings(settingsData)
        setCompletedProjects(completed)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  const dash = "—"

  const stats: StatItem[] = [
    {
      id: "meals",
      label: locale === "ar" ? "وجبة غذائية موزعة" : "Meals distributed",
      value:
        settings && settings.foodBaskets > 0 ? `${formatNumber(settings.foodBaskets, locale)}+` : dash,
      icon: "UtensilsCrossed",
    },
    {
      id: "beneficiaries",
      label: locale === "ar" ? "مستفيد من خدماتنا" : "People reached",
      value:
        settings && settings.totalBeneficiaries > 0
          ? `${formatNumber(settings.totalBeneficiaries, locale)}+`
          : dash,
      icon: "Users",
    },
    {
      id: "years",
      label: locale === "ar" ? "سنوات العطاء" : "Years of giving",
      value: settings && settings.yearsOfGiving > 0 ? `${settings.yearsOfGiving}+` : dash,
      icon: "CalendarDays",
    },
    {
      id: "completed",
      label: locale === "ar" ? "مشروع مكتمل" : "Completed projects",
      value:
        completedProjects !== null && completedProjects > 0
          ? formatNumber(completedProjects, locale)
          : dash,
      icon: "ClipboardCheck",
    },
  ]

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-10 md:px-8 lg:flex-row lg:justify-between">
        {loading ? (
          <div className="flex items-center gap-2 py-4">
            <Loader2 className="size-5 animate-spin" />
            <span className="text-sm text-primary-foreground/75">{t.common.loading}</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-10">
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon] || Users

              return (
                <div key={stat.id} className="flex flex-col items-center gap-2 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary-foreground/10">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-heading text-2xl font-extrabold">{stat.value}</span>
                  <span className="text-xs text-primary-foreground/75 md:text-sm">{stat.label}</span>
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center gap-4 lg:flex-row-reverse">
          <h2 className="text-center font-heading text-xl font-bold md:text-2xl">
            {locale === "ar" ? "أثر عطائكم في أرقام" : "Your impact in numbers"}
          </h2>
          <Link
            href="/updates"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20"
          >
            {locale === "ar" ? "عرض المزيد" : "View more"}
            <ChevronLeft className="size-4 ltr:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  )
}
