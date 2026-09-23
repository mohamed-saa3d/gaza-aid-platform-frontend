"use client"

import { CreditCard, Landmark, Smartphone, type LucideIcon } from "lucide-react"
import { useLocale } from "@/components/locale-provider"
import { TrackDonationWidget } from "@/components/home/track-donation-widget"

const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Landmark,
  Smartphone,
}

export function DonationWaysCard() {
  const { t } = useLocale()

  const paymentMethods = [
    { id: "cards", label: t.donate.methodCards, icon: "CreditCard" },
    { id: "bank", label: t.donate.methodBank, icon: "Landmark" },
    { id: "applepay", label: t.donate.methodApplepay, icon: "Smartphone" },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-heading text-base font-bold text-foreground">{t.home.donationWaysTitle}</h3>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {paymentMethods.map((method) => {
            const Icon = iconMap[method.icon]
            return (
              <div
                key={method.id}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center"
              >
                <Icon className="size-5 text-primary" />
                <span className="text-[11px] font-medium text-muted-foreground">{method.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <TrackDonationWidget />
    </div>
  )
}

