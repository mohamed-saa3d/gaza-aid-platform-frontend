import { BarChart3, HeartHandshake, ShieldCheck, Users2, type LucideIcon } from "lucide-react"
import { whyChooseUs } from "@/lib/mock-data"

const iconMap: Record<string, LucideIcon> = {
  HeartHandshake,
  BarChart3,
  Users2,
  ShieldCheck,
}

export function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
      <h2 className="text-center font-heading text-2xl font-bold text-foreground md:text-3xl">
        لماذا تختار مؤسسة قدس للإغاثة؟
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {whyChooseUs.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="size-6" />
              </span>
              <h3 className="font-heading text-base font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
