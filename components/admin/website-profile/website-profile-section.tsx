"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Globe, ImageUp, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { adminHttp, getErrorMessage } from "@/lib/http"
import type { PlatformSettings } from "@/lib/api/public"

/**
 * Website Profile — site name + site logo only.
 *
 * This is branding for the public website, NOT an administrator profile.
 * Both fields are persisted on the single PlatformSettings record and are read
 * back by the public settings endpoint that the public header/footer consume.
 */
export function WebsiteProfileSection() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [siteNameAr, setSiteNameAr] = useState("")
  const [siteNameEn, setSiteNameEn] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminHttp.get<{ data: PlatformSettings }>("/settings")
      const data = response.data.data
      setSettings(data)
      setSiteNameAr(data.siteNameAr ?? "")
      setSiteNameEn(data.siteNameEn ?? "")
      setLogoPreview(data.logoUrl ?? null)
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل تحميل بيانات الموقع")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  // Revoke the object URL when the admin picks a different file or leaves.
  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
    }
  }, [logoPreview])

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await adminHttp.put<{ data: PlatformSettings }>("/settings", {
        siteNameAr: siteNameAr.trim(),
        siteNameEn: siteNameEn.trim(),
      })
      setSettings(response.data.data)
      toast.success("تم حفظ بيانات الموقع بنجاح")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل حفظ بيانات الموقع")
    } finally {
      setSaving(false)
    }
  }

  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error("يرجى اختيار صورة الشعار أولاً")
      return
    }

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append("logo", logoFile)

      const response = await adminHttp.post<{ data: PlatformSettings }>("/settings/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      const data = response.data.data
      setSettings(data)
      setLogoFile(null)
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
      setLogoPreview(data.logoUrl ?? null)
      toast.success("تم رفع شعار الموقع بنجاح")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل رفع شعار الموقع")
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-primary" />
            اسم الموقع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="siteNameAr">اسم الموقع (بالعربية)</Label>
              <Input
                id="siteNameAr"
                value={siteNameAr}
                onChange={(event) => setSiteNameAr(event.target.value)}
                placeholder="أدخل اسم الموقع بالعربية"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="siteNameEn">اسم الموقع (بالإنجليزية)</Label>
              <Input
                id="siteNameEn"
                dir="ltr"
                value={siteNameEn}
                onChange={(event) => setSiteNameEn(event.target.value)}
                placeholder="Enter the website name in English"
                disabled={loading}
              />
            </div>
            <Button className="mt-2 w-full" disabled={loading || saving}>
              {saving ? <Loader2 className="ml-2 size-4 animate-spin" /> : <Save className="ml-2 size-4" />}
              حفظ الاسم
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageUp className="text-primary" />
            شعار الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border bg-muted">
              {loading ? (
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              ) : logoPreview ? (
                // Cloudinary (and blob previews) are remote/local URLs, so the
                // Next image optimizer is bypassed with `unoptimized`.
                <Image
                  src={logoPreview}
                  alt="شعار الموقع"
                  width={80}
                  height={80}
                  className="size-full object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-xs text-muted-foreground">لا يوجد شعار</span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="logo">اختر صورة الشعار (PNG / JPG / WebP)</Label>
              <Input
                id="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleLogoChange}
                disabled={loading || uploadingLogo}
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            يتم رفع الشعار إلى Cloudinary وحفظ الرابط في قاعدة البيانات، ثم يظهر في ترويسة الموقع وتذييله.
          </p>

          <Button
            type="button"
            className="w-full"
            onClick={handleLogoUpload}
            disabled={loading || uploadingLogo || !logoFile}
          >
            {uploadingLogo ? (
              <Loader2 className="ml-2 size-4 animate-spin" />
            ) : (
              <ImageUp className="ml-2 size-4" />
            )}
            رفع الشعار
          </Button>

          {settings?.logoUrl && !logoFile && (
            <p className="truncate text-xs text-muted-foreground" dir="ltr">
              {settings.logoUrl}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
