"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { VideoOff, Loader2, AlertCircle, RefreshCw, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getPublicLiveStreams } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import { getYouTubeEmbedUrl } from "@/lib/youtube"
import type { LivestreamItemData } from "@/components/admin/livestreams/types"

/** Each "load more" click fetches exactly this many streams. */
const PAGE_SIZE = 1

export function LiveStreamClient() {
  const { locale, t } = useLocale()
  const [streams, setStreams] = useState<LivestreamItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tracks the next page to request and whether a request is in flight, so a
  // double click can never re-request the same page and duplicate a stream.
  const nextPageRef = useRef(1)
  const inFlightRef = useRef(false)

  const fetchFirstPage = useCallback(async (signal: { cancelled: boolean }) => {
    setLoading(true)
    setError(null)
    nextPageRef.current = 1
    try {
      const res = await getPublicLiveStreams({ page: 1, limit: PAGE_SIZE })
      if (signal.cancelled) return
      // Backend contract: { success, message, data: { data: LiveStream[], total, page, limit } }
      const first: LivestreamItemData[] = Array.isArray(res?.data?.data) ? res.data.data : []
      const total = res?.data?.total ?? first.length

      setStreams(first)
      nextPageRef.current = 2
      setHasMore(first.length < total)
    } catch (err) {
      if (signal.cancelled) return
      console.error("Failed to load live streams", err)
      setError(t.live.loadFailed)
    } finally {
      if (!signal.cancelled) setLoading(false)
    }
  }, [t.live.loadFailed])

  useEffect(() => {
    const signal = { cancelled: false }
    fetchFirstPage(signal)
    return () => {
      signal.cancelled = true
    }
  }, [fetchFirstPage, locale])

  const handleLoadMore = async () => {
    if (inFlightRef.current || !hasMore) return
    inFlightRef.current = true
    setLoadingMore(true)
    try {
      const page = nextPageRef.current
      const res = await getPublicLiveStreams({ page, limit: PAGE_SIZE })
      const data: LivestreamItemData[] = Array.isArray(res?.data?.data) ? res.data.data : []
      const total = res?.data?.total ?? 0

      nextPageRef.current = page + 1
      setStreams((prev) => {
        // Guard against duplicates even if a page is somehow requested twice.
        const seen = new Set(prev.map((item) => item.id))
        const fresh = data.filter((item) => !seen.has(item.id))
        const next = [...prev, ...fresh]
        setHasMore(next.length < total)
        return next
      })
    } catch (err) {
      console.error("Failed to load more live streams", err)
    } finally {
      inFlightRef.current = false
      setLoadingMore(false)
    }
  }

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
        <Button variant="outline" size="sm" onClick={() => fetchFirstPage({ cancelled: false })} className="gap-2">
          <RefreshCw className="size-4" />
          {t.common.retry}
        </Button>
      </div>
    )
  }

  // No active stream at all: keep the honest empty state.
  if (streams.length === 0) {
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

  return (
    <div className="flex flex-col gap-10">
      {streams.map((stream, index) => {
        const title = stream.title || stream.titleAr || stream.titleEn
        const embedUrl = getYouTubeEmbedUrl(stream.youtubeUrl)

        return (
          <div key={stream.id} className="flex flex-col gap-6">
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

            {embedUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border bg-black shadow-lg">
                <iframe
                  src={embedUrl}
                  title={title}
                  className="absolute inset-0 size-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              // An active stream exists but its stored link cannot be embedded.
              <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <AlertCircle className="size-7" />
                </div>
                <h2 className="font-heading text-xl font-bold text-foreground">{t.live.unavailableTitle}</h2>
                <p className="max-w-md text-balance text-muted-foreground">{t.live.unavailableBody}</p>
              </div>
            )}

            {index === streams.length - 1 && (
              <div className="flex justify-center">
                {hasMore ? (
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? t.live.loadingMore : t.live.loadMore}
                    <RefreshCw className={`size-4 ${loadingMore ? "animate-spin" : ""}`} aria-hidden="true" />
                  </Button>
                ) : (
                  <Card className="w-full max-w-xl border-dashed">
                    <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Radio className="size-5" aria-hidden="true" />
                      </span>
                      <p className="font-heading text-lg font-bold text-foreground">{t.live.noMore}</p>
                      <p className="text-sm text-muted-foreground">{t.live.noMoreHint}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
