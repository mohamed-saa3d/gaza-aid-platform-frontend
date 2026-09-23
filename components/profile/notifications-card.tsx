"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const notifications = [
  {
    id: "n1",
    time: "الآن",
    highlighted: true,
    title: "تذكير:",
    text: "غداً، شكراً لعطائك المستمر.",
    extra: "سيتم تجديد تبرعك الشهري بقيمة 200 دولار",
  },
  {
    id: "n2",
    time: "يوم أمس",
    highlighted: false,
    text: "تم بنجاح التبرع الشهري بقيمة 200 دولار لمشروع سقيا الماء.",
  },
  {
    id: "n3",
    time: "منذ 3 أيام",
    highlighted: false,
    text: "شكراً لك! لقد ساهم تبرعك في إحداث فرق في حياة مستفيد.",
  },
  {
    id: "n4",
    time: "منذ 7 أيام",
    highlighted: false,
    text: "تم تحديث مشروع بناء المساجد. اضغط لمشاهدة التفاصيل.",
  },
]

export function NotificationsCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Bell className="size-4" />
          </div>
          <CardTitle className="font-heading text-lg">أحدث الإشعارات</CardTitle>
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
          عرض كل الإشعارات
        </button>
      </CardContent>
    </Card>
  )
}
