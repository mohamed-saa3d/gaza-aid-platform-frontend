"use client"

import { useState } from "react"
import { CreditCard, Landmark, Smartphone, ChevronRight, Loader2, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { paymentMethodIcons } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
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
  const [submitting, setSubmitting] = useState(false)

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
        <h2 className="mb-4 font-heading text-lg font-bold">بيانات المتبرع</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="donor-name">الاسم الكامل</Label>
            <Input
              id="donor-name"
              placeholder="محمد سعد"
              value={state.donorName}
              onChange={(e) => onChange({ donorName: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="donor-email">البريد الإلكتروني</Label>
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
        <h2 className="mb-4 font-heading text-lg font-bold">طريقة الدفع</h2>
        <RadioGroup
          value={state.method}
          onValueChange={(v) => onChange({ method: v })}
          className="flex flex-col gap-3"
        >
          {paymentMethodIcons.map((pm) => {
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
            <Label htmlFor="card-number">رقم البطاقة</Label>
            <Input id="card-number" placeholder="•••• •••• •••• ••••" inputMode="numeric" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-expiry">تاريخ الانتهاء</Label>
            <Input id="card-expiry" placeholder="MM/YY" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="card-cvc">CVC</Label>
            <Input id="card-cvc" placeholder="•••" inputMode="numeric" />
          </div>
        </section>
      )}

      <div className="flex items-center gap-3">
        <Button variant="outline" size="lg" className="rounded-full" onClick={onBack}>
          <ChevronRight className="size-4 rotate-180 rtl:rotate-0" aria-hidden="true" />
          رجوع
        </Button>
        <Button
          size="lg"
          className="flex-1 rounded-full"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              جارٍ إتمام التبرع...
            </>
          ) : (
            `تأكيد التبرع بمبلغ ${state.amount} ر.س`
          )}
        </Button>
      </div>
    </div>
  )
}
