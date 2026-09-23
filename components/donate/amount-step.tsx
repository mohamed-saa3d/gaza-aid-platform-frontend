"use client"

import { useEffect, useState } from "react"
import { HandCoins, LayoutGrid, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { quickAmounts } from "@/lib/mock-data"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"
import { getPublicCategories } from "@/lib/api/public"
import { resolveCategoryIcon } from "@/lib/category-icons"
import type { Category } from "@/components/admin/categories/types"
import type { DonationState } from "@/components/donate/donation-flow"

interface AmountStepProps {
  state: DonationState
  onChange: (patch: Partial<DonationState>) => void
  onNext: () => void
}

export function AmountStep({ state, onChange, onNext }: AmountStepProps) {
  const { locale, t } = useLocale()
  const isCustom = !(quickAmounts as readonly number[]).includes(state.amount)

  // The donation causes are the same real categories the Home strip and Quick
  // Donate use — not a third hardcoded array.
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoadingCategories(true)
    getPublicCategories({ limit: 6 })
      .then((res) => {
        if (cancelled) return
        const list = Array.isArray(res?.data) ? res.data : []
        setCategories(list)
        // Adopt the first real category as the default cause when the flow has no
        // valid reason selected yet, so a donation is never tied to a mock id.
        if (list.length > 0 && !list.some((c) => c.id === state.reasonId)) {
          onChange({ reasonId: list[0].id })
        }
      })
      .catch((error) => console.error("Failed to load donation categories", error))
      .finally(() => {
        if (!cancelled) setLoadingCategories(false)
      })
    return () => {
      cancelled = true
    }
    // Intentionally keyed on `locale` only: re-running on every state change would
    // re-adopt the default category and fight the visitor's own selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">{t.donate.chooseReason}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {loadingCategories ? (
            <div className="col-span-full flex items-center justify-center py-6">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
              <LayoutGrid className="size-5" />
              {t.common.noResults}
            </div>
          ) : (
            categories.map((category) => {
              const Icon = resolveCategoryIcon(category.icon) ?? HandCoins
              const active = state.reasonId === category.id
              const label = category.name || category.nameAr || category.nameEn
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onChange({ reasonId: category.id })}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-foreground/80 hover:border-primary/40",
                  )}
                  aria-pressed={active}
                >
                  <Icon className="size-6" aria-hidden="true" />
                  {label}
                </button>
              )
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">{t.donate.chooseFrequency}</h2>
        <RadioGroup
          value={state.frequency}
          onValueChange={(v) => onChange({ frequency: v as DonationState["frequency"] })}
          className="grid grid-cols-2 gap-3"
        >
          <Label
            htmlFor="freq-once"
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-xl border p-4 text-sm font-medium",
              state.frequency === "once" ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            {t.donate.oneTime}
            <RadioGroupItem value="once" id="freq-once" />
          </Label>
          <Label
            htmlFor="freq-monthly"
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-xl border p-4 text-sm font-medium",
              state.frequency === "monthly" ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            {t.donate.monthly}
            <RadioGroupItem value="monthly" id="freq-monthly" />
          </Label>
        </RadioGroup>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">{t.donate.chooseAmount}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => onChange({ amount })}
              className={cn(
                "rounded-xl border py-3 text-center font-heading text-lg font-bold transition-colors",
                !isCustom && state.amount === amount
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/80 hover:border-primary/40",
              )}
              aria-pressed={!isCustom && state.amount === amount}
            >
              {amount}
            </button>
          ))}
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder={t.donate.customAmount}
            value={isCustom ? state.amount || "" : ""}
            onChange={(e) => onChange({ amount: Number(e.target.value) || 0 })}
            className={cn(
              "h-auto rounded-xl border py-3 text-center font-heading text-lg font-bold",
              isCustom && state.amount > 0 && "border-primary text-primary",
            )}
          />
        </div>
      </section>

      <Card className="flex items-center justify-between border-border/60 bg-secondary/40 p-4">
        <span className="text-sm font-medium text-muted-foreground">{t.donate.totalLabel}</span>
        <span className="font-heading text-2xl font-bold text-primary">
          {formatCurrency(state.amount || 0, locale)}
        </span>
      </Card>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!state.amount}
        onClick={onNext}
      >
        {t.donate.continueToPayment}
      </Button>
    </div>
  )
}
