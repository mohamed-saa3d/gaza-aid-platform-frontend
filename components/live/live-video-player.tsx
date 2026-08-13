"use client"

import Image from "next/image"
import { Eye, Maximize, Pause, Play, Volume2 } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { liveChatMessages, liveStreamData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function LiveVideoPlayer() {
  const [playing, setPlaying] = useState(true)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black ring-1 ring-foreground/10">
      <Image
        src={liveStreamData.image || "/placeholder.svg"}
        alt={liveStreamData.title}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Top badges */}
      <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
        <Badge variant="destructive" className="h-7 gap-1.5 rounded-full bg-destructive px-3 text-xs font-bold text-white">
          <span className="size-1.5 animate-pulse rounded-full bg-white" />
          مباشر
        </Badge>
        <Badge variant="secondary" className="h-7 gap-1.5 rounded-full bg-black/50 px-3 text-xs font-medium text-white ring-0">
          <Eye className="size-3.5" aria-hidden="true" />
          {liveStreamData.viewers} مشاهد
        </Badge>
      </div>

      {/* Live chat overlay */}
      <div className="absolute inset-y-3 start-3 hidden w-48 flex-col justify-end gap-1.5 sm:flex">
        {liveChatMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "rounded-lg px-2.5 py-1.5 text-xs leading-snug text-white backdrop-blur-sm",
              msg.highlight ? "bg-primary/70" : "bg-black/45",
            )}
          >
            <span className="font-semibold">{msg.name}</span>
            <span className="text-white/70"> · {msg.time}</span>
            <p className="mt-0.5 text-white/90">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label={playing ? "إيقاف" : "تشغيل"}
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
          aria-label="الصوت"
        >
          <Volume2 className="size-4" aria-hidden="true" />
        </button>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <span className="size-1.5 rounded-full bg-destructive" />
          LIVE
        </span>
        <div className="ms-auto">
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            aria-label="ملء الشاشة"
          >
            <Maximize className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
