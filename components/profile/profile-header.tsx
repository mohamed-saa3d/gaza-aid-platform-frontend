import Image from "next/image"
import { Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { currentUser, platformRating } from "@/lib/mock-data"

export function ProfileHeader() {
  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative size-20 overflow-hidden rounded-full border-4 border-secondary">
          <Image src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">{currentUser.name}</h1>
          <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
            <Badge variant="secondary" className="rounded-full">
              {currentUser.status}
            </Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
              {platformRating.score} ({platformRating.count.toLocaleString("ar")})
            </span>
          </div>
        </div>
      </div>

      <Button variant="outline" className="gap-2 rounded-full">
        <Settings className="size-4" aria-hidden="true" />
        إعدادات الحساب
      </Button>
    </div>
  )
}
