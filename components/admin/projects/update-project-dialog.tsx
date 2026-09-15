"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Loader2, Pencil } from "lucide-react"

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

import { projectsService } from "@/services/projects.service"
import type { Project } from "@/types/models"
import { projectFormSchema } from "@/lib/validations/admin"

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

  // Form State
  const [titleAr, setTitleAr] = useState(project.titleAr || project.title || "")
  const [titleEn, setTitleEn] = useState(project.titleEn || project.title || "")
  const [descriptionAr, setDescriptionAr] = useState(project.descriptionAr || project.description || "")
  const [descriptionEn, setDescriptionEn] = useState(project.descriptionEn || project.description || "")
  const [targetAmount, setTargetAmount] = useState<number | "">(project.targetAmount || project.target || "")
  const [beneficiariesCount, setBeneficiariesCount] = useState<number | "">(
    project.beneficiariesCount ?? project.beneficiaries ?? 0
  )
  const [status, setStatus] = useState<"ACTIVE" | "COMPLETED" | "PAUSED">(
    project.status === "completed" || project.status === "COMPLETED"
      ? "COMPLETED"
      : project.status === "paused" || project.status === "PAUSED"
      ? "PAUSED"
      : "ACTIVE"
  )
  const [categoryId, setCategoryId] = useState<string>(project.categoryId || project.category || "water")
  const [imageUrl, setImageUrl] = useState(project.imageUrl || project.image || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) {
      setTitleAr(project.titleAr || project.title || "")
      setTitleEn(project.titleEn || project.title || "")
      setDescriptionAr(project.descriptionAr || project.description || "")
      setDescriptionEn(project.descriptionEn || project.description || "")
      setTargetAmount(project.targetAmount || project.target || "")
      setBeneficiariesCount(project.beneficiariesCount ?? project.beneficiaries ?? 0)
      setStatus(
        project.status === "completed" || project.status === "COMPLETED"
          ? "COMPLETED"
          : project.status === "paused" || project.status === "PAUSED"
          ? "PAUSED"
          : "ACTIVE"
      )
      setCategoryId(project.categoryId || project.category || "water")
      setImageUrl(project.imageUrl || project.image || "")
      setImageFile(null)
      setErrors({})
    }
  }, [open, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const rawData = {
      titleAr,
      titleEn,
      descriptionAr,
      descriptionEn,
      targetAmount: targetAmount === "" ? 0 : Number(targetAmount),
      beneficiariesCount: beneficiariesCount === "" ? 0 : Number(beneficiariesCount),
      status,
      categoryId,
      imageUrl: imageUrl || undefined,
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
      await projectsService.updateProject(project.id, {
        titleAr: validData.titleAr,
        titleEn: validData.titleEn,
        descriptionAr: validData.descriptionAr,
        descriptionEn: validData.descriptionEn,
        targetAmount: validData.targetAmount,
        beneficiariesCount: validData.beneficiariesCount,
        status: validData.status,
        categoryId: validData.categoryId,
        imageUrl: validData.imageUrl,
        image: imageFile,
        title: validData.titleAr,
        description: validData.descriptionAr,
        target: validData.targetAmount,
      })

      toast.success(`تم تحديث المشروع "${validData.titleAr}" بنجاح!`)
      setOpen(false)

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMsg = axiosError?.response?.data?.message || axiosError?.message || "فشل في تحديث المشروع"
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
          <DialogTitle>تعديل بيانات المشروع (Edit Project)</DialogTitle>
          <DialogDescription>
            تعديل معلومات المشروع بالعربية والإنجليزية.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Bilingual Titles */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <Label htmlFor={`titleEn-${project.id}`}>Project Title (English) *</Label>
              <Input
                id={`titleEn-${project.id}`}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Project Title in English"
                disabled={isSubmitting}
                dir="ltr"
              />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
            </div>
          </div>

          {/* Bilingual Descriptions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`descriptionAr-${project.id}`}>الوصف (بالعربية) *</Label>
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
              <Label htmlFor={`descriptionEn-${project.id}`}>Description (English) *</Label>
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

          {/* Amounts & Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`targetAmount-${project.id}`}>المبلغ المستهدف (Target Amount) *</Label>
              <Input
                id={`targetAmount-${project.id}`}
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value ? Number(e.target.value) : "")}
                placeholder="50000"
                disabled={isSubmitting}
                min={1}
              />
              {errors.targetAmount && <span className="text-xs text-destructive">{errors.targetAmount}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`beneficiariesCount-${project.id}`}>عدد المستفيدين (Beneficiaries Count)</Label>
              <Input
                id={`beneficiariesCount-${project.id}`}
                type="number"
                value={beneficiariesCount}
                onChange={(e) => setBeneficiariesCount(e.target.value ? Number(e.target.value) : 0)}
                placeholder="100"
                disabled={isSubmitting}
                min={0}
              />
              {errors.beneficiariesCount && (
                <span className="text-xs text-destructive">{errors.beneficiariesCount}</span>
              )}
            </div>
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`categoryId-${project.id}`}>فئة المشروع (Category) *</Label>
              <Select
                value={categoryId}
                onValueChange={(val) => {
                  if (val) setCategoryId(val)
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`categoryId-${project.id}`}>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">سقيا ماء (Water)</SelectItem>
                  <SelectItem value="food">سلال غذائية (Food)</SelectItem>
                  <SelectItem value="shelter">إيواء (Shelter)</SelectItem>
                  <SelectItem value="orphans">رعاية أيتام (Orphans)</SelectItem>
                  <SelectItem value="health">صحة (Health)</SelectItem>
                  <SelectItem value="education">تعليم (Education)</SelectItem>
                  <SelectItem value="other">أخرى (Other)</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`status-${project.id}`}>حالة المشروع (Status) *</Label>
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
                  <SelectItem value="ACTIVE">نشط (ACTIVE)</SelectItem>
                  <SelectItem value="COMPLETED">مكتمل (COMPLETED)</SelectItem>
                  <SelectItem value="PAUSED">متوقف (PAUSED)</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <span className="text-xs text-destructive">{errors.status}</span>}
            </div>
          </div>

          {/* Image Upload / URL */}
          <div className="flex flex-col gap-2">
            <Label htmlFor={`imageUrl-${project.id}`}>رابط الصورة (Image URL)</Label>
            <Input
              id={`imageUrl-${project.id}`}
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              disabled={isSubmitting}
              dir="ltr"
            />
            {errors.imageUrl && <span className="text-xs text-destructive">{errors.imageUrl}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`image-${project.id}`}>أو تغيير الصورة عبر الملف (File Upload)</Label>
            <Input
              id={`image-${project.id}`}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={isSubmitting}
              className="cursor-pointer"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
