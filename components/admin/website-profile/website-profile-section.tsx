"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { adminHttp, getErrorMessage } from "@/lib/http"
import { useLocale } from "@/components/locale-provider"
import type { PlatformSettings } from "@/lib/api/public"

/**
 * Website Profile — the public أثر عطائكم في أرقام (impact numbers).
 *
 * The site NAME and the site LOGO are not editable here. Both are fixed
 * frontend branding: the name lives in the dictionary (`t.branding.siteName`)
 * and the logo is a static asset (`/images/logo-mark.png`), so neither can be
 * left blank or drift from what the header, footer and metadata render.
 *
 * The three أثر عطائكم في أرقام (meals distributed / people reached / years of giving)
 * are edited here and rendered by the homepage `StatsBand`, which reads the same
 * public settings endpoint.
 */
export function WebsiteProfileSection() {
  const { t } = useLocale()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)

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
            {t.websiteProfile.impactStatsTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
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
