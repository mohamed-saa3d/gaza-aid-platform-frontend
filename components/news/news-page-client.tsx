"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FeaturedArticleCard } from '@/components/news/featured-article-card'
import { NewsArticleCard } from '@/components/news/news-article-card'
import { getPublicNews } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import type { NewsItemData } from '@/components/admin/news/types'

/** Number of news items fetched per request ("load more" adds exactly this many). */
const PAGE_SIZE = 3

export function NewsPageClient() {
  const { locale, t } = useLocale()
  const [featured, setFeatured] = useState<NewsItemData | null>(null);
  const [articles, setArticles] = useState<NewsItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tracks the next page to request and whether a request is in flight, so a
  // double click can never re-request the same page and duplicate items.
  const nextPageRef = useRef(1)
  const inFlightRef = useRef(false)

  const fetchFirstPage = useCallback(async (signal: { cancelled: boolean }) => {
    setLoading(true)
    setError(null)
    nextPageRef.current = 1
    try {
      // Backend contract: { success, message, data: { data: News[], total, page, limit } }
      const response = await getPublicNews({ page: 1, limit: PAGE_SIZE });
      if (signal.cancelled) return

      const data: NewsItemData[] = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const total = response?.data?.total ?? data.length;

      setFeatured(data[0] ?? null);
      const rest = data.slice(1);
      setArticles(rest);
      nextPageRef.current = 2
      setHasMore(rest.length + 1 < total);
    } catch (err) {
      if (signal.cancelled) return
      console.error("Failed to load news", err);
      setError(t.news.loadFailed);
    } finally {
      if (!signal.cancelled) setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const signal = { cancelled: false }
    fetchFirstPage(signal)
    return () => {
      signal.cancelled = true
    }
  }, [locale, fetchFirstPage]);

  const handleLoadMore = async () => {
    if (inFlightRef.current || !hasMore) return
    inFlightRef.current = true
    setLoadingMore(true)
    try {
      const page = nextPageRef.current
      const response = await getPublicNews({ page, limit: PAGE_SIZE });
      const data: NewsItemData[] = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const total = response?.data?.total ?? 0;

      nextPageRef.current = page + 1
      setArticles((prev) => {
        // Guard against duplicates even if a page is somehow requested twice.
        const seen = new Set(prev.map((item) => item.id));
        const fresh = data.filter((item) => !seen.has(item.id));
        const next = [...prev, ...fresh];
        setHasMore(next.length + (featured ? 1 : 0) < total);
        return next;
      });
    } catch (err) {
      console.error("Failed to load more news", err);
    } finally {
      inFlightRef.current = false
      setLoadingMore(false)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-center text-muted-foreground">{t.news.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-center text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <>
      {featured ? (
        <div className="mb-12">
          <FeaturedArticleCard article={featured} />
        </div>
      ) : (
        <p className="text-center text-muted-foreground mb-12">{t.news.empty}</p>
      )}

      {articles.length > 0 && (
        <>
          <div className="mb-6 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="font-heading text-2xl font-bold text-foreground">{t.news.latestTitle}</h2>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <NewsArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="flex justify-center">
            {hasMore ? (
              <Button
                variant="outline"
                className="gap-2 rounded-full"
                onClick={handleLoadMore}
                disabled={loadingMore}
              >
                {loadingMore ? t.news.loadingMore : t.news.loadMore}
                <RefreshCw className={`size-4 ${loadingMore ? "animate-spin" : ""}`} aria-hidden="true" />
              </Button>
            ) : (
              <Card className="w-full max-w-xl border-dashed">
                <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <RefreshCw className="size-5" aria-hidden="true" />
                  </span>
                  <p className="font-heading text-lg font-bold text-foreground">{t.news.noMore}</p>
                  <p className="text-sm text-muted-foreground">{t.news.noMoreHint}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </>
  );
}
