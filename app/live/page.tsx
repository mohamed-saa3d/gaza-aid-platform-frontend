import type { Metadata } from "next"
import { LiveStreamClient } from "@/components/live/live-stream-client"

export const metadata: Metadata = {
  title: "بث مباشر | مؤسسة قدس للإغاثة",
  description: "تابع البث المباشر لفعاليات وتحديثات مشاريع مؤسسة قدس للإغاثة.",
}

export default function LivePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <LiveStreamClient />
    </main>
  )
}
