"use client"

import { BookOpen, Droplets, HeartPulse, Home, Landmark, Users, Utensils, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"

const iconMap: Record<string, LucideIcon> = {
  Users, BookOpen, HeartPulse, Home, Droplets, Utensils,
}

export function FoundationInfoCard() {
  const { t } = useLocale()

  const focusAreas = [
    { id: "water", label: t.aboutPage.focusWater, icon: "Droplets" },
    { id: "food", label: t.aboutPage.focusFood, icon: "Utensils" },
    { id: "shelter", label: t.aboutPage.focusShelter, icon: "Home" },
    { id: "orphans", label: t.aboutPage.focusOrphans, icon: "Users" },
    { id: "health", label: t.aboutPage.focusHealth, icon: "HeartPulse" },
    { id: "education", label: t.aboutPage.focusEducation, icon: "BookOpen" },
  ]

  return (
    <Card>
      <CardContent className="flex flex-col gap-8 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Landmark className="size-6 text-primary" aria-hidden="true" />
            <h2 className="font-heading text-2xl font-bold text-foreground">{t.aboutPage.infoName}</h2>
          </div>
          <p className="text-pretty leading-relaxed text-muted-foreground">{t.aboutPage.infoDescription}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {focusAreas.map((area) => {
            const Icon = iconMap[area.icon]
            return (
              <div key={area.id} className="flex flex-col items-center gap-2 text-center">
                <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium text-foreground/80 sm:text-sm">{area.label}</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
