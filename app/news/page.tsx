import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeaturedArticleCard } from "@/components/news/featured-article-card"
import { NewsArticleCard } from "@/components/news/news-article-card"
import { featuredNewsArticle, newsArticles } from "@/lib/mock-data"

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-balance sm:text-4xl">المركز الإعلامي والأخبار</h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          تابع أحدث تقارير وتحديثات مشاريعنا الإغاثية
        </p>
        <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
      </div>

      <div className="mb-12">
        <FeaturedArticleCard article={featuredNewsArticle} />
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="h-6 w-1 rounded-full bg-primary" aria-hidden="true" />
        <h2 className="font-heading text-2xl font-bold text-foreground">آخر الأخبار</h2>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {newsArticles.map((article) => (
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
  )
}
