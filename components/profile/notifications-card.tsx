"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useLocale } from "@/components/locale-provider"

export function NotificationsCard() {
  const { t } = useLocale()

  const notifications = [
    {
      id: "n1",
      time: t.profilePage.notifNow,
      highlighted: true,
      title: t.profilePage.notif1Title,
      text: t.profilePage.notif1Text,
      extra: t.profilePage.notif1Extra,
    },
    {
      id: "n2",
      time: t.profilePage.notifYesterday,
      highlighted: false,
      text: t.profilePage.notif2Text,
    },
    {
      id: "n3",
      time: t.profilePage.notif3Days,
      highlighted: false,
      text: t.profilePage.notif3Text,
    },
    {
      id: "n4",
      time: t.profilePage.notif7Days,
      highlighted: false,
      text: t.profilePage.notif4Text,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bell className="size-4" />
          </div>
          <CardTitle className="font-heading text-lg">{t.profilePage.notificationsTitle}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {notifications.map((n, i) => (
          <div key={n.id}>
            <div
              className={
                n.highlighted
                  ? "flex flex-col gap-1 rounded-lg bg-primary/10 p-3"
                  : "flex flex-col gap-1"
              }
            >
              <p className="text-sm leading-relaxed text-foreground">
                {n.title ? <span className="font-semibold">{n.title} </span> : null}
                {n.text}
              </p>
              {n.extra ? <p className="text-xs text-muted-foreground">{n.extra}</p> : null}
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </div>
            {i < notifications.length - 1 ? <Separator className="mt-4" /> : null}
          </div>
        ))}
        <button className="self-center text-sm font-medium text-primary hover:underline">
          {t.profilePage.notificationsViewAll}
        </button>
      </CardContent>
    </Card>
  )
}
