"use client"

import { Flower2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"

export function WartimeMission() {
  const { t } = useLocale()
  const paragraphs = [t.aboutPage.wartimeParagraph1, t.aboutPage.wartimeParagraph2]

  return (
    <section className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-foreground sm:text-3xl">{t.aboutPage.wartimeTitle}</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr] lg:items-center">
          <Card className="border-none bg-card">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <Flower2 className="size-8 text-destructive" aria-hidden="true" />
              <span className="font-heading text-5xl font-bold text-destructive">{t.aboutPage.wartimeHonorCount}</span>
              <span className="font-heading text-xl font-bold text-foreground">{t.aboutPage.wartimeHonorLabel}</span>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{t.aboutPage.wartimeHonorDescription}</p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-pretty leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
