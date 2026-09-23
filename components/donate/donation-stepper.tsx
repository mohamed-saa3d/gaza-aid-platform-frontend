"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLocale } from "@/components/locale-provider"

export function DonationStepper({ current }: { current: number }) {
  const { t } = useLocale()

  const steps = [
    { id: 1, label: t.donate.stepAmount },
    { id: 2, label: t.donate.stepPayment },
    { id: 3, label: t.donate.stepConfirm },
  ] as const

  return (
    <ol className="mx-auto flex max-w-md items-center justify-between" aria-label={t.donate.stepsAria}>
      {steps.map((step, i) => {
        const done = current > step.id
        const active = current === step.id
        return (
          <li key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && !done && "border-primary text-primary",
                  !active && !done && "border-border text-muted-foreground",
                )}
                aria-current={active ? "step" : undefined}
              >
                {done ? <Check className="size-4" aria-hidden="true" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  (active || done) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {step.id !== steps.length && (
              <div className={cn("mx-2 h-0.5 flex-1 rounded-full", done ? "bg-primary" : "bg-border")} />
            )}
          </li>
        )
      })}
    </ol>
  )
}
