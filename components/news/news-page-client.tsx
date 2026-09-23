"use client"

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeaturedArticleCard } from '@/components/news/featured-article-card'
import { NewsArticleCard } from '@/components/news/news-article-card'
import { getPublicNews } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import type { NewsItemData } from '@/components/admin/news/types'

export function NewsPageClient() {
  const { locale, t } = useLocale()
  const [featured, setFeatured] = useState<NewsItemData | null>(null);
  const [articles, setArticles] = useState<NewsItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false

    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      try {
        // Backend contract: { success, message, data: { data: News[], total, page, limit } }
        const response = await getPublicNews();
        if (cancelled) return

        const data: NewsItemData[] = Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

        setFeatured(data[0] ?? null);
        setArticles(data.slice(1));
      } catch (err) {
        if (cancelled) return
        console.error("Failed to load news", err);
        setError(t.news.loadFailed);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchNews();

    return () => {
      cancelled = true
    }
  }, [locale]);

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
            <Button variant="outline" className="gap-2 rounded-full">
              {t.news.loadMore}
              <RefreshCw className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </>
      )}
    </>
  );
}
