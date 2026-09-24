"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { Loader2, Radio, Save } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { adminHttp, getErrorMessage } from "@/lib/http"

interface PlatformSettings {
  contactPhone?: string | null
  contactEmail?: string | null
}

export function SettingsSection() {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminHttp.get<{ data: PlatformSettings }>("/settings")
      setPhone(response.data.data.contactPhone ?? "")
      setEmail(response.data.data.contactEmail ?? "")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل تحميل إعدادات التواصل")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await adminHttp.put<{ data: PlatformSettings }>("/settings", {
        contactPhone: phone,
        contactEmail: email,
      })
      setPhone(response.data.data.contactPhone ?? "")
      setEmail(response.data.data.contactEmail ?? "")
      toast.success("تم حفظ إعدادات التواصل بنجاح")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل حفظ إعدادات التواصل")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="text-primary" />
            إعدادات التواصل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="أدخل رقم الهاتف"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                dir="ltr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="أدخل البريد الإلكتروني"
                disabled={loading}
              />
            </div>
            <Button type="submit" className="mt-2 w-full" disabled={loading || saving}>
              {saving ? <Loader2 className="ml-2 size-4 animate-spin" /> : <Save className="ml-2 size-4" />}
              حفظ التحديثات
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
