"use client"

import type { LucideIcon } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import type { LocaleDictionary } from "@/lib/dictionary"

type Section = keyof LocaleDictionary

/**
 * Localized page heading + optional subtitle.
 *
 * Server pages cannot read the client locale, so this tiny client component owns
 * the translated title/subtitle while the page keeps its server-rendered layout.
 * `titleKey`/`subtitleKey` are dictionary keys, which is what makes the heading
 * switch with the locale instead of staying Arabic.
 */
export function LocalizedHeading({
  section,
  titleKey,
  subtitleKey,
  icon: Icon,
}: {
  section: Section
  titleKey: string
  subtitleKey?: string
  icon?: LucideIcon
}) {
  const { t } = useLocale()
  const sectionDict = t[section] as Record<string, string>

  return (
    <div className="mb-10 text-center">
      <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
        {sectionDict[titleKey]}
        {Icon ? <Icon className="size-7 text-primary" aria-hidden="true" /> : null}
      </h1>
      {subtitleKey ? (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          {sectionDict[subtitleKey]}
        </p>
      ) : null}
    </div>
  )
}
