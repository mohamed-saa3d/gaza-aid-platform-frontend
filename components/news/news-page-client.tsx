"use client"

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeaturedArticleCard } from '@/components/news/featured-article-card'
import { NewsArticleCard } from '@/components/news/news-article-card'
import { getPublicNews } from "@/lib/api/public"
import type { NewsItemData } from '@/components/admin/news/types'

export function NewsPageClient() {
  const [featured, setFeatured] = useState<NewsItemData | null>(null);
  const [articles, setArticles] = useState<NewsItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getPublicNews();
        // Assuming response is an object with data array according to our API wrapper
        const responseData = response as any;
        const data: NewsItemData[] = Array.isArray(responseData?.data?.data)
          ? responseData.data.data
          : Array.isArray(responseData?.data)
          ? responseData.data
          : Array.isArray(responseData) ? responseData : [];
          
        if (data.length > 0) {
          setFeatured(data[0]);
          setArticles(data.slice(1));
        }
      } catch (err) {
        setError('فشل تحميل الأخبار');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-center text-muted-foreground">جاري تحميل الأخبار...</p>
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
        <p className="text-center text-muted-foreground mb-12">لا توجد أخبار حالياً.</p>
      )}

      {articles.length > 0 && (
        <>
          <div className="mb-6 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
            <h2 className="font-heading text-2xl font-bold text-foreground">آخر الأخبار</h2>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <NewsArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" className="gap-2 rounded-full">
              عرض المزيد من الأخبار
              <RefreshCw className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </>
      )}
    </>
  );
}
