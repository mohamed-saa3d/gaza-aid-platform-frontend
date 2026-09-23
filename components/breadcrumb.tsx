"use client"

import Link from "next/link"
import { ChevronLeft, Home } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import type { LocaleDictionary } from "@/lib/dictionary"

/**
 * Localized breadcrumb.
 *
 * `label` is a key of the `breadcrumb` dictionary section, so the visible text is
 * always the active locale's label — the previous per-page hardcoded Arabic
 * breadcrumb stayed Arabic in English mode. The home crumb is always rendered
 * first and links back to `/`.
 */
export type BreadcrumbLabelKey = keyof LocaleDictionary["breadcrumb"]

export function Breadcrumb({ label, className }: { label: BreadcrumbLabelKey; className?: string }) {
  const { t } = useLocale()

  return (
    <nav
      className={className ?? "mb-6 flex items-center gap-2 text-sm text-muted-foreground"}
      aria-label={t.common.navigation}
    >
      <Link href="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-4" aria-hidden="true" />
        <span>{t.breadcrumb.home}</span>
      </Link>
      <ChevronLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
      <span className="font-medium text-foreground" aria-current="page">
        {t.breadcrumb[label]}
      </span>
    </nav>
  )
}

/**
 * Breadcrumb for a detail page (e.g. Project Details / News Details) whose final
 * crumb is a name that came from the localized API rather than the dictionary.
 */
export function BreadcrumbWithDetail({
  sectionLabel,
  sectionHref,
  detail,
  className,
}: {
  sectionLabel: BreadcrumbLabelKey
  sectionHref: string
  detail: string
  className?: string
}) {
  const { t } = useLocale()

  return (
    <nav
      className={className ?? "mb-6 flex items-center gap-2 text-sm text-muted-foreground"}
      aria-label={t.common.navigation}
    >
      <Link href="/" className="flex items-center gap-1 hover:text-foreground">
        <Home className="size-4" aria-hidden="true" />
        <span>{t.breadcrumb.home}</span>
      </Link>
      <ChevronLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
      <Link href={sectionHref} className="hover:text-foreground">
        {t.breadcrumb[sectionLabel]}
      </Link>
      <ChevronLeft className="size-4 ltr:rotate-180" aria-hidden="true" />
      <span className="line-clamp-1 font-medium text-foreground" aria-current="page">
        {detail}
      </span>
    </nav>
  )
}
