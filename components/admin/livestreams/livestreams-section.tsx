"use client"

import * as React from "react"
import { useState } from "react"
import { Radio, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { CreateLivestreamDialog } from "./create-livestream-dialog"
import { UpdateLivestreamDialog } from "./update-livestream-dialog"
import { DeleteLivestreamDialog } from "./delete-livestream-dialog"
import type { LivestreamItemData } from "./types"
export type { LivestreamItemData }


const initialLivestreams: LivestreamItemData[] = [
  {
    id: "1",
    titleAr: "البث المباشر - حفل افتتاح مشروع بئر الرحمة",
    titleEn: "Live Stream - Well Opening Ceremony",
    youtubeUrl: "https://www.youtube.com/watch?v=abc12345678",
    isActive: true,
  },
  {
    id: "2",
    titleAr: "البث المباشر - توزيع كراتين رمضان",
    titleEn: "Live Stream - Ramadan Food Boxes Distribution",
    youtubeUrl: "https://www.youtube.com/watch?v=def45678901",
    isActive: true,
  },
  {
    id: "3",
    titleAr: "البث المباشر - محاضرة عن فضل الصدقة",
    titleEn: "Live Stream - Charity Virtues Lecture",
    youtubeUrl: "https://www.youtube.com/watch?v=ghi78901234",
    isActive: false,
  },
]

export function LivestreamsSection() {
  const [streams, setStreams] = useState<LivestreamItemData[]>(initialLivestreams)
  const [searchQuery, setSearchQuery] = useState("")

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
