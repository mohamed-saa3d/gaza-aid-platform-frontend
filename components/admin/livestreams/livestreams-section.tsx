"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { AlertCircle, Loader2, Radio, RefreshCw, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { CreateLivestreamDialog } from "./create-livestream-dialog"
import { UpdateLivestreamDialog } from "./update-livestream-dialog"
import { DeleteLivestreamDialog } from "./delete-livestream-dialog"
import { getLiveStreams } from "./api"
import type { LivestreamItemData } from "./types"
export type { LivestreamItemData }

export function LivestreamsSection() {
  const [streams, setStreams] = useState<LivestreamItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchStreams = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getLiveStreams()
      setStreams(Array.isArray(response.data?.data) ? response.data.data : [])
    } catch {
      setError("فشل تحميل روابط البث من الخادم.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStreams()
  }, [fetchStreams])

  const handleAddSuccess = (newItem: LivestreamItemData) => {
    setStreams((prev) => [newItem, ...prev])
  }

  const handleUpdateSuccess = (updatedStream: LivestreamItemData) => {
    setStreams((prev) =>
      prev.map((item) => (item.id === updatedStream.id ? updatedStream : item))
    )
  }

  const handleDeleteSuccess = (id: string) => {
    setStreams((prev) => prev.filter((item) => item.id !== id))
  }

  const safeStreams = Array.isArray(streams) ? streams : [];
  const filteredStreams = safeStreams.filter(
    (item) =>
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.youtubeUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Radio className="text-primary" />
          إدارة البث المباشر
        </CardTitle>

        <CreateLivestreamDialog onSuccess={handleAddSuccess} />
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pr-9"
            placeholder="ابحث عن رابط بث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              جاري تحميل روابط البث...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
              <AlertCircle className="size-6 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchStreams}>
                <RefreshCw className="ml-2 size-3" />
                إعادة المحاولة
              </Button>
            </div>
          ) : null}

          {!loading && !error && filteredStreams.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              لا توجد روابط بث مطابقة.
            </div>
          ) : null}

          {filteredStreams.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.titleAr}</span>
                  {item.isActive ? (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 font-semibold">
                      مباشر
                    </span>
                  ) : (
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      متوقف
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{item.titleEn}</span>
              </div>

              <a
                href={item.youtubeUrl}
                className="text-sm text-primary underline truncate max-w-xs"
                target="_blank"
                rel="noreferrer"
              >
                {item.youtubeUrl}
              </a>

              <div className="flex items-center gap-1">
                <UpdateLivestreamDialog stream={item} onSuccess={handleUpdateSuccess} />
                <DeleteLivestreamDialog
                  streamId={item.id}
                  streamTitle={item.titleAr}
                  onSuccess={handleDeleteSuccess}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
