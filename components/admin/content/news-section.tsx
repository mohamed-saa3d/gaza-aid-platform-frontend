"use client"

import * as React from "react"
import Image from "next/image"
import { Newspaper, Plus, Pencil, Trash2, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const newsItems = [
  {
    id: 1,
    title: "توزيع السلال الغذائية",
    description: "مبادرة توزيع السلال الغذائية على الأسر الأكثر احتياجاً.",
    image: "/images/news-food-distribution.png",
  },
  {
    id: 2,
    title: "إفطار صائم في رمضان",
    description: "تستمر مبادراتنا في دعم الصائمين في مختلف المناطق.",
    image: "/images/news-featured-winter.png",
  },
  {
    id: 3,
    title: "حملة الشتاء الدافئ",
    description: "ساهم معنا لنقدم الدفء للأسر المحتاجة هذا الشتاء.",
    image: "/images/news-mobile-clinic.png",
  },
]

export function NewsSection() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="text-primary" />
          إدارة الأخبار
        </CardTitle>
        <Button variant="ghost" size="icon-sm" aria-label="إضافة خبر">
          <Plus />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input className="pr-9" placeholder="ابحث عن خبر..." />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {newsItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border">
              <div className="relative h-28">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold">{item.title}</h3>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="تعديل الخبر">
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="حذف الخبر">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
