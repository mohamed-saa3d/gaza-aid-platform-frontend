"use client"

import { Droplets, ShoppingBasket, Users, Utensils, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { donationHistory, type DonationHistoryItem } from "@/lib/mock-data"

const iconMap: Record<DonationHistoryItem["icon"], typeof Droplets> = {
  Droplets,
  Users,
  ShoppingBasket,
  Utensils,
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("ar-EG", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function DonationHistoryList() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg">سجل التبرعات</CardTitle>
          <button className="text-sm font-medium text-primary hover:underline">عرض الكل</button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {donationHistory.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 p-3"
            >
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="size-8 shrink-0 text-muted-foreground" aria-label="تحميل الإيصال">
                  <Download className="size-4" />
                </Button>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="size-3" aria-hidden="true" />
                    {formatDate(item.date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-sm font-bold text-primary">
                  {item.amount.toLocaleString("ar")} ر.س
                </span>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
