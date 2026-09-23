"use client"

import { ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"
import type { DonationState } from "@/components/donate/donation-flow"

/**
 * Live donation summary.
 *
 * Shows only real, visitor-driven values (amount, frequency). The previous version
 * rendered a hardcoded `featuredDonationProject` (a fabricated project image,
 * title and description) as if it were the donation target — i.e. mock domain
 * data presented as real. The selected cause now comes from the real categories
 * chosen in the amount step.
 */
export function DonationSummaryCard({ state }: { state: DonationState }) {
  const { locale, t } = useLocale()

  return (
    <Card className="overflow-hidden border-border/60 p-0">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
          <span className="text-sm text-muted-foreground">{t.donate.yourAmount}</span>
          <span className="font-heading text-xl font-bold text-primary">
            {formatCurrency(state.amount || 0, locale)}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
          <span className="text-sm text-muted-foreground">{t.donate.donationType}</span>
          <span className="text-sm font-medium">
            {state.frequency === "monthly" ? t.donate.monthlyRecurring : t.donate.oneTimeLabel}
          </span>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>{t.donate.secureNote}</span>
        </div>
      </CardContent>
    </Card>
  )
}
