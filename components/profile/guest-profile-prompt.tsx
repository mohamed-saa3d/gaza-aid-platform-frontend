"use client"

import Link from "next/link"
import { LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLocale } from "@/components/locale-provider"

export function GuestProfilePrompt() {
  const { t } = useLocale()
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center py-20 text-center">
      <Card className="w-full max-w-md bg-card shadow-lg border border-border">
        <CardContent className="flex flex-col items-center p-8 gap-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="size-8" />
          </div>
          <div className="space-y-2 text-center">
            <h2 className="font-heading text-2xl font-bold">{t.profilePage.guestTitle}</h2>
            <p className="text-muted-foreground text-pretty">
              {t.profilePage.guestBody}
            </p>
          </div>
          <div className="flex flex-col w-full gap-3 mt-2">
            <Button asChild size="lg" className="w-full rounded-full">
              <Link href="/register">
                {t.profilePage.guestRegister}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full rounded-full group">
              <Link href="/login">
                {t.profilePage.guestLogin}
                <LogIn className="size-4 ms-2 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
