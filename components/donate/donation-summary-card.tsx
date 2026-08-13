import Image from "next/image"
import { ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { featuredDonationProject } from "@/lib/mock-data"
import type { DonationState } from "@/components/donate/donation-flow"

export function DonationSummaryCard({ state }: { state: DonationState }) {
  return (
    <Card className="overflow-hidden border-border/60 p-0">
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={featuredDonationProject.image || "/placeholder.svg"}
          alt={featuredDonationProject.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex flex-col gap-4 p-5">
        <div>
          <h3 className="font-heading text-lg font-bold">{featuredDonationProject.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {featuredDonationProject.description}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/40 p-3">
          <span className="text-sm text-muted-foreground">مبلغ تبرعك</span>
          <span className="font-heading text-xl font-bold text-primary">{state.amount || 0} ر.س</span>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span>معاملة مشفرة وآمنة بالكامل، تبرعك يصل مباشرة للمستفيدين دون أي رسوم إضافية.</span>
        </div>
      </CardContent>
    </Card>
  )
}
