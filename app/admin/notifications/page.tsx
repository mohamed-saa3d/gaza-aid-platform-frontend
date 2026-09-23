'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { CalendarDays, CheckCircle2, Loader2, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getPublicProjects, getPublicProjectStats, type ProjectStats } from '@/lib/api/public'
import type { Project } from '@/components/admin/projects/types'

const PLACEHOLDER_IMAGE = '/placeholder.svg'

const readNumber = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const formatAmount = (value: number): string => value.toLocaleString('ar-EG')

const formatDate = (value?: string): string => {
  if (!value) return 'â€”'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'â€”'

  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
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
 * no mock array and no final-report upload â€” the platform has no such feature.
 */
export default function NotificationsPage() {
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
        setError('ØªØ¹Ø°Ù‘Ø± ØªØ­Ù…ÙŠÙ„ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ù…ÙƒØªÙ…Ù„Ø© Ø­Ø§Ù„ÙŠØ§Ù‹.')
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
        <p className="text-sm font-medium text-primary">Ø§Ù„Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ù…Ø§Ù„ÙŠØ©</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Ø§Ù„Ø¥Ø´Ø¹Ø§Ø±Ø§Øª ÙˆØ§Ù„ØªÙ‚Ø§Ø±ÙŠØ±</h1>
        <p className="mt-2 text-muted-foreground">
          Ù†Ø¸Ø±Ø© Ø¹Ø§Ù…Ø© Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ù…ÙƒØªÙ…Ù„Ø© ÙˆÙ†Ø³Ø¨ Ø§Ù„Ø¥Ù†Ø¬Ø§Ø² Ø§Ù„ÙØ¹Ù„ÙŠØ©.
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
                      <Badge className="absolute end-3 top-3">Ù…ÙƒØªÙ…Ù„ Ø¨Ù†Ø¬Ø§Ø­</Badge>
                    </div>
                    <CardContent className="flex flex-col gap-3 p-4">
                      <div>
                        <h2 className="font-heading font-bold">{title}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {category ?? 'ØºÙŠØ± Ù…ØµÙ†ÙØ©'} Â· ØªÙ… Ø§Ù„ØªÙ…ÙˆÙŠÙ„: {formatAmount(collected)} Ø±.Ø³ Ù…Ù†{' '}
                          {formatAmount(target)} Ø±.Ø³
                        </p>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {formatDate(project.updatedAt)}
                        </span>
                        <span className="text-primary">{progress.toFixed(0)}%</span>
                      </div>
                      {readNumber(project.beneficiariesCount) > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Ø¹Ø¯Ø¯ Ø§Ù„Ù…Ø³ØªÙÙŠØ¯ÙŠÙ†: {formatAmount(readNumber(project.beneficiariesCount))}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground xl:col-span-3">
                Ù„Ø§ ØªÙˆØ¬Ø¯ Ù…Ø´Ø§Ø±ÙŠØ¹ Ù…ÙƒØªÙ…Ù„Ø© Ø­ØªÙ‰ Ø§Ù„Ø¢Ù†.
              </p>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-primary" />
                Ù…Ù„Ø®Øµ Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Ø¥Ø¬Ù…Ø§Ù„ÙŠ Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹</p>
                <p className="font-heading text-2xl font-bold">
                  {formatAmount(stats?.totalProjects ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ù…ÙƒØªÙ…Ù„Ø©</p>
                <p className="flex items-center gap-2 font-heading text-2xl font-bold text-primary">
                  <CheckCircle2 className="size-5" />
                  {formatAmount(stats?.completedProjects ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ù†Ø³Ø¨Ø© Ø§Ù„Ø¥Ù†Ø¬Ø§Ø²</p>
                <p className="font-heading text-2xl font-bold">
                  {(stats?.completionPercentage ?? 0).toFixed(0)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ø¥Ø¬Ù…Ø§Ù„ÙŠ ØªÙ…ÙˆÙŠÙ„ Ø§Ù„Ù…Ø´Ø§Ø±ÙŠØ¹ Ø§Ù„Ù…ÙƒØªÙ…Ù„Ø©</p>
                <p className="font-heading text-2xl font-bold">
                  {formatAmount(totalCompletedFunding)} Ø±.Ø³
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
