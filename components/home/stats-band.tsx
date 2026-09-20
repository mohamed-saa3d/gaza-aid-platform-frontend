"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CalendarDays,
  ChevronLeft,
  ClipboardCheck,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react"
import { heroStats } from "@/lib/mock-data"
import { getPublicSettings, type PlatformSettings } from "@/lib/api/public"

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Users,
  ClipboardCheck,
  CalendarDays,
}

export function StatsBand() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null)

  useEffect(() => {
    getPublicSettings()
      .then((res) => {
        if (res?.data) setSettings(res.data)
      })
      .catch(() => {
        // silently fall through to heroStats
      })
  }, [])

  /**
   * If the backend returns real stats (any non-zero value), use them.
   * Otherwise fall back to the mock heroStats so the UI is never empty.
   * The backend PlatformSettings model confirms these three fields exist.
   */
  const hasRealStats =
    settings !== null &&
    (settings.totalBeneficiaries > 0 ||
      settings.foodBaskets > 0 ||
      settings.yearsOfGiving > 0)

  const displayStats = hasRealStats
    ? [
        {
          id: "1",
          label: "وجبة غذائية موزعة",
          value: `${settings!.foodBaskets.toLocaleString()}+`,
          icon: "UtensilsCrossed",
        },
        {
          id: "2",
          label: "مستفيد من خدماتنا",
          value: `${settings!.totalBeneficiaries.toLocaleString()}+`,
          icon: "Users",
        },
        {
          id: "3",
          label: "سنوات العطاء",
          value: `${settings!.yearsOfGiving}+`,
          icon: "CalendarDays",
        },
        {
          id: "4",
          label: "مشروع إغاثي مكتمل",
          value: "100%",
          icon: "ClipboardCheck",
        },
      ]
    : heroStats

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-10 md:px-8 lg:flex-row lg:justify-between">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-10">
          {displayStats.map((stat) => {
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

        <div className="flex items-center gap-4 lg:flex-row-reverse">
          <h2 className="text-center font-heading text-xl font-bold md:text-2xl">أثر عطائكم في أرقام</h2>
          <Link
            href="/updates"
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/20"
          >
            عرض المزيد
            <ChevronLeft className="size-4 ltr:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  )
}
