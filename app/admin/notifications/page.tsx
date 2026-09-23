'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { CalendarDays, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getPublicProjects, getPublicProjectStats, type ProjectStats } from '@/lib/api/public'
import { useLocale } from '@/components/locale-provider'
import { formatCurrency, formatNumber } from '@/lib/currency'
import type { Project } from '@/components/admin/projects/types'

const PLACEHOLDER_IMAGE = '/placeholder.svg'

const readNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const formatDate = (value: string | undefined, locale: 'ar' | 'en'): string => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getCategoryLabel = (project: Project): string | null => {
  if (project.categoryName?.trim()) return project.categoryName.trim()
  if (typeof project.category === 'object') return project.category?.name ?? null
  return null
}

/**
 * Notifications / Reports.
 *
 * The completed-projects section is sourced from the real Project collection via
 * the public projects API filtered by `status=COMPLETED`. There is deliberately
 * no mock array and no final-report upload — the platform has no such feature.
 */
export default function NotificationsPage() {
  const { locale } = useLocale()
  const [completedProjects, setCompletedProjects] = useState<Project[]>([])
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [projectsRes, statsRes] = await Promise.all([
          getPublicProjects({ status: 'COMPLETED', limit: 100 }),
          getPublicProjectStats(),
        ])

        if (cancelled) return

        setCompletedProjects(Array.isArray(projectsRes?.data) ? projectsRes.data : [])
        setStats(statsRes?.data ?? null)
      } catch (err) {
        if (cancelled) return
        console.error('Failed to load completed projects', err)
        setError('تعذّر تحميل بيانات المشاريع المكتملة حالياً.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [])

  const totalCompletedFunding = useMemo(
    () => completedProjects.reduce((sum, project) => sum + readNumber(project.collectedAmount), 0),
    [completedProjects],
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">المتابعة المالية</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">الإشعارات والتقارير</h1>
        <p className="mt-2 text-muted-foreground">
          نظرة عامة على المشاريع المكتملة ونسب الإنجاز الفعلية.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <p className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {error}
        </p>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-3">
            {completedProjects.length > 0 ? (
              completedProjects.map((project) => {
                const target = readNumber(project.targetAmount)
                const collected = readNumber(project.collectedAmount)
                const progress =
                  typeof project.progressPercentage === 'number'
                    ? project.progressPercentage
                    : target > 0
                      ? Math.min((collected / target) * 100, 100)
                      : 0
                const category = getCategoryLabel(project)
                const title = project.title || project.titleAr || project.titleEn || '—'

                return (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="relative h-44">
                      <Image
                        src={project.imgUrl || project.imageUrl || project.image || PLACEHOLDER_IMAGE}
                        alt={title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <Badge className="absolute end-3 top-3">مكتمل بنجاح</Badge>
                    </div>
                    <CardContent className="flex flex-col gap-3 p-4">
                      <div>
                        <h2 className="font-heading font-bold">{title}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {category ?? 'غير مصنفة'} · تم التمويل: {formatCurrency(collected, locale)} من{' '}
                          {formatCurrency(target, locale)}
                        </p>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {formatDate(project.updatedAt, locale)}
                        </span>
                        <span className="text-primary">{progress.toFixed(0)}%</span>
                      </div>
                      {readNumber(project.beneficiariesCount) > 0 && (
                        <p className="text-xs text-muted-foreground">
                          عدد المستفيدين: {formatNumber(readNumber(project.beneficiariesCount), locale)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground xl:col-span-3">
                لا توجد مشاريع مكتملة حتى الآن.
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" />
                ملخص الإنجاز
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">إجمالي المشاريع</p>
                <p className="font-heading text-2xl font-bold">
                  {formatNumber(stats?.totalProjects ?? 0, locale)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المشاريع المكتملة</p>
                <p className="flex items-center gap-2 font-heading text-2xl font-bold text-primary">
                  <CheckCircle2 className="size-5" />
                  {formatNumber(stats?.completedProjects ?? 0, locale)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نسبة الإنجاز</p>
                <p className="font-heading text-2xl font-bold">
                  {(stats?.completionPercentage ?? 0).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي تمويل المشاريع المكتملة</p>
                <p className="font-heading text-2xl font-bold">
                  {formatCurrency(totalCompletedFunding, locale)}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
