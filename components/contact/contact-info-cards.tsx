"use client"

import { useEffect, useState } from "react"
import { Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getPublicSettings, type PlatformSettings } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"

export function ContactInfoCards() {
  const { locale, t } = useLocale()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    getPublicSettings()
      .then((res) => {
        if (cancelled) return
        setSettings(res?.data ?? null)
        setError(false)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("Failed to load contact settings", err)
        setError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  // Contact details are Admin-controlled and must come from the database.
  // A failed fetch shows an honest state instead of invented contact info.
  const phone = settings?.contactPhone?.trim() || null
  const email = settings?.contactEmail?.trim() || null
  // A 404/429 must not be reported as "no contact data" — that would tell a
  // visitor with a perfectly configured site that contact info is missing.
  const contactUnavailable = error

  const infoItems = [
    {
      icon: MapPin,
      title: t.contact.headquarters,
      lines: [t.footer.location],
    },
    {
      icon: Phone,
      title: t.contact.customerService,
      lines: phone ? [phone, t.contact.phoneHours] : [],
    },
    {
      icon: Mail,
      title: t.contact.emailLabel,
      lines: email ? [email] : [],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {contactUnavailable && !loading && (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          {t.contact.unavailable}
        </p>
      )}
      {infoItems.map((item) => (
        <Card key={item.title} className="h-full flex-row items-center justify-start gap-3 border-border/60 px-5 py-5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1 text-start">
            <span className="font-heading text-sm font-bold">{item.title}</span>
            {loading ? (
              <div className="flex items-center justify-start gap-2 py-1 text-muted-foreground">
                <Loader2 className="size-3 animate-spin text-primary" />
              </div>
            ) : item.lines.length === 0 ? (
              <span className="text-sm text-muted-foreground">{t.contact.noValue}</span>
            ) : (
              item.lines.map((line) => (
                <span key={line} className="text-sm text-muted-foreground">
                  {line}
                </span>
              ))
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
