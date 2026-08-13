import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompletionRateCard } from "@/components/updates/completion-rate-card"
import { ProgressOverTimeChart } from "@/components/updates/progress-over-time-chart"
import { CompletedUpdateCard } from "@/components/updates/completed-update-card"
import { completedUpdates } from "@/lib/mock-data"

export default function UpdatesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-balance sm:text-4xl">
          تحديثات مشاريعنا
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-muted-foreground">
          نواصل العمل بروح الفريق الواحد لأثر مستدام يغيّر حياة المحتاجين نحو الأفضل.
        </p>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3">
          <span className="h-px w-16 bg-border" aria-hidden="true" />
          <Heart className="size-5 text-accent-foreground" aria-hidden="true" />
          <span className="h-px w-16 bg-border" aria-hidden="true" />
        </div>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
        <CompletionRateCard />
        <ProgressOverTimeChart />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold">أحدث المشاريع المكتملة</h2>
        <Button variant="outline" className="gap-2 rounded-full">
          عرض كل المشاريع
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {completedUpdates.map((update) => (
          <CompletedUpdateCard key={update.id} update={update} />
        ))}
      </div>
    </main>
  )
}
