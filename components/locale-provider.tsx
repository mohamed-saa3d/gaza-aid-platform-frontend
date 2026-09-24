"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { dictionary, type Locale, type LocaleDictionary } from "@/lib/dictionary"
import { DEFAULT_LOCALE, getActiveLocale, setActiveLocale } from "@/lib/http"

interface LocaleContextValue {
  locale: Locale
  dir: "rtl" | "ltr"
  t: LocaleDictionary
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted()
  // Start from the persisted preference so the very first public request is
  // already made in the visitor's language. Server render always uses the Arabic
  // default to avoid a hydration mismatch; the effect below corrects it.
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  // Tracks whether we have applied the persisted preference. Until then, the sync
  // effect must NOT publish the initial Arabic default to localStorage: doing so
  // overwrote a stored "en" with "ar" for one commit, so requests fired in that
  // window went out as `locale=ar` and their error toasts came back in Arabic even
  // though the visitor had chosen English.
  const [preferenceApplied, setPreferenceApplied] = useState(false)
  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    setLocale(getActiveLocale())
    setPreferenceApplied(true)
  }, [])

  useEffect(() => {
    // Sync locale to document element
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    if (preferenceApplied) {
      // Persist to localStorage for future visits AND publish it to the HTTP client,
      // so requests whose responses contain localized database content carry it.
      setActiveLocale(locale)
    }
  }, [locale, dir, preferenceApplied])

  // Only render context after hydration to avoid mismatch
  if (!isMounted) {
    return (
      <LocaleContext.Provider value={{ locale: "ar", dir: "rtl", t: dictionary.ar, toggleLocale: () => { } }}>
        {children}
      </LocaleContext.Provider>
    )
  }

  const toggleLocale = () => setLocale((prev) => (prev === "ar" ? "en" : "ar"))

  return (
    <LocaleContext.Provider value={{ locale, dir, t: dictionary[locale], toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider")
  return ctx
}
