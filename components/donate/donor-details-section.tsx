"use client"

import { Info, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StepHeading } from "@/components/donate/step-heading"
import type { QuickDonationState } from "@/components/donate/donation-flow"

interface DonorDetailsSectionProps {
  state: QuickDonationState
  onChange: (patch: Partial<QuickDonationState>) => void
}

export function DonorDetailsSection({ state, onChange }: DonorDetailsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <StepHeading step={1} icon={User} title="بيانات المتبرع (اختياري)" />

      <div className="flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <span>يمكنك التبرع فوراً كزائر دون الحاجة لإنشاء حساب</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:order-2">
          <Label htmlFor="qd-name">الاسم بالكامل</Label>
          <Input
            id="qd-name"
            placeholder="أدخل اسمك الكامل"
            value={state.donorName}
            onChange={(e) => onChange({ donorName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2 sm:order-1">
          <Label htmlFor="qd-email">البريد الإلكتروني</Label>
          <Input
            id="qd-email"
            type="email"
            placeholder="example@email.com"
            value={state.donorEmail}
            onChange={(e) => onChange({ donorEmail: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2 sm:order-3 sm:col-span-2">
          <Label htmlFor="qd-phone">رقم الجوال</Label>
          <div className="relative">
            <span className="absolute inset-y-0 end-3 my-auto text-sm text-muted-foreground">+966</span>
            <Input
              id="qd-phone"
              type="tel"
              placeholder="5XXXXXXXX"
              value={state.donorPhone}
              onChange={(e) => onChange({ donorPhone: e.target.value })}
              className="pe-14"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
