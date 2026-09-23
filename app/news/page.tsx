import { Breadcrumb } from "@/components/breadcrumb"
import { LocalizedHeading } from "@/components/localized-heading"
import { NewsPageClient } from '@/components/news/news-page-client'

export const metadata = {
  title: 'الأخبار والمركز الإعلامي',
  description: 'تابع أحدث تقارير وتحديثات مشاريعنا الإغاثية',
}

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb label="news" />

      <div className="mb-10 text-center">
        <LocalizedHeading section="pages" titleKey="newsTitle" subtitleKey="newsSubtitle" />
        <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-primary" aria-hidden="true" />
      </div>

      <NewsPageClient />
    </main>
  );
}
