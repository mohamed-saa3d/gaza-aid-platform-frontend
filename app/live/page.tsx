import type { Metadata } from "next"
import { CalendarDays, MapPin, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LiveVideoPlayer } from "@/components/live/live-video-player"
import { LiveDonationCard } from "@/components/live/live-donation-card"
import { liveStreamData } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "بث مباشر | مؤسسة قدس للإغاثة",
  description: liveStreamData.description,
}

export default function LivePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <LiveVideoPlayer />

          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-2xl font-bold text-balance sm:text-3xl">{liveStreamData.title}</h1>
            <p className="text-pretty leading-relaxed text-muted-foreground">{liveStreamData.description}</p>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {liveStreamData.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  {liveStreamData.date}
                </span>
              </div>
              <Button variant="outline" className="gap-2 rounded-full">
                <Share2 className="size-4" data-icon="inline-start" aria-hidden="true" />
                مشاركة
              </Button>
            </div>
          </div>
        </div>

        <LiveDonationCard />
      </div>
    </main>
  )
}
