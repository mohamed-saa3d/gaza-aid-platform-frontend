import Image from "next/image"
import Link from "next/link"
import { CreditCard, Landmark, Smartphone, type LucideIcon } from "lucide-react"
import { paymentMethodIcons, projects } from "@/lib/mock-data"

const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  Landmark,
  Smartphone,
}

export function DonationWaysCard() {
  const myProjects = projects.slice(0, 3)

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-heading text-base font-bold text-foreground">طرق تبرع آمنة ومتنوعة</h3>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {paymentMethodIcons.map((method) => {
            const Icon = iconMap[method.icon]
            return (
              <div
                key={method.id}
                className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center"
              >
                <Icon className="size-5 text-primary" />
                <span className="text-[11px] font-medium text-muted-foreground">{method.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h3 className="font-heading text-base font-bold text-foreground">مشاريعي</h3>
        <ul className="mt-4 flex flex-col gap-4">
          {myProjects.map((project) => (
            <li key={project.id}>
              <Link href={`/donate?project=${project.slug}`} className="flex items-center gap-3 group">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-primary">{project.title}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
