"use client"

import { Droplet, UtensilsCrossed, Home, Users, HandCoins, Droplets, type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { donationReasons, quickAmounts } from "@/lib/mock-data"
import type { DonationState } from "@/components/donate/donation-flow"

const iconMap: Record<string, LucideIcon> = {
  Droplet,
  UtensilsCrossed,
  Home,
  Users,
  HandCoins,
  Droplets,
}

interface AmountStepProps {
  state: DonationState
  onChange: (patch: Partial<DonationState>) => void
  onNext: () => void
}

export function AmountStep({ state, onChange, onNext }: AmountStepProps) {
  const isCustom = !(quickAmounts as readonly number[]).includes(state.amount)

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">اختر سبب التبرع</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {donationReasons.map((reason) => {
            const Icon = iconMap[reason.icon] ?? HandCoins
            const active = state.reasonId === reason.id
            return (
              <button
                key={reason.id}
                type="button"
                onClick={() => onChange({ reasonId: reason.id })}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground/80 hover:border-primary/40",
                )}
                aria-pressed={active}
              >
                <Icon className="size-6" aria-hidden="true" />
                {reason.label}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">حدد نوع التبرع</h2>
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
            تبرع لمرة واحدة
            <RadioGroupItem value="once" id="freq-once" />
          </Label>
          <Label
            htmlFor="freq-monthly"
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-xl border p-4 text-sm font-medium",
              state.frequency === "monthly" ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            تبرع شهري متكرر
            <RadioGroupItem value="monthly" id="freq-monthly" />
          </Label>
        </RadioGroup>
      </section>

      <section>
        <h2 className="mb-4 font-heading text-lg font-bold">حدد المبلغ (ر.س)</h2>
        <div className="grid grid-cols-4 gap-3">
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
            placeholder="آخر"
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
        <span className="text-sm font-medium text-muted-foreground">إجمالي التبرع</span>
        <span className="font-heading text-2xl font-bold text-primary">{state.amount || 0} ر.س</span>
      </Card>

      <Button
        size="lg"
        className="w-full rounded-full"
        disabled={!state.amount}
        onClick={onNext}
      >
        استمرار إلى الدفع
      </Button>
    </div>
  )
}
