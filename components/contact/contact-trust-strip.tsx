import { Clock, HeartHandshake, ShieldCheck, Users2 } from "lucide-react"

const trustPoints = [
  { icon: Clock, title: "نستجيب بسرعة", description: "نرد على استفساراتك في أسرع وقت" },
  { icon: Users2, title: "فريق متخصص", description: "فريقنا جاهز للإجابة" },
  { icon: ShieldCheck, title: "ثقة وشفافية", description: "نلتزم بالشفافية والمصداقية" },
  { icon: HeartHandshake, title: "خدمة إنسانية", description: "نعمل من أجل الإنسان أينما كان" },
]

export function ContactTrustStrip() {
  return (
    <div className="grid grid-cols-2 gap-6 border-t border-border/60 pt-8 sm:grid-cols-4">
      {trustPoints.map((item) => (
        <div key={item.title} className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <item.icon className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="font-heading text-sm font-bold">{item.title}</span>
            <span className="text-xs text-muted-foreground">{item.description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
