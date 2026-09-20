"use client"

import { useEffect, useState } from "react"
import { Mail, MapPin, Phone, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getPublicSettings, type PlatformSettings } from "@/lib/api/public"

export function ContactInfoCards() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicSettings()
      .then((res) => {
        setSettings(res?.data ?? null)
      })
      .catch((err) => {
        console.error("Failed to load contact settings", err)
      })
      .finally(() => setLoading(false))
  }, [])

  const phone = settings?.contactPhone || "+20 10 9273 1005"
  const email = settings?.contactEmail || "info@qudsrelief.org"

  const infoItems = [
    {
      icon: MapPin,
      title: "المقر الرئيسي",
      lines: ["فلسطين"],
    },
    {
      icon: Phone,
      title: "خدمة العملاء",
      lines: [phone, "متاح من 9 صباحاً حتى 5 مساءً"],
    },
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      lines: [email],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {infoItems.map((item) => (
        <Card key={item.title} className="flex-row items-center justify-between gap-4 border-border/60 p-5">
          <div className="flex flex-col gap-1 text-end">
            <span className="font-heading text-sm font-bold">{item.title}</span>
            {loading ? (
              <div className="flex items-center justify-end gap-2 py-1 text-muted-foreground">
                <Loader2 className="size-3 animate-spin text-primary" />
              </div>
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
