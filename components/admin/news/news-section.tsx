"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { Newspaper, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { CreateNewsDialog } from "./create-news-dialog"
import { UpdateNewsDialog } from "./update-news-dialog"
import { DeleteNewsDialog } from "./delete-news-dialog"
import type { NewsItemData } from "./types"
export type { NewsItemData }


const initialNewsItems: NewsItemData[] = [
  {
    id: "1",
    titleAr: "توزيع السلال الغذائية",
    titleEn: "Food Baskets Distribution",
    descriptionAr: "مبادرة توزيع السلال الغذائية على الأسر الأكثر احتياجاً.",
    descriptionEn: "Initiative to distribute food baskets to needy families.",
    detailsUrl: "https://example.com/news/1",
    isUrgent: true,
    imageUrl: "/images/news-food-distribution.png",
  },
  {
    id: "2",
    titleAr: "إفطار صائم في رمضان",
    titleEn: "Ramadan Iftar Campaign",
    descriptionAr: "تستمر مبادراتنا في دعم الصائمين في مختلف المناطق.",
    descriptionEn: "Our initiatives continue to support fasting people in various areas.",
    detailsUrl: "https://example.com/news/2",
    isUrgent: false,
    imageUrl: "/images/news-featured-winter.png",
  },
  {
    id: "3",
    titleAr: "حملة الشتاء الدافئ",
    titleEn: "Warm Winter Campaign",
    descriptionAr: "ساهم معنا لنقدم الدفء للأسر المحتاجة هذا الشتاء.",
    descriptionEn: "Join us in bringing warmth to families in need this winter.",
    detailsUrl: "",
    isUrgent: false,
    imageUrl: "/images/news-mobile-clinic.png",
  },
]

export function NewsSection() {
  const [news, setNews] = useState<NewsItemData[]>(initialNewsItems)
  const [searchQuery, setSearchQuery] = useState("")

  const handleAddSuccess = (newItem: NewsItemData) => {
    setNews((prev) => [newItem, ...prev])
  }

  const handleUpdateSuccess = (updatedItem: NewsItemData) => {
    setNews((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    )
  }

  const handleDeleteSuccess = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id))
  }

  const filteredNews = news.filter(
    (item) =>
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="text-primary" />
          إدارة الأخبار
        </CardTitle>

        <CreateNewsDialog onSuccess={handleAddSuccess} />
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pr-9"
            placeholder="ابحث عن خبر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {filteredNews.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border">
              <div className="relative h-28">
                <Image
                  src={item.imageUrl}
                  alt={item.titleAr}
                  fill
                  className="object-cover"
                />
                {item.isUrgent && (
                  <span className="absolute top-2 right-2 rounded bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                    عاجل
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold line-clamp-1">{item.titleAr}</h3>
                  <div className="flex items-center gap-1">
                    <UpdateNewsDialog item={item} onSuccess={handleUpdateSuccess} />
                    <DeleteNewsDialog
                      newsId={item.id}
                      newsTitle={item.titleAr}
                      onSuccess={handleDeleteSuccess}
                    />
                  </div>
                </div>
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.descriptionAr}
                </p>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
