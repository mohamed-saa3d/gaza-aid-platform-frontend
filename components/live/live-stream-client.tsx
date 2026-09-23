"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { VideoOff, Loader2, AlertCircle, RefreshCw, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPublicLiveStreams } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import { getYouTubeEmbedUrl } from "@/lib/youtube"
import type { LivestreamItemData } from "@/components/admin/livestreams/types"

export function LiveStreamClient() {
  const { locale, t } = useLocale()
  const [activeStream, setActiveStream] = useState<LivestreamItemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStreams = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getPublicLiveStreams()
      // Backend contract: { success, message, data: { data: LiveStream[], total, page, limit } }
      const streams: LivestreamItemData[] = Array.isArray(res?.data?.data)
        ? res.data.data
        : []

      const active = streams.find((s) => s.isActive !== false)
      setActiveStream(active || null)
    } catch (err) {
      console.error("Failed to load live streams", err)
      setError(t.live.loadFailed)
    } finally {
      setLoading(false)
    }
  }, [t.live.loadFailed])

  useEffect(() => {
    fetchStreams()
  }, [fetchStreams, locale])

  const title = activeStream
    ? activeStream.title || activeStream.titleAr || activeStream.titleEn
    : ""

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t.live.checking}</p>
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
          {t.common.retry}
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
              {t.live.liveNow}
            </span>
            <h1 className="font-heading text-xl font-bold sm:text-2xl text-foreground">
              {title}
            </h1>
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-black shadow-lg">
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  // An active stream exists but its stored link cannot be embedded. Saying
  // "there is no live stream" here would be untrue; show the real state instead.
  if (activeStream && !embedUrl) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">{t.live.unavailableTitle}</h1>
        <p className="max-w-md text-balance text-muted-foreground">{t.live.unavailableBody}</p>
        <Button asChild className="rounded-full">
          <Link href="/">{t.live.backHome}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <VideoOff className="size-8" />
      </div>
      <h1 className="font-heading text-2xl font-bold text-foreground">{t.live.emptyTitle}</h1>
      <p className="max-w-md text-balance text-muted-foreground">{t.live.emptyBody}</p>
      <Button asChild className="rounded-full">
        <Link href="/">{t.live.backHome}</Link>
      </Button>
    </div>
  )
}
