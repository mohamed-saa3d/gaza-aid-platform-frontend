import { Mail, MapPin, Phone } from "lucide-react"
import { Card } from "@/components/ui/card"

const infoItems = [
  {
    icon: MapPin,
    title: "المقر الرئيسي",
    lines: ["المملكة العربية السعودية"],
  },
  {
    icon: Phone,
    title: "خدمة العملاء",
    lines: ["+966 50 123 4567", "متاح من 9 صباحاً حتى 5 مساءً"],
  },
  {
    icon: Mail,
    title: "البريد الإلكتروني",
    lines: ["info@qudsrelief.org"],
  },
]

export function ContactInfoCards() {
  return (
    <div className="flex flex-col gap-4">
      {infoItems.map((item) => (
        <Card key={item.title} className="flex-row items-center justify-between gap-4 border-border/60 p-5">
          <div className="flex flex-col gap-1 text-end">
            <span className="font-heading text-sm font-bold">{item.title}</span>
            {item.lines.map((line) => (
              <span key={line} className="text-sm text-muted-foreground">
                {line}
              </span>
            ))}
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon className="size-5" aria-hidden="true" />
          </span>
        </Card>
      ))}
    </div>
  )
}
