"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Loader2, Pencil, Upload } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { updateProject } from "./api"
import type { Project } from "./types"
import { projectFormSchema } from "./schema"
import { getCategories } from "@/components/admin/categories/api"
import type { Category } from "@/components/admin/categories/types"
import { getErrorMessage } from "@/lib/http"

/** Sentinel option value representing a project whose category was deleted. */
const UNCATEGORIZED_VALUE = "__uncategorized__"

interface UpdateProjectDialogProps {
  project: Project
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function UpdateProjectDialog({ project, onSuccess, trigger }: UpdateProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Pre-filled Form State
  const [titleAr, setTitleAr] = useState(project.titleAr || project.title || "")
  const [titleEn, setTitleEn] = useState(project.titleEn || project.title || "")
  const [descriptionAr, setDescriptionAr] = useState(project.descriptionAr || project.description || "")
  const [descriptionEn, setDescriptionEn] = useState(project.descriptionEn || project.description || "")
  const [targetAmount, setTargetAmount] = useState<number | "">(project.targetAmount || project.target || "")
  const [beneficiariesCount, setBeneficiariesCount] = useState<number | "">(
    project.beneficiariesCount ?? project.beneficiaries ?? 0
  )
  /**
   * Resolves the project's current category to a select value.
   *
   * - a populated relation object -> its real id (this is what displays the
   *   CURRENT category when the admin opens Edit);
   * - a plain string id (legacy/admin payloads) -> that id;
   * - `null`/missing -> the explicit "Uncategorized" sentinel, so an uncategorized
   *   project is represented safely instead of defaulting to a real category.
   */
  const getCategoryId = (cat: typeof project.category, catId?: string): string => {
    if (typeof cat === "string") return cat
    if (cat && typeof cat === "object" && cat.id) return cat.id
    return catId || UNCATEGORIZED_VALUE
  }

  const [status, setStatus] = useState<"ACTIVE" | "COMPLETED" | "PAUSED">(
    (project.status as string) === "completed" || project.status === "COMPLETED"
      ? "COMPLETED"
      : (project.status as string) === "paused" || project.status === "PAUSED"
      ? "PAUSED"
      : "ACTIVE"
  )
  const [categoryId, setCategoryId] = useState<string>(getCategoryId(project.category, project.categoryId))
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Category options ALWAYS come from the real categories API — never a
  // hardcoded list. An earlier version hardcoded fake ids ("water", "food", ...)
  // which are not MongoDB ObjectIds: the current category never displayed, and
  // saving sent an invalid id the backend correctly rejected.
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setIsLoadingCategories(true)

    getCategories({ page: 1, limit: 100 })
      .then((res) => {
        if (!cancelled) setCategories(Array.isArray(res?.data) ? res.data : [])
      })
      .catch((error) => {
        console.error("Failed to fetch categories", error)
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setIsLoadingCategories(false)
      })

    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (open) {
      setTitleAr(project.titleAr || project.title || "")
      setTitleEn(project.titleEn || project.title || "")
      setDescriptionAr(project.descriptionAr || project.description || "")
      setDescriptionEn(project.descriptionEn || project.description || "")
      setTargetAmount(project.targetAmount || project.target || "")
      setBeneficiariesCount(project.beneficiariesCount ?? project.beneficiaries ?? 0)
      setStatus(
        (project.status as string) === "completed" || project.status === "COMPLETED"
          ? "COMPLETED"
          : (project.status as string) === "paused" || project.status === "PAUSED"
          ? "PAUSED"
          : "ACTIVE"
      )
      setCategoryId(getCategoryId(project.category, project.categoryId))
      setImageFile(null)
      setErrors({})
    }
  }, [open, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // `isUncategorized` maps to the backend's explicit "unassign" contract (an
    // empty string). Every other value is a real, already-validated category id.
    const isUncategorized = categoryId === UNCATEGORIZED_VALUE
    const resolvedCategoryId = categoryId === "" ? UNCATEGORIZED_VALUE : categoryId

    const rawData = {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      targetAmount: targetAmount === "" ? 0 : Number(targetAmount),
      beneficiariesCount: beneficiariesCount === "" ? 0 : Number(beneficiariesCount),
      status,
      categoryId: resolvedCategoryId,
      imageUrl: "",
    }

    const validationResult = projectFormSchema.safeParse(rawData)

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {}
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("يرجى التحقق من صحة البيانات المدخلة")
      return
    }

    setIsSubmitting(true)

    try {
      const validData = validationResult.data
      await updateProject(
        project.id,
        {
          titleAr: validData.titleAr,
          titleEn: validData.titleEn,
          descriptionAr: validData.descriptionAr,
          descriptionEn: validData.descriptionEn,
          targetAmount: validData.targetAmount,
          beneficiariesCount: validData.beneficiariesCount,
          status: validData.status,
          // `''` is the backend's explicit "disconnect category" signal; a real id
          // reassigns the project. This is what makes an uncategorized project
          // safe: we only ever send an empty string when the admin chose the
          // "Uncategorized" option, never because a value was merely missing.
          categoryId: isUncategorized ? "" : validData.categoryId,
        },
        imageFile || undefined
      )

      toast.success(`تم تحديث المشروع "${validData.titleAr}" بنجاح!`)
      setOpen(false)

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error) || "فشل في تحديث المشروع"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="تعديل المشروع">
            <Pencil className="size-4 text-primary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المشروع</DialogTitle>
          <DialogDescription>
            تعديل معلومات المشروع بالعربية والإنجليزية.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Top Upper Grid: Titles & Beneficiaries Count */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`titleAr-${project.id}`}>عنوان المشروع (بالعربية) *</Label>
              <Input
                id={`titleAr-${project.id}`}
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="عنوان المشروع بالعربية"
                disabled={isSubmitting}
                dir="rtl"
              />
              {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`titleEn-${project.id}`}>عنوان المشروع (بالإنجليزية) *</Label>
              <Input
                id={`titleEn-${project.id}`}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Project title in English"
                disabled={isSubmitting}
                dir="ltr"
              />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`beneficiariesCount-${project.id}`}>عدد المستفيدين المتوقع</Label>
              <Input
                id={`beneficiariesCount-${project.id}`}
                type="number"
                value={beneficiariesCount}
                onChange={(e) => {
                  const val = e.target.value
                  setBeneficiariesCount(val === "" ? "" : Number(val))
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-", "."].includes(e.key)) {
                    e.preventDefault()
                  }
                }}
                placeholder="100"
                disabled={isSubmitting}
                min={1}
              />
              {errors.beneficiariesCount && (
                <span className="text-xs text-destructive">{errors.beneficiariesCount}</span>
              )}
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`descriptionAr-${project.id}`}>وصف المشروع (بالعربية) *</Label>
              <Textarea
                id={`descriptionAr-${project.id}`}
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="وصف المشروع بالعربية..."
                rows={3}
                disabled={isSubmitting}
                dir="rtl"
              />
              {errors.descriptionAr && <span className="text-xs text-destructive">{errors.descriptionAr}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`descriptionEn-${project.id}`}>وصف المشروع (بالإنجليزية) *</Label>
              <Textarea
                id={`descriptionEn-${project.id}`}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Project description in English..."
                rows={3}
                disabled={isSubmitting}
                dir="ltr"
              />
              {errors.descriptionEn && <span className="text-xs text-destructive">{errors.descriptionEn}</span>}
            </div>
          </div>

          {/* Target Amount */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={`targetAmount-${project.id}`}>المبلغ المستهدف (دولار أمريكي) *</Label>
            <Input
              id={`targetAmount-${project.id}`}
              type="number"
              value={targetAmount}
              onChange={(e) => {
                const val = e.target.value
                setTargetAmount(val === "" ? "" : Number(val))
              }}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key)) {
                  e.preventDefault()
                }
              }}
              placeholder="50000"
              disabled={isSubmitting}
              min={1}
            />
            {errors.targetAmount && <span className="text-xs text-destructive">{errors.targetAmount}</span>}
          </div>

          {/* 7 & 8: Category & Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`categoryId-${project.id}`}>فئة المشروع *</Label>
              <Select
                value={categoryId}
                onValueChange={(val) => {
                  if (val) setCategoryId(val)
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`categoryId-${project.id}`}>
                  {/* Base UI renders the raw value here unless we map it, so the
                      trigger would show the ObjectId once categories load after
                      the dialog opens. Resolve the label explicitly. */}
                  <SelectValue>
                    {() => {
                      if (categoryId === UNCATEGORIZED_VALUE) return "بدون فئة (غير مصنّف)"
                      const match = categories.find((c) => c.id === categoryId)
                      if (match) return match.nameAr || match.nameEn || "فئة"
                      if (typeof project.category === "object" && project.category) {
                        return project.category.nameAr || project.category.nameEn || project.categoryName || "الفئة الحالية"
                      }
                      return project.categoryName || "الفئة الحالية"
                    }}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>جاري تحميل الفئات...</SelectItem>
                  ) : (
                    <>
                      {/* The project lost its category when that category was
                          deleted. Showing an explicit option keeps the state
                          visible instead of silently defaulting to a real
                          category (which would overwrite the project). */}
                      <SelectItem value={UNCATEGORIZED_VALUE}>بدون فئة (غير مصنّف)</SelectItem>
                      {/* The project's current category may reference a
                          category not present in the loaded list (e.g. the
                          list is still settling). Render it explicitly so the
                          trigger never falls back to the placeholder and hides
                          the real current category. */}
                      {categoryId !== UNCATEGORIZED_VALUE &&
                        categoryId !== "" &&
                        !categories.some((c) => c.id === categoryId) && (
                          <SelectItem value={categoryId}>
                            {typeof project.category === "object" && project.category
                              ? project.category.nameAr || project.category.nameEn || project.categoryName
                              : project.categoryName || "الفئة الحالية"}
                          </SelectItem>
                        )}
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.nameAr || cat.nameEn || "فئة بدون اسم"}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`status-${project.id}`}>حالة المشروع *</Label>
              <Select
                value={status}
                onValueChange={(val) => {
                  if (val) setStatus(val as "ACTIVE" | "COMPLETED" | "PAUSED")
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`status-${project.id}`}>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">نشط</SelectItem>
                  <SelectItem value="COMPLETED">مكتمل</SelectItem>
                  <SelectItem value="PAUSED">متوقف</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <span className="text-xs text-destructive">{errors.status}</span>}
            </div>
          </div>

          {/* 9: Image File Upload Dropzone */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={`image-${project.id}`}>
              صورة جديدة (اختياري - يترك فارغاً للإبقاء على الصورة الحالية)
            </Label>
            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-5 transition-colors hover:border-primary/50 bg-muted/20">
              <Upload className="mb-2 size-7 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                اضغط لتغيير صورة المشروع
              </p>
              <Input
                id={`image-${project.id}`}
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            {imageFile ? (
              <p className="text-xs font-medium text-primary">
                الملف الجديد: {imageFile.name}
              </p>
            ) : project.image ? (
              <p className="text-xs text-muted-foreground truncate">
                الصورة الحالية: {project.image}
              </p>
            ) : null}
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التعديلات"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
