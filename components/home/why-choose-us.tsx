"use client"

import { BarChart3, HeartHandshake, ShieldCheck, Users2, type LucideIcon } from "lucide-react"
import { useLocale } from "@/components/locale-provider"

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  BarChart3,
  Users2,
  ShieldCheck,
}

/**
 * "Why choose us" — the heading and every tile are STATIC UI copy and therefore
 * come from the i18n dictionary, not from `mock-data`. The previous version
 * imported hardcoded Arabic from mock-data, which is why an Arabic heading stayed
 * visible in English mode.
 */
export function WhyChooseUs() {
  const { t } = useLocale()

  const items = [
    { id: "reach", title: t.why.reachTitle, description: t.why.reachDescription, icon: "HeartHandshake" },
    { id: "transparency", title: t.why.transparencyTitle, description: t.why.transparencyDescription, icon: "BarChart3" },
    { id: "execution", title: t.why.executionTitle, description: t.why.executionDescription, icon: "Users2" },
    { id: "trust", title: t.why.trustTitle, description: t.why.trustDescription, icon: "ShieldCheck" },
  ]

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h2 className="text-center font-heading text-2xl font-bold text-foreground md:text-3xl">
        {t.home.whyHeading}
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
