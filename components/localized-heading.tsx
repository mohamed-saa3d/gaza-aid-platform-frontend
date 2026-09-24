"use client"

import { useLocale } from "@/components/locale-provider"
import type { LocaleDictionary } from "@/lib/dictionary"
import type { ReactNode } from "react"

type Section = keyof LocaleDictionary

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

/**
 * Localized page heading + optional subtitle.
 *
 * Server pages cannot read the client locale, so this tiny client component owns
 * the translated title/subtitle while the page keeps its server-rendered layout.
 * `titleKey`/`subtitleKey` are constrained to the STRING keys of the section, so a
 * typo is a compile error instead of a silently missing translation.
 *
 * `icon` is a pre-rendered node (e.g. `<Sprout />`) rather than a component
 * reference: a bare function cannot cross the server -> client boundary.
 */
export function LocalizedHeading<S extends Section>({
  section,
  titleKey,
  subtitleKey,
  icon,
}: {
  section: S
  titleKey: StringKeys<LocaleDictionary[S]>
  subtitleKey?: StringKeys<LocaleDictionary[S]>
  icon?: ReactNode
}) {
  const { t } = useLocale()
  const sectionDict = t[section]

  return (
    <div className="mb-10 text-center">
      <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
        {sectionDict[titleKey as keyof typeof sectionDict]}
        {icon}
      </h1>
      {subtitleKey ? (
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          {sectionDict[subtitleKey as keyof typeof sectionDict]}
        </p>
      ) : null}
    </div>
  )
}
