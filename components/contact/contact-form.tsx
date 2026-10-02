"use client"

import { useState } from "react"
import { Loader2, Mail, Phone, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useLocale } from "@/components/locale-provider"
import { getPublicSettings } from "@/lib/api/public"

export function ContactForm() {
  const { t } = useLocale()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const inquiryTypes = [
    { id: "donation", label: t.contactForm.typeDonation },
    { id: "project", label: t.contactForm.typeProject },
    { id: "partnership", label: t.contactForm.typePartnership },
    { id: "other", label: t.contactForm.typeOther },
  ]

  const [settings, setSettings] = useState<{ contactPhone?: string; contactEmail?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await getPublicSettings()
      if (res.data) {
        setSettings({
          contactPhone: res.data.contactPhone ?? undefined,
          contactEmail: res.data.contactEmail ?? undefined,
        })
      }
    } catch {
      // Ignore fallback
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-10 text-center">
        <Mail className="size-8 text-primary" aria-hidden="true" />
        <h3 className="font-heading text-lg font-bold">{t.contactForm.unavailableTitle}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {t.contactForm.unavailableBody
            .replace('{phone}', settings.contactPhone || '—')
            .replace('{email}', settings.contactEmail || '—')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="font-heading text-xl font-bold">{t.contactForm.title}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">{t.contactForm.nameLabel}</Label>
          <div className="relative">
            <User className="absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" aria-hidden="true" />
            <Input id="contact-name" placeholder={t.contactForm.namePlaceholder} required className="ps-9" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">{t.contactForm.emailLabel}</Label>
          <div className="relative">
            <Mail className="absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" aria-hidden="true" />
            <Input id="contact-email" type="email" placeholder={t.contactForm.emailPlaceholder} required className="ps-9" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-phone">{t.contactForm.phoneLabel}</Label>
        <div className="relative">
          <Phone className="absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" aria-hidden="true" />
          <Input id="contact-phone" type="tel" placeholder={t.contactForm.phonePlaceholder} className="ps-9" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-type">{t.contactForm.typeLabel}</Label>
        <Select defaultValue="">
          <SelectTrigger id="contact-type" className="w-full">
            <SelectValue placeholder={t.contactForm.typePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {inquiryTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-message">{t.contactForm.messageLabel}</Label>
        <Textarea id="contact-message" placeholder={t.contactForm.messagePlaceholder} rows={5} required />
      </div>

      <Button type="submit" size="lg" className="w-full gap-2 rounded-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="size-4 animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <Send className="size-4" data-icon="inline-start" aria-hidden="true" />
        )}
        {t.contactForm.submit}
      </Button>
    </form>
  )
}
