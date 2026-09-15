"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Pencil,
  Plus,
  Search,
  Trash2,
  Radio,
  FolderKanban,
  Newspaper,
  Landmark,
  Save,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { projectsService } from "@/services/projects.service"
import type { Project, PaginatedResponse, CategoryId } from "@/types/models"
import { CreateProjectDialog } from "@/components/admin/create-project-dialog"
import { UpdateProjectDialog } from "@/components/admin/update-project-dialog"
import { DeleteProjectDialog } from "@/components/admin/delete-project-dialog"

const news = [
  { id: 1, title: "توزيع السلال الغذائية", description: "مبادرة توزيع السلال الغذائية على الأسر الأكثر احتياجاً.", image: "/images/news-food-distribution.png" },
  { id: 2, title: "إفطار صائم في رمضان", description: "تستمر مبادراتنا في دعم الصائمين في مختلف المناطق.", image: "/images/news-featured-winter.png" },
  { id: 3, title: "حملة الشتاء الدافئ", description: "ساهم معنا لنقدم الدفء للأسر المحتاجة هذا الشتاء.", image: "/images/news-mobile-clinic.png" },
]

const liveStreams = [
  { id: 1, title: "البث المباشر - حفل افتتاح مشروع بئر الرحمة", youtubeUrl: "https://www.youtube.com/live/abc123" },
  { id: 2, title: "البث المباشر - توزيع كراتين رمضان", youtubeUrl: "https://www.youtube.com/live/def456" },
  { id: 3, title: "البث المباشر - محاضرة عن فضل الصدقة", youtubeUrl: "https://www.youtube.com/live/ghi789" },
]

export default function ContentPage() {
  // State for Projects API Fetching & Pagination
  const [projectsData, setProjectsData] = useState<PaginatedResponse<Project> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Query Parameters State
  const [page, setPage] = useState(1)
  const [limit] = useState(6)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState<string>("all")

  // Fetch Projects Function
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await projectsService.getProjects({
        page,
        limit,
        search: search.trim() || undefined,
        category: category !== "all" ? category : undefined,
      })
      setProjectsData(response)
    } catch (err: any) {
      console.error("Failed to fetch projects:", err)
      setError("فشل في تحميل المشاريع من الخادم.")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, category])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Extract meta and data safely
  const projects = projectsData?.data || []
  const meta = projectsData?.meta || { total: 0, page: 1, limit: 6, totalPages: 1 }

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">إدارة المنصة</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            تعديل المحتوى والبيانات
          </h1>
          <p className="mt-2 text-muted-foreground">
            أدر الأخبار والمشاريع والبث المباشر من مكان واحد.
          </p>
        </div>

        {/* Global Create Project Dialog Trigger */}
        <CreateProjectDialog onSuccess={fetchProjects} />
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        {/* News Management Card */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="text-primary" />
              إدارة الأخبار
            </CardTitle>
            <Button variant="ghost" size="icon-sm">
              <Plus />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
              <Input className="pr-9" placeholder="ابحث عن خبر..." />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {news.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-lg border">
                  <div className="relative h-28">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-bold">{item.title}</h3>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="تعديل">
                          <Pencil className="size-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="حذف">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects Management Card (Connected to Real Backend DAL) */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="text-primary" />
              إدارة المشاريع ({meta.total || 0})
            </CardTitle>

            <CreateProjectDialog
              onSuccess={fetchProjects}
              trigger={
                <Button variant="ghost" size="icon-sm" aria-label="إضافة مشروع">
                  <Plus className="size-4" />
                </Button>
              }
            />
          </CardHeader>

          <CardContent className="flex flex-1 flex-col justify-between gap-4">
            {/* Filters & Search Header */}
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  className="pr-9"
                  placeholder="ابحث عن مشروع..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />
              </div>

              <div className="w-44">
                <Select
                  value={category}
                  onValueChange={(val) => {
                    if (val) setCategory(val)
                    setPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل التصنيفات</SelectItem>
                    <SelectItem value="water">سقيا ماء</SelectItem>
                    <SelectItem value="food">سلال غذائية</SelectItem>
                    <SelectItem value="shelter">إيواء</SelectItem>
                    <SelectItem value="orphans">رعاية أيتام</SelectItem>
                    <SelectItem value="health">صحة</SelectItem>
                    <SelectItem value="education">تعليم</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Projects List Content Area */}
            <div className="flex flex-col gap-3 min-h-[300px]">
              {loading ? (
                // Loading Skeleton State
                <div className="flex flex-col gap-3 py-6 items-center justify-center text-muted-foreground my-auto">
                  <Loader2 className="size-8 animate-spin text-primary" />
                  <p className="text-sm">جاري تحميل المشاريع...</p>
                </div>
              ) : error ? (
                // Error State
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center my-auto">
                  <AlertCircle className="size-8 text-destructive" />
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <Button variant="outline" size="sm" onClick={fetchProjects} className="mt-2">
                    <RefreshCw className="ml-2 size-3" />
                    إعادة المحاولة
                  </Button>
                </div>
              ) : projects.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center my-auto text-muted-foreground">
                  <FolderKanban className="size-10 text-muted-foreground/50" />
                  <p className="text-sm font-medium">لم يتم العثور على أي مشاريع.</p>
                  <p className="text-xs">جرّب تغيير كلمات البحث أو قم بإضافة مشروع جديد.</p>
                </div>
              ) : (
                // Real Projects List Rendering
                projects.map((item) => {
                  const targetVal = item.target || 0
                  const fundedVal = item.funded || 0
                  const calcProgress = item.progress ?? (targetVal > 0 ? Math.round((fundedVal / targetVal) * 100) : 0)

                  return (
                    <article
                      key={item.id}
                      className="flex flex-col sm:flex-row gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/40"
                    >
                      <div className="relative h-24 w-full sm:w-28 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image || "/images/project-placeholder.png"}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-sm sm:text-base line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                              المستهدف: {targetVal.toLocaleString("ar-SA")} ر.س · تم جمع: {fundedVal.toLocaleString("ar-SA")} ر.س
                            </p>
                          </div>

                          {/* Connected Action Modals */}
                          <div className="flex items-center gap-1">
                            <UpdateProjectDialog project={item} onSuccess={fetchProjects} />
                            <DeleteProjectDialog
                              projectId={item.id}
                              projectTitle={item.title}
                              onSuccess={fetchProjects}
                            />
                          </div>
                        </div>

                        <Progress value={calcProgress} className="mt-3 h-2" />
                        <div className="mt-1 flex items-center justify-between text-xs">
                          <span className="text-primary font-medium">{calcProgress}% مكتمل</span>
                          <span className="text-muted-foreground capitalize">{item.status}</span>
                        </div>
                      </div>
                    </article>
                  )
                })
              )}
            </div>

            {/* Dynamic Pagination Controls */}
            {meta.totalPages > 1 && (
              <div className="pt-2 border-t">
                <Pagination>
                  <PaginationContent className="flex items-center gap-2">
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={page <= 1 || loading}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      >
                        <PaginationPrevious />
                      </Button>
                    </PaginationItem>

                    <span className="text-xs font-medium px-3 text-muted-foreground">
                      صفحة {meta.page} من {meta.totalPages}
                    </span>

                    <PaginationItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={page >= meta.totalPages || loading}
                        onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                      >
                        <PaginationNext />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Streams Management Card */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Radio className="text-primary" />
              إدارة البث المباشر
            </CardTitle>
            <Button variant="ghost" size="icon-sm">
              <Plus />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="relative max-w-xs">
              <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
              <Input className="pr-9" placeholder="ابحث عن رابط بث..." />
            </div>
            <div className="flex flex-col gap-2">
              {liveStreams.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3"
                >
                  <span className="min-w-64 flex-1 font-medium">{item.title}</span>
                  <a
                    href={item.youtubeUrl}
                    className="text-sm text-primary underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.youtubeUrl}
                  </a>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" aria-label="تعديل">
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label="حذف">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Direct Payment & Contact Settings */}
      <section className="grid gap-6 lg:grid-cols-2">
        <SettingsCard
          title="بيانات التحويل المباشر"
          icon={<Landmark />}
          fields={[
            "رقم التحويل المباشر / المحفظة",
            "رقم آخر",
            "عنوان استلام الدفع",
            "عنوان استلام الدفع الخاص بالرقم الثاني",
          ]}
        />
        <SettingsCard
          title="إعدادات التواصل"
          icon={<Radio />}
          fields={["رقم الهاتف", "البريد الإلكتروني"]}
        />
      </section>
    </div>
  )
}

function SettingsCard({
  title,
  icon,
  fields,
}: {
  title: string
  icon: React.ReactNode
  fields: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field} className="flex flex-col gap-2">
              <Label htmlFor={`${title}-${index}`}>{field}</Label>
              <Input
                id={`${title}-${index}`}
                defaultValue={
                  index === 0
                    ? title.includes("تواصل")
                      ? "010 1234 5678"
                      : "010922731005"
                    : undefined
                }
                placeholder={`أدخل ${field}`}
              />
            </div>
          ))}
          <Button className="mt-2 w-full">
            <Save data-icon="inline-start" />
            حفظ التحديثات
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
