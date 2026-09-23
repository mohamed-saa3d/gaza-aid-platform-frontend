"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Home, ChevronLeft, Sprout, Loader2, AlertCircle, Share2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProjectProgress } from "@/components/project-progress"
import { getPublicProjectById } from "@/lib/api/public"
import { useLocale } from "@/components/locale-provider"
import type { Project } from "@/components/admin/projects/types"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { locale } = useLocale()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchProject() {
      setLoading(true)
      setError(null)
      try {
        const res = await getPublicProjectById(id)
        if (cancelled) return
        setProject(res?.data || null)
      } catch {
        if (cancelled) return
        setError("لم يتم العثور على المشروع المطلوبة أو حدث خطأ أثناء التحميل.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchProject()

    return () => {
      cancelled = true
    }
  }, [id, locale])

  const handleShare = async () => {
    if (typeof window === "undefined" || !project) return
    const shareUrl = `${window.location.origin}/projects/${project.id}`
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    } catch {
      setCopied(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">جاري تحميل تفاصيل المشروع...</p>
        </div>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-12 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <h1 className="font-heading text-xl font-bold text-foreground">المشروع غير موجود</h1>
          <p className="max-w-md text-sm text-muted-foreground">{error}</p>
          <Button asChild variant="outline" className="rounded-full mt-2">
            <Link href="/projects">العودة إلى قائمة المشاريع</Link>
          </Button>
        </div>
      </main>
    )
  }

  // Prefer the backend-localized values; the raw AR/EN pairs are only a fallback
  // for payloads that were not localized (e.g. admin contexts).
  const title = project.title || project.titleAr || project.titleEn || ""
  const description = project.description || project.descriptionAr || project.descriptionEn || ""
  const image = project.imgUrl || project.imageUrl || project.image || "/placeholder.svg"
  const categoryName =
    project.categoryName ||
    (typeof project.category === "object" ? project.category?.name : undefined)

  const target = project.targetAmount || 0
  const collected = project.collectedAmount || 0
  const progress = target > 0 ? Math.min((collected / target) * 100, 100) : 0
  const remaining = Math.max(target - collected, 0)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="size-4" />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft className="size-4 ltr:rotate-180" />
        <Link href="/projects" className="hover:text-foreground">
          <span>المشاريع</span>
        </Link>
        <ChevronLeft className="size-4 ltr:rotate-180" />
        <span className="font-medium text-foreground truncate max-w-xs">{title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        {/* Main Project Details */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <Badge
              className="absolute end-4 top-4 text-xs font-semibold px-3 py-1 shadow-md"
              variant={project.status === "ACTIVE" ? "secondary" : "default"}
            >
              {project.status === "ACTIVE" ? "مستمر" : project.status === "PAUSED" ? "متوقف" : "مكتمل"}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            {categoryName ? (
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {categoryName}
              </span>
            ) : null}
            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl leading-tight">
              {title}
            </h1>
            <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="border-border/80 shadow-md">
            <CardContent className="flex flex-col gap-6 p-6">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sprout className="size-5" />
                <span>بطاقة التبرع والمساهمة</span>
              </div>

              <ProjectProgress progress={progress} funded={collected} remaining={remaining} />

              {project.beneficiariesCount ? (
                <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
                  <span className="text-muted-foreground">عدد المستفيدين:</span>
                  <span className="font-bold text-foreground">
                    {project.beneficiariesCount.toLocaleString()} مستفيد
                  </span>
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-2">
                <Button asChild size="lg" className="w-full gap-2 rounded-full font-bold text-base shadow-sm">
                  <Link href={`/donate?project=${project.id}`}>
                    <Heart className="size-5" />
                    ساهم الآن في المشروع
                  </Link>
                </Button>

                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 rounded-full text-sm"
                    onClick={handleShare}
                  >
                    <Share2 className="size-4" />
                    مشاركة رابط المشروع
                  </Button>
                  {copied && (
                    <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background shadow-md">
                      تم نسخ رابط مشاركة المشروع!
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
