"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, Loader2, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { quickAmounts } from "@/lib/mock-data"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"
import { getPublicCategories } from "@/lib/api/public"
import { resolveCategoryIcon } from "@/lib/category-icons"
import type { Category } from "@/components/admin/categories/types"

/**
 * Quick Donate cause picker.
 *
 * The causes are the SAME six categories the Home Category Strip shows — both
 * read the real Categories API and take the first `PRIMARY_CATEGORY_COUNT`
 * entries, which the backend already orders defaults-first. There is deliberately
 * NO second hardcoded list here.
 */
const PRIMARY_CATEGORY_COUNT = 6

export function QuickDonateWidget() {
  const { locale, t } = useLocale()
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(quickAmounts[2])
  const [customAmount, setCustomAmount] = useState<number | "">("")

  useEffect(() => {
    let cancelled = false
    setLoadingCategories(true)

    getPublicCategories({ limit: 100 })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res?.data) ? res.data : []
        const primary = list.slice(0, PRIMARY_CATEGORY_COUNT)
        setCategories(primary)
        setSelectedId((prev) => prev ?? primary[0]?.id ?? null)
      })
      .catch((error) => {
        console.error("Failed to load quick-donate categories", error)
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false)
      })

    return () => {
      cancelled = true
    }
  }, [locale])

  const selectedAmount = amount ?? (customAmount === "" ? 0 : Number(customAmount))
  const isDonateDisabled = !(selectedAmount > 0)

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value

    if (nextValue === "") {
      setCustomAmount("")
      setAmount(null)
      return
    }

    if (nextValue.startsWith("0") || /[eE\-+]/.test(nextValue) || !/^\d+$/.test(nextValue)) {
      return
    }

    const numericValue = Number(nextValue)

    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      setCustomAmount("")
      setAmount(null)
      return
    }

    setCustomAmount(numericValue)
    setAmount(null)
  }

  const handleDonate = () => {
    if (selectedAmount <= 0) {
      return
    }
  }

  return (
    <div className="w-full max-w-xs sm:max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl">
      <h3 className="text-center font-heading text-lg font-bold text-foreground">{t.quickDonate.heading}</h3>
      <p className="mt-1 text-center text-xs text-muted-foreground">{t.quickDonate.chooseReason}</p>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {loadingCategories ? (
          <div className="col-span-3 flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-3 flex flex-col items-center gap-1.5 py-6 text-center text-xs text-muted-foreground">
            <LayoutGrid className="size-5" />
            {t.common.noResults}
          </div>
        ) : (
          categories.map((category) => {
            const Icon = resolveCategoryIcon(category.icon)
            const active = selectedId === category.id
            const label = category.name || category.nameAr || category.nameEn
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedId(category.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-secondary",
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            )
          })
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {quickAmounts.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setAmount(value)
              setCustomAmount("")
            }}
            className={cn(
              "rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
              amount === value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-foreground hover:border-primary/40",
            )}
          >
            {formatCurrency(value, locale)}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <Input
          type="number"
          inputMode="numeric"
          placeholder={t.quickDonate.customAmountPlaceholder}
          value={customAmount}
          onChange={handleCustomAmountChange}
          className="h-11 rounded-xl text-center"
        />
      </div>

      <Button
        className="mt-4 h-12 w-full rounded-xl text-base"
        disabled={isDonateDisabled}
        onClick={handleDonate}
      >
        <Lock className="size-4" data-icon="inline-start" />
        {t.quickDonate.donateNow}
      </Button>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">{t.quickDonate.secureNote}</p>
    </div>
  )
}
