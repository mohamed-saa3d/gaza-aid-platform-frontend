"use client"

import { useState } from "react"
import {
  Droplet,
  Droplets,
  HandCoins,
  Home,
  Lock,
  UtensilsCrossed,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { donationReasons, quickAmounts } from "@/lib/mock-data"

const iconMap: Record<string, LucideIcon> = {
  Droplet,
  UtensilsCrossed,
  Home,
  Users,
  HandCoins,
  Droplets,
}

export function QuickDonateWidget() {
  const [reason, setReason] = useState(donationReasons[0].id)
  const [amount, setAmount] = useState<number | null>(quickAmounts[2])
  const [customAmount, setCustomAmount] = useState("")

  return (
    <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-xl">
      <h3 className="text-center font-heading text-lg font-bold text-foreground">تبرع بسهولة وأمان</h3>
      <p className="mt-1 text-center text-xs text-muted-foreground">اختر سبب تبرعك</p>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {donationReasons.map((item) => {
          const Icon = iconMap[item.icon]
          const active = reason === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setReason(item.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-secondary",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          )
        })}
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
            {value} ر.س
          </button>
        ))}
      </div>

      <div className="mt-3">
        <Input
          type="number"
          inputMode="numeric"
          placeholder="اضف مبلغ للتبرع"
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value)
            setAmount(null)
          }}
          className="h-11 rounded-xl text-center"
        />
      </div>

      <Button className="mt-4 h-12 w-full rounded-xl text-base">
        <Lock className="size-4" data-icon="inline-start" />
        تبرع الآن
      </Button>

      <p className="mt-3 text-center text-[11px] text-muted-foreground">تجربة دفع آمنة 100%</p>
    </div>
  )
}
