"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { dictionary, type Locale } from "@/lib/dictionary"

interface LocaleContextValue {
  locale: Locale
  dir: "rtl" | "ltr"
  t: typeof dictionary.ar
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar")
  const dir: "rtl" | "ltr" = locale === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

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
