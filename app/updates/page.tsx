"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Heart, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CompletionRateCard } from "@/components/updates/completion-rate-card"
import { ProgressOverTimeChart } from "@/components/updates/progress-over-time-chart"
import { CompletedUpdateCard } from "@/components/updates/completed-update-card"
import { getPublicProjects } from "@/lib/api/public"
import type { Project } from "@/components/admin/projects/types"

export default function UpdatesPage() {
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCompleted() {
      try {
        const res = await getPublicProjects({ status: "COMPLETED" })
        const data = Array.isArray(res?.data) ? res.data : []
        setCompletedProjects(data)
      } catch (err) {
        console.error("Failed to load completed projects", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCompleted()
  }, [])

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
        <Button asChild variant="outline" className="gap-2 rounded-full">
          <Link href="/projects">
            عرض كل المشاريع
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-primary size-8" />
        </div>
      ) : completedProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedProjects.map((project) => (
            <CompletedUpdateCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-12 text-center">
          <CheckCircle2 className="size-10 text-muted-foreground/60 mb-3" />
          <p className="text-base font-semibold text-foreground">لا توجد مشاريع مكتملة حالياً</p>
          <p className="mt-1 text-sm text-muted-foreground">
            تتم إضافة المشاريع المكتملة تلقائياً بمجرد الوصول لهدف التمويل أو عند إكمالها من لوحة التحكم.
          </p>
        </div>
      )}
    </main>
  )
}
