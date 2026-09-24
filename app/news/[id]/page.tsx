"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CalendarDays, Loader2, AlertCircle, Newspaper, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { BreadcrumbWithDetail } from "@/components/breadcrumb"
import { useLocale } from "@/components/locale-provider"
import { getPublicNewsById } from "@/lib/api/public"
import type { NewsItemData } from "@/components/admin/news/types"

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { locale, t } = useLocale()
  const [news, setNews] = useState<NewsItemData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      setError(null)
      try {
        const res = await getPublicNewsById(id)
        const data = res?.data || null
        setNews(data)
      } catch {
        setError(t.newsDetail.loadFailed)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [id, t.newsDetail.loadFailed])

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{t.newsDetail.loading}</p>
        </div>
      </main>
    )
  }

  if (error || !news) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <h1 className="font-heading text-xl font-bold text-foreground">{t.newsDetail.notFoundTitle}</h1>
          <p className="max-w-md text-sm text-muted-foreground">{error}</p>
          <Button asChild variant="outline" className="rounded-full mt-2">
            <Link href="/news">{t.newsDetail.backToNews}</Link>
          </Button>
        </div>
      </main>
    )
  }

  const title = news.title || news.titleAr || news.titleEn || ""
  const description = news.description || news.descriptionAr || news.descriptionEn || ""
  const image = news.imageUrl || "/placeholder.svg"

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs — localized via the shared client Breadcrumb component */}
      <BreadcrumbWithDetail sectionLabel="news" sectionHref="/news" detail={title} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" />

      <Card className="overflow-hidden border-border/80 shadow-md">
        <CardContent className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {news.isUrgent && (
                <Badge className="rounded-full bg-destructive/10 text-destructive border-0 px-3 py-1 text-xs font-bold">
                  {t.news.urgent}
                </Badge>
              )}
              {news.createdAt && (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {new Date(news.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl leading-snug">
              {title}
            </h1>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-4 text-base leading-relaxed text-muted-foreground whitespace-pre-line">
            {description}
          </div>

          {news.detailsUrl && (
            <div className="mt-4 border-t pt-4">
              <a
                href={news.detailsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <span>{t.newsDetail.source}</span>
                <ExternalLink className="size-4" />
              </a>
            </div>
          )}

          <div className="mt-6 flex justify-center border-t pt-6">
            <Button asChild variant="outline" className="rounded-full gap-2">
              <Link href="/news">
                <Newspaper className="size-4" />
                {t.newsDetail.backToAllNews}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
