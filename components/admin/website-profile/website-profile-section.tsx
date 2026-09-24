"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ImageUp, Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { adminHttp, getErrorMessage } from "@/lib/http"
import { useLocale } from "@/components/locale-provider"
import type { PlatformSettings } from "@/lib/api/public"

/**
 * Website Profile — the site LOGO plus the public أثر عطائكم في أرقام.
 *
 * The site NAME is no longer editable here. It is fixed, localized branding that
 * lives in the frontend dictionary (`t.branding.siteName`), so it can never be
 * left blank or drift from what the header, footer and metadata render. Only the
 * logo is Admin-controlled: uploaded to Cloudinary and read back by the public
 * settings endpoint the header and footer consume.
 *
 * The three أثر عطائكم في أرقام (meals distributed / people reached / years of giving)
 * are edited here and rendered by the homepage `StatsBand`, which reads the same
 * public settings endpoint.
 */
export function WebsiteProfileSection() {
  const { t } = useLocale()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Kept as strings so an empty field stays empty instead of turning into 0.
  const [foodBaskets, setFoodBaskets] = useState("")
  const [totalBeneficiaries, setTotalBeneficiaries] = useState("")
  const [yearsOfGiving, setYearsOfGiving] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await adminHttp.get<{ data: PlatformSettings }>("/settings")
      const settings = response.data.data
      setSettings(settings)
      setLogoPreview(settings.logoUrl ?? null)
      setFoodBaskets(settings.foodBaskets != null ? String(settings.foodBaskets) : "")
      setTotalBeneficiaries(
        settings.totalBeneficiaries != null ? String(settings.totalBeneficiaries) : "",
      )
      setYearsOfGiving(settings.yearsOfGiving != null ? String(settings.yearsOfGiving) : "")
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

      const uploaded = response.data.data
      setSettings(uploaded)
      setLogoFile(null)
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview)
      setLogoPreview(uploaded.logoUrl ?? null)
      toast.success("تم رفع شعار الموقع بنجاح")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل رفع شعار الموقع")
    } finally {
      setUploadingLogo(false)
    }
  }

  /**
   * Parses an impact-number field. Empty means "not provided" and is skipped,
   * so clearing a box never sends 0 (or NaN) over an existing value.
   */
  const parseCount = (raw: string): number | undefined | null => {
    const value = raw.trim()
    if (value === "") return undefined
    if (!/^\d+$/.test(value)) return null
    return Number(value)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const baskets = parseCount(foodBaskets)
    const beneficiaries = parseCount(totalBeneficiaries)
    const years = parseCount(yearsOfGiving)

    if (baskets === null || beneficiaries === null || years === null) {
      toast.error(t.websiteProfile.invalidNonNegativeInteger)
      return
    }

    const payload: Record<string, number> = {}
    if (baskets !== undefined) payload.foodBaskets = baskets
    if (beneficiaries !== undefined) payload.totalBeneficiaries = beneficiaries
    if (years !== undefined) payload.yearsOfGiving = years

    if (Object.keys(payload).length === 0) {
      toast.error(t.websiteProfile.invalidNonNegativeInteger)
      return
    }

    setSaving(true)
    try {
      const response = await adminHttp.put<{ data: PlatformSettings }>("/settings", payload)
      const updated = response.data.data
      setSettings(updated)
      setFoodBaskets(updated.foodBaskets != null ? String(updated.foodBaskets) : "")
      setTotalBeneficiaries(
        updated.totalBeneficiaries != null ? String(updated.totalBeneficiaries) : "",
      )
      setYearsOfGiving(updated.yearsOfGiving != null ? String(updated.yearsOfGiving) : "")
      toast.success("تم حفظ أرقام الأثر بنجاح")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل حفظ أرقام الأثر")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="flex max-w-2xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageUp className="text-primary" />
            شعار الموقع
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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

            <div className="flex flex-col gap-4 border-t pt-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                {t.websiteProfile.impactStatsTitle}
              </h3>

              <div className="flex flex-col gap-2">
                <Label htmlFor="foodBaskets">{t.websiteProfile.foodBaskets}</Label>
                <Input
                  id="foodBaskets"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  dir="ltr"
                  value={foodBaskets}
                  onChange={(event) => setFoodBaskets(event.target.value)}
                  placeholder="0"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="totalBeneficiaries">{t.websiteProfile.totalBeneficiaries}</Label>
                <Input
                  id="totalBeneficiaries"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  dir="ltr"
                  value={totalBeneficiaries}
                  onChange={(event) => setTotalBeneficiaries(event.target.value)}
                  placeholder="0"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="yearsOfGiving">{t.websiteProfile.yearsOfGiving}</Label>
                <Input
                  id="yearsOfGiving"
                  type="number"
                  min={0}
                  step={1}
                  inputMode="numeric"
                  dir="ltr"
                  value={yearsOfGiving}
                  onChange={(event) => setYearsOfGiving(event.target.value)}
                  placeholder="0"
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="mt-2 w-full" disabled={loading || saving}>
              {saving ? <Loader2 className="ml-2 size-4 animate-spin" /> : <Save className="ml-2 size-4" />}
              {t.websiteProfile.saveButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
