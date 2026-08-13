"use client"

import { useState } from "react"
import { Loader2, Mail, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const inquiryTypes = [
  { id: "donation", label: "استفسار عن التبرعات" },
  { id: "project", label: "استفسار عن مشروع" },
  { id: "partnership", label: "شراكات وتعاون" },
  { id: "other", label: "أخرى" },
]

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border/60 bg-secondary/40 p-10 text-center">
        <Mail className="size-8 text-primary" aria-hidden="true" />
        <h3 className="font-heading text-lg font-bold">تم إرسال رسالتك بنجاح</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          شكراً لتواصلك معنا، سيقوم فريقنا بالرد عليك في أقرب وقت ممكن.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="font-heading text-xl font-bold">نموذج التواصل</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-name">الاسم بالكامل</Label>
          <div className="relative">
            <User className="absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" aria-hidden="true" />
            <Input id="contact-name" placeholder="أدخل اسمك الكامل" required className="ps-9" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" aria-hidden="true" />
            <Input id="contact-email" type="email" placeholder="أدخل بريدك الإلكتروني" required className="ps-9" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-phone">رقم الجوال</Label>
        <Input id="contact-phone" type="tel" placeholder="أدخل رقم جوالك" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contact-type">نوع الاستفسار</Label>
        <Select defaultValue="">
          <SelectTrigger id="contact-type" className="w-full">
            <SelectValue placeholder="اختر نوع الاستفسار" />
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
        <Label htmlFor="contact-message">نص الرسالة</Label>
        <Textarea id="contact-message" placeholder="اكتب رسالتك هنا..." rows={5} required />
      </div>

      <Button type="submit" size="lg" className="w-full gap-2 rounded-full" disabled={submitting}>
        {submitting ? (
          <Loader2 className="size-4 animate-spin" data-icon="inline-start" aria-hidden="true" />
        ) : (
          <Send className="size-4" data-icon="inline-start" aria-hidden="true" />
        )}
        إرسال الرسالة
      </Button>
    </form>
  )
}
