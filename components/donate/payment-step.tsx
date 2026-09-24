"use client"

import { useState } from "react"
import { CreditCard, Landmark, Smartphone, ChevronRight, Loader2, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"
import type { DonationState } from "@/components/donate/donation-flow"

const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Landmark,
  Smartphone,
}

interface PaymentStepProps {
  state: DonationState
  onChange: (patch: Partial<DonationState>) => void
  onBack: () => void
  onSubmit: () => void
}

export function PaymentStep({ state, onChange, onBack, onSubmit }: PaymentStepProps) {
  const { locale, t } = useLocale()
  const [submitting, setSubmitting] = useState(false)

  // Static payment-method labels come from the dictionary (the ids are stable keys).
  const paymentMethods = [
    { id: "cards", label: t.donate.methodCards, icon: "CreditCard" },
    { id: "bank", label: t.donate.methodBank, icon: "Landmark" },
    { id: "applepay", label: t.donate.methodApplepay, icon: "Smartphone" },
  ]

  const canSubmit =
    state.donorName.trim().length > 1 &&
    /^\S+@\S+\.\S+$/.test(state.donorEmail) &&
    state.method

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSubmit()
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">{t.donate.donorDetailsTitle}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="donor-name">{t.donate.fullName}</Label>
            <Input
              id="donor-name"
              placeholder={t.donate.fullNamePlaceholder}
              value={state.donorName}
              onChange={(e) => onChange({ donorName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="donor-email">{t.donate.emailLabel}</Label>
            <Input
              id="donor-email"
              type="email"
              placeholder="name@example.com"
              value={state.donorEmail}
              onChange={(e) => onChange({ donorEmail: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">{t.donate.paymentMethodTitle}</h2>
        <RadioGroup
          value={state.method}
          onValueChange={(v) => onChange({ method: v })}
          className="flex flex-col gap-3"
        >
          {paymentMethods.map((pm) => {
            const Icon = iconMap[pm.icon] ?? CreditCard
            const active = state.method === pm.id
            return (
              <Label
                key={pm.id}
                htmlFor={`method-${pm.id}`}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                <span className="flex-1">{pm.label}</span>
                <RadioGroupItem value={pm.id} id={`method-${pm.id}`} />
              </Label>
            )
          })}
        </RadioGroup>
      </section>

      {state.method === "cards" && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="card-number">{t.donate.cardNumber}</Label>
            <Input id="card-number" placeholder="•••• •••• •••• ••••" inputMode="numeric" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-expiry">{t.donate.cardExpiry}</Label>
            <Input id="card-expiry" placeholder="MM/YY" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-cvc">CVC</Label>
            <Input id="card-cvc" placeholder="•••" inputMode="numeric" />
          </div>
        </section>
      )}

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs font-medium text-amber-800 dark:text-amber-300">
        {t.donate.unavailableTitle}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="lg" className="rounded-full" onClick={onBack}>
          <ChevronRight className="size-4 rotate-180 rtl:rotate-0" aria-hidden="true" />
          {t.donate.back}
        </Button>
        <Button
          size="lg"
          className="flex-1 rounded-full"
          disabled
        >
          {t.donate.unavailableTitle}
        </Button>
      </div>
    </div>
  )
}
