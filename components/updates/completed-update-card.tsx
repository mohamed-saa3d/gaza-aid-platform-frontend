import Image from "next/image"
import { CheckCircle2, MapPin, CalendarDays, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CompletedUpdate } from "@/lib/mock-data"

export function CompletedUpdateCard({ update }: { update: CompletedUpdate }) {
  return (
    <Card className="overflow-hidden border-border/60 p-0">
      <div className="relative aspect-video w-full">
        <Image
          src={update.image || "/placeholder.svg"}
          alt={update.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <Badge className="absolute right-4 top-4 gap-1 rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          100% مكتمل
        </Badge>
        <div className="absolute bottom-4 right-4 max-w-[80%]">
          <p className="text-xs font-medium text-primary-foreground/80">{update.subtitle}</p>
          <h3 className="font-heading text-lg font-bold text-primary-foreground text-pretty">
            {update.title}
          </h3>
        </div>
      </div>
      <CardContent className="flex flex-col gap-4 p-5 pt-0">
        <p className="text-sm leading-relaxed text-muted-foreground">{update.description}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {update.location}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {update.date}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden="true" />
            {update.beneficiaries}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
