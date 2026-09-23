"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DonationStepper } from "@/components/donate/donation-stepper"
import { AmountStep } from "@/components/donate/amount-step"
import { PaymentStep } from "@/components/donate/payment-step"
import { ConfirmationStep } from "@/components/donate/confirmation-step"
import { DonationSummaryCard } from "@/components/donate/donation-summary-card"
import { quickAmounts } from "@/lib/mock-data"

export interface DonationState {
  reasonId: string
  frequency: "once" | "monthly"
  amount: number
  donorName: string
  donorEmail: string
  donorPhone: string
  method: string
}

export type QuickDonationState = DonationState

export function DonationFlow() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<DonationState>({
    // Empty until the real categories load; `AmountStep` fills it with the first
    // category id so a donation is never tied to a hardcoded mock reason id.
    reasonId: "",
    frequency: "once",
    amount: quickAmounts[1],
    donorName: "",
    donorEmail: "",
    donorPhone: "",
    method: "cards",
  })

  const updateState = (patch: Partial<DonationState>) => setState((prev) => ({ ...prev, ...patch }))

  return (
    <div className="flex flex-col gap-8">
      {step < 3 && <DonationStepper current={step} />}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <Card className="border-border/60">
          <CardContent className="p-6 sm:p-8">
            {step === 1 && (
              <AmountStep state={state} onChange={updateState} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <PaymentStep
                state={state}
                onChange={updateState}
                onBack={() => setStep(1)}
                onSubmit={() => setStep(3)}
              />
            )}
            {step === 3 && <ConfirmationStep state={state} />}
          </CardContent>
        </Card>

        {step < 3 && (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <DonationSummaryCard state={state} />
          </div>
        )}
      </div>
    </div>
  )
}
