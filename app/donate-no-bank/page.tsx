"use client"

import { Leaf, ShieldCheck, Zap } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { useLocale } from "@/components/locale-provider"
import { TransferMethodCard } from "@/components/donate-no-bank/transfer-method-card"

export default function DonateNoBankPage() {
  const { t } = useLocale()

  const trustPoints = [
    { icon: ShieldCheck, label: t.donateNoBank.trustSecure, description: t.donateNoBank.trustSecureDesc },
    { icon: Zap, label: t.donateNoBank.trustNoFees, description: t.donateNoBank.trustNoFeesDesc },
    { icon: Leaf, label: t.donateNoBank.trustInstant, description: t.donateNoBank.trustInstantDesc },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb label="donateNoBank" />

      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
          <Leaf className="size-7 text-primary" aria-hidden="true" />
          {t.donateNoBank.title}
          <Leaf className="size-7 rotate-180 text-primary" aria-hidden="true" />
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          {t.donateNoBank.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <TransferMethodCard
          order="01"
          image="/images/instapay-transfer.png"
          imageAlt={t.donateNoBank.instapayAlt}
          secondaryLabel={t.donateNoBank.accountNameLabel}
          secondaryIcon="user"
          secondaryValue={t.donateNoBank.accountNameValue}
          fieldLabel={t.donateNoBank.ipaLabel}
          fieldIcon="link"
          fieldValue="quds@instapay"
        />
        <TransferMethodCard
          order="02"
          image="/images/mobile-wallet-transfer.png"
          imageAlt={t.donateNoBank.walletAlt}
          fieldLabel={t.donateNoBank.phoneLabel}
          fieldIcon="phone"
          fieldValue="01080874523 "
        />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-8 border-t border-border/60 pt-8 sm:flex-row sm:gap-16">
        {trustPoints.map(({ icon: Icon, label, description }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-sm font-bold text-foreground">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
