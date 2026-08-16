"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useIsMounted } from "@/hooks/use-is-mounted"
import { dictionary, type Locale, type LocaleDictionary } from "@/lib/dictionary"

interface LocaleContextValue {
  locale: Locale
  dir: "rtl" | "ltr"
  t: LocaleDictionary
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const isMounted = useIsMounted()
  const [locale, setLocale] = useState<Locale>("ar")
  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    // Sync locale to document element
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    // Persist to localStorage for future visits
    localStorage.setItem("preferred-locale", locale)
  }, [locale, dir])

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
