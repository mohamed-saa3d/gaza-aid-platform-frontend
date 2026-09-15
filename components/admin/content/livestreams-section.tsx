"use client"

import * as React from "react"
import { Radio, Plus, Search, Pencil, Trash2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const liveStreams = [
  { id: 1, title: "البث المباشر - حفل افتتاح مشروع بئر الرحمة", youtubeUrl: "https://www.youtube.com/live/abc123" },
  { id: 2, title: "البث المباشر - توزيع كراتين رمضان", youtubeUrl: "https://www.youtube.com/live/def456" },
  { id: 3, title: "البث المباشر - محاضرة عن فضل الصدقة", youtubeUrl: "https://www.youtube.com/live/ghi789" },
]

export function LivestreamsSection() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Radio className="text-primary" />
          إدارة البث المباشر
        </CardTitle>
        <Button size="sm" aria-label="إضافة بث جديد">
          <Plus className="ml-2 size-4" />
          إضافة بث جديد
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input className="pr-9" placeholder="ابحث عن رابط بث..." />
        </div>
        <div className="flex flex-col gap-2">
          {liveStreams.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3"
            >
              <span className="min-w-64 flex-1 font-medium">{item.title}</span>
              <a
                href={item.youtubeUrl}
                className="text-sm text-primary underline"
                target="_blank"
                rel="noreferrer"
              >
                {item.youtubeUrl}
              </a>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" aria-label="تعديل البث">
                  <Pencil className="size-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label="حذف البث">
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
