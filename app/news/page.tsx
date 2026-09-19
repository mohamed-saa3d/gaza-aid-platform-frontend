import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FeaturedArticleCard } from '@/components/news/featured-article-card'
import { NewsArticleCard } from '@/components/news/news-article-card'
import { getNews } from '@/components/admin/news/api'
import type { NewsItemData } from '@/components/admin/news/types'

export default function NewsPage() {
  const [featured, setFeatured] = useState<NewsItemData | null>(null);
  const [articles, setArticles] = useState<NewsItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await getNews();
        const data: NewsItemData[] = Array.isArray((response as any).news)
          ? (response as any).news
          : Array.isArray((response as any).data)
          ? (response as any).data
          : [];
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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center">جاري تحميل الأخبار...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-center text-destructive">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-balance sm:text-4xl">
          المركز الإعلامي والأخبار
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          تابع أحدث تقارير وتحديثات مشاريعنا الإغاثية
        </p>
        <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
      </div>

      {featured && (
        <div className="mb-12">
          <FeaturedArticleCard article={featured} />
        </div>
      )}

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
    </main>
  );
}
