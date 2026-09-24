"use client"

import { useState } from "react"
import { CalendarClock, Minus, Pencil, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { monthlyDonationSettings } from "@/lib/mock-data"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"

export function MonthlyDonationCard() {
  const { locale, t } = useLocale()
  const [active, setActive] = useState(monthlyDonationSettings.isActive)
  const [amount, setAmount] = useState(monthlyDonationSettings.amount)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarClock className="size-4" />
          </div>
          <CardTitle className="font-heading text-lg">{t.profilePage.monthlyTitle}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">{t.profilePage.monthlyActive}</span>
            <span className="text-xs text-muted-foreground">{t.profilePage.monthlyActiveBody}</span>
          </div>
          <Switch checked={active} onCheckedChange={setActive} aria-label={t.profilePage.monthlyToggleAria} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">{t.profilePage.monthlyAmount}</span>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 p-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={t.profilePage.monthlyEditAria}
            >
              <Pencil className="size-3.5 text-muted-foreground" />
            </Button>
            <div className="flex flex-1 items-center justify-center gap-1">
              <span className="font-heading text-lg font-bold text-foreground">
                {formatCurrency(amount, locale)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-7 rounded-full"
                aria-label={t.profilePage.monthlyIncreaseAria}
                onClick={() => setAmount((v) => v + 50)}
              >
                <Plus className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7 rounded-full"
                aria-label={t.profilePage.monthlyDecreaseAria}
                onClick={() => setAmount((v) => Math.max(50, v - 50))}
              >
                <Minus className="size-3.5" />
              </Button>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{t.profilePage.monthlyAmountBody}</span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-3">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarClock className="size-4" aria-hidden="true" />
            {t.profilePage.monthlyNextCharge}
          </span>
          <span className="text-sm font-semibold text-foreground">{t.profilePage.monthlyNextChargeDate}</span>
        </div>
      </CardContent>
    </Card>
  )
}
