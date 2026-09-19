import { NewsPageClient } from '@/components/news/news-page-client'

export const metadata = {
  title: 'الأخبار والمركز الإعلامي',
  description: 'تابع أحدث تقارير وتحديثات مشاريعنا الإغاثية',
}

export default function NewsPage() {
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

      <NewsPageClient />
    </main>
  );
}
