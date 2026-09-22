"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { VideoOff, Loader2, AlertCircle, RefreshCw, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublicLiveStreams } from "@/lib/api/public"
import type { LivestreamItemData } from "@/components/admin/livestreams/types"

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url
      if (parsed.pathname.startsWith("/live/")) {
        const id = parsed.pathname.split("/live/")[1]
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      const v = parsed.searchParams.get("v")
      if (v) return `https://www.youtube.com/embed/${v}`
    } else if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1)
      if (id) return `https://www.youtube.com/embed/${id}`
    }
  } catch {
    return null
  }
  return null
}

export function LiveStreamClient() {
  const [activeStream, setActiveStream] = useState<LivestreamItemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStreams = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getPublicLiveStreams()
      // LiveStreamListResponse: { success, message, data: { data: LiveStream[], total, page, limit } }
      const streams: LivestreamItemData[] = Array.isArray(res?.data?.data)
        ? res.data.data
        : Array.isArray((res as any)?.data)
        ? (res as any).data
        : []

      const active = streams.find((s) => s.isActive !== false)
      setActiveStream(active || null)
    } catch {
      setError("فشل تحميل معلومات البث المباشر.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStreams()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">جاري التحقق من وجود بث مباشر...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="size-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchStreams} className="gap-2">
          <RefreshCw className="size-4" />
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  const embedUrl = activeStream ? getYouTubeEmbedUrl(activeStream.youtubeUrl) : null

  if (activeStream && embedUrl) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-3 rounded-full bg-destructive animate-pulse" />
            <span className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
              <Radio className="size-3.5" />
              بث مباشر الآن
            </span>
            <h1 className="font-heading text-xl font-bold sm:text-2xl text-foreground">
              {activeStream.titleAr || activeStream.titleEn}
            </h1>
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-black shadow-lg">
          <iframe
            src={embedUrl}
            title={activeStream.titleAr || activeStream.titleEn}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <VideoOff className="size-8" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-foreground">لا يوجد بث مباشر حالياً</h1>
      <p className="max-w-md text-balance text-muted-foreground">
        نحن لا نقوم بأي بث مباشر في الوقت الحالي. يرجى متابعة صفحاتنا على وسائل التواصل الاجتماعي لمعرفة مواعيد البث القادمة.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/">العودة إلى الرئيسية</Link>
      </Button>
    </div>
  )
}
