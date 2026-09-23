"use client"

import { useEffect, useState } from "react"
import { getPublicSettings } from "@/lib/api/public"

/** Static logo shipped with the app, used until an Admin uploads a real one. */
const FALLBACK_LOGO = "/images/logo-mark.png"

export interface SiteBranding {
  /** Cloudinary logo URL when set, otherwise the bundled static logo. */
  logoUrl: string
  /** True while the public settings request is still in flight. */
  loading: boolean
}

/**
 * Reads the Admin-controlled logo from the public settings endpoint.
 *
 * The SITE NAME is deliberately NOT read from the database any more: it is fixed
 * branding that lives in the i18n dictionary (`t.branding.siteName`), so it can
 * never be left blank by an empty settings row or diverge between the header,
 * the footer and page metadata. Only the logo remains DB-backed.
 */
export function useSiteBranding(): SiteBranding {
  const [settings, setSettings] = useState<{ logoUrl?: string | null } | null>(null)
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
  }, [])

  const logoUrl = settings?.logoUrl?.trim() || FALLBACK_LOGO

  return { logoUrl, loading }
}
