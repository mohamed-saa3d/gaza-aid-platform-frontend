"use client"

import { useState } from "react"
import { CreditCard, HandCoins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { liveQuickAmounts, liveStreamData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"

export function LiveDonationCard() {
  const { locale } = useLocale()
  const [amount, setAmount] = useState<number>(liveQuickAmounts[1])
  const isCustom = !(liveQuickAmounts as readonly number[]).includes(amount)

  return (
    <Card className="border-border/60 lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <HandCoins className="size-4 text-primary" aria-hidden="true" />
          ساهم في الحملة الآن
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">هدف الحملة: {formatCurrency(liveStreamData.goal, locale)}</span>
            <span className="font-heading font-bold text-primary">{liveStreamData.progress}%</span>
          </div>
          <Progress value={liveStreamData.progress} className="h-2" />
          <span className="text-xs text-muted-foreground">
            تم جمعه{" "}
            <span className="font-semibold text-foreground">{formatCurrency(liveStreamData.funded, locale)}</span> من{" "}
            {formatCurrency(liveStreamData.goal, locale)}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">اختر مبلغ التبرع</span>
          <div className="grid grid-cols-3 gap-2">
            {liveQuickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(val)}
                className={cn(
                  "rounded-xl border py-2.5 text-center font-heading text-sm font-bold transition-colors",
                  !isCustom && amount === val
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground/80 hover:border-primary/40",
                )}
                aria-pressed={!isCustom && amount === val}
              >
                {formatCurrency(val, locale)}
              </button>
            ))}
          </div>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            placeholder="مبلغ آخر"
            value={isCustom ? amount || "" : ""}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            className="text-center"
          />
        </div>

        <Button size="lg" className="w-full gap-2 rounded-full">
          <CreditCard className="size-4" data-icon="inline-start" aria-hidden="true" />
          تبرع فوراً
        </Button>
        <p className="text-center text-xs text-muted-foreground">تبرعك آمن ومضمون 100%</p>
      </CardContent>
    </Card>
  )
}
