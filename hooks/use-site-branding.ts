"use client"

import { useEffect, useState } from "react"
import { getPublicSettings, type PlatformSettings } from "@/lib/api/public"

/** Static logo shipped with the app, used until an Admin uploads a real one. */
const FALLBACK_LOGO = "/images/logo-mark.png"

export interface SiteBranding {
  /** Admin-configured site name for the active language, falling back to the dictionary. */
  siteName: string
  /** Cloudinary logo URL when set, otherwise the bundled static logo. */
  logoUrl: string
  /** True while the public settings request is still in flight. */
  loading: boolean
}

/**
 * Reads the Admin-controlled branding (site name + logo) from the public
 * settings endpoint. Used by both the public header and footer so the two can
 * never disagree about what the site is called or which logo it shows.
 *
 * `fallbackName` is the localized name from the i18n dictionary and is only used
 * when the database has no value yet — never to override a saved one.
 */
export function useSiteBranding(locale: "ar" | "en", fallbackName: string): SiteBranding {
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    getPublicSettings()
      .then((res) => {
        if (cancelled) return
        setSettings(res?.data ?? null)
      })
      .catch((error) => {
        if (cancelled) return
        console.error("Failed to load site branding settings", error)
        setSettings(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  const configuredName = locale === "ar" ? settings?.siteNameAr : settings?.siteNameEn
  const siteName = configuredName?.trim() || fallbackName || ""
  const logoUrl = settings?.logoUrl?.trim() || FALLBACK_LOGO

  return { siteName, logoUrl, loading }
}
