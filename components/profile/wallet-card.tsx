"use client"

import { CreditCard, Link2Off, Plus, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function WalletCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wallet className="size-4" />
            </div>
            <CardTitle className="font-heading text-lg">المحفظة الإلكترونية</CardTitle>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            محفظة مرتبطة
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-card">
              <CreditCard className="size-5 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-sm font-semibold tracking-wide">•••• •••• •••• 4242</span>
              <span className="text-xs text-muted-foreground">Apple Pay مرتبطة منذ 12 2024</span>
              <button className="flex items-center gap-1 text-xs text-destructive">
                <Link2Off className="size-3" />
                إلغاء الربط
              </button>
            </div>
          </div>
          <Button size="sm" className="shrink-0">
            Pay
          </Button>
        </div>

        <button className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center transition-colors hover:bg-primary/10">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="size-5" />
          </span>
          <span className="text-sm font-semibold text-foreground">إضافة محفظة جديدة</span>
          <span className="text-xs text-muted-foreground">يمكنك ربط محفظة أخرى للتبرع بسهولة وأمان</span>
        </button>
      </CardContent>
    </Card>
  )
}
