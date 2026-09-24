"use client"

import Link from "next/link"
import { HeartHandshake } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

export function DonationHistoryList() {
  const { t } = useLocale()
  const donations: never[] = []

  if (donations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">{t.profilePage.historyTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex min-h-[220px] items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-4 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HeartHandshake className="size-7" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-xl font-bold text-foreground">{t.profilePage.historyEmptyTitle}</h3>
              <p className="text-sm text-muted-foreground">{t.profilePage.historyEmptyBody}</p>
            </div>
            <Button asChild className="rounded-full">
              <Link href="/">{t.profilePage.historyBackHome}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
