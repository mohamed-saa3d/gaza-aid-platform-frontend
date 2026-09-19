"use client"

import Link from "next/link"
import { HeartHandshake } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function DonationHistoryList() {
  const donations: never[] = []

  if (donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">سجل التبرعات</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[220px] items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HeartHandshake className="size-7" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-foreground">لم تقم بأي تبرعات حتى الآن</h3>
              <p className="text-sm text-muted-foreground">ابدأ اليوم في دعم مشاريعنا وكن جزءاً من أثر إيجابي مستمر.</p>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/">العودة إلى الرئيسية</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
