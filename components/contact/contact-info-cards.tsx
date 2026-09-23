"use client"

import { useEffect, useState } from "react"
import { Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getPublicSettings, type PlatformSettings } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"

export function ContactInfoCards() {
  const { locale } = useLocale()
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
      title: "المقر الرئيسي",
      lines: ["فلسطين"],
    },
    {
      icon: Phone,
      title: "خدمة العملاء",
      lines: phone ? [phone, "متاح من 9 صباحاً حتى 5 مساءً"] : [],
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      lines: email ? [email] : [],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {contactUnavailable && !loading && (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          تعذّر تحميل بيانات التواصل حالياً، يرجى تحديث الصفحة أو المحاولة لاحقاً.
        </p>
      )}
      {infoItems.map((item) => (
        <Card key={item.title} className="flex-row items-center justify-between gap-4 border-border/60 p-5">
          <div className="flex flex-col gap-1 text-end">
            <span className="font-heading text-sm font-bold">{item.title}</span>
            {loading ? (
              <div className="flex items-center justify-end gap-2 py-1 text-muted-foreground">
                <Loader2 className="size-3 animate-spin text-primary" />
              </div>
            ) : item.lines.length === 0 ? (
              <span className="text-sm text-muted-foreground">—</span>
            ) : (
              item.lines.map((line) => (
                <span key={line} className="text-sm text-muted-foreground">
                  {line}
                </span>
              ))
            )}
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon className="size-5" aria-hidden="true" />
          </span>
        </Card>
      ))}
    </div>
  )
}
