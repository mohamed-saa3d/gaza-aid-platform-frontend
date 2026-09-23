"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { PartyPopper, Download, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"
import { formatCurrency } from "@/lib/currency"
import type { DonationState } from "@/components/donate/donation-flow"
export function ConfirmationStep({ state }: { state: DonationState }) {
  const { locale } = useLocale()
  const [reference, setReference] = useState("QR-000000")

  useEffect(() => {
    setReference(`QR-${Math.floor(100000 + Math.random() * 900000)}`)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <PartyPopper className="size-10 text-primary" aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-heading text-2xl font-bold text-balance">جزاك الله خيراً على تبرعك</h2>
        <p className="mt-2 max-w-md text-pretty text-muted-foreground">
          تم استلام تبرعك بنجاح، وسيصلك إيصال مفصل على بريدك الإلكتروني. أثرك سيصل لمن يحتاجه فعلاً.
        </p>
      </div>

      <Card className="w-full max-w-sm border-border/60">
        <CardContent className="flex flex-col gap-3 p-5 text-start">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">رقم المرجع</span>
            <span className="font-medium">{reference}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">المبلغ</span>
            <span className="font-heading font-bold text-primary">{formatCurrency(state.amount, locale)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">نوع التبرع</span>
            <span className="font-medium">{state.frequency === "monthly" ? "شهري متكرر" : "لمرة واحدة"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">المتبرع</span>
            <span className="font-medium">{state.donorName || "—"}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <Button variant="outline" className="flex-1 gap-2 rounded-full">
          <Download className="size-4" aria-hidden="true" />
          تحميل الإيصال
        </Button>
        <Button asChild className="flex-1 gap-2 rounded-full">
          <Link href="/">
            <Home className="size-4" aria-hidden="true" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  )
}
