"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { Loader2, Plus, Upload } from "lucide-react"

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

import { createProject } from "./api"
import { createProjectSchema, projectFormSchema } from "./schema"
import { getErrorMessage } from "@/lib/http"

interface CreateProjectDialogProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CreateProjectDialog({ onSuccess, trigger }: CreateProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form State matching exact backend DTO contract
  const [titleAr, setTitleAr] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [descriptionAr, setDescriptionAr] = useState("")
  const [descriptionEn, setDescriptionEn] = useState("")
  const [targetAmount, setTargetAmount] = useState<number | "">("")
  const [beneficiariesCount, setBeneficiariesCount] = useState<number | "">("")
  const [categoryId, setCategoryId] = useState("water")
  const [status, setStatus] = useState<"ACTIVE" | "COMPLETED" | "PAUSED">("ACTIVE")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const resetForm = () => {
    setTitleAr("")
    setTitleEn("")
    setDescriptionAr("")
    setDescriptionEn("")
    setTargetAmount("")
    setBeneficiariesCount("")
    setCategoryId("water")
    setStatus("ACTIVE")
    setImageFile(null)
    setErrors({})
  }

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
      await createProject(
        {
          titleAr: validData.titleAr,
          titleEn: validData.titleEn,
          descriptionAr: validData.descriptionAr,
          descriptionEn: validData.descriptionEn,
          targetAmount: validData.targetAmount,
          beneficiariesCount: validData.beneficiariesCount,
          status: validData.status,
          categoryId: validData.categoryId,
        },
        imageFile || undefined
      )

      toast.success("تم إنشاء المشروع بنجاح!")
      resetForm()
      setOpen(false)

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error) || "فشل في إنشاء المشروع"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="ml-2 size-4" />
            إضافة مشروع جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>إضافة مشروع جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل المشروع بالعربية والإنجليزية لبدء جمع التبرعات.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Top Upper Grid: Titles & Beneficiaries Count */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="titleAr">عنوان المشروع (بالعربية) *</Label>
              <Input
                id="titleAr"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: حفر بئر ماء"
                disabled={isSubmitting}
                dir="rtl"
              />
              {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="titleEn">عنوان المشروع (بالإنجليزية) *</Label>
              <Input
                id="titleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="مثال: Water Well Drilling"
                disabled={isSubmitting}
                dir="ltr"
              />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="beneficiariesCount">عدد المستفيدين المتوقع</Label>
              <Input
                id="beneficiariesCount"
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
              <Label htmlFor="descriptionAr">وصف المشروع (بالعربية) *</Label>
              <Textarea
                id="descriptionAr"
                value={descriptionAr}
                onChange={(e) => setDescriptionAr(e.target.value)}
                placeholder="اكتب وصفاً مفصلاً للمشروع بالعربية..."
                rows={3}
                disabled={isSubmitting}
                dir="rtl"
              />
              {errors.descriptionAr && <span className="text-xs text-destructive">{errors.descriptionAr}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="descriptionEn">وصف المشروع (بالإنجليزية) *</Label>
              <Textarea
                id="descriptionEn"
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="اكتب وصفاً مفصلاً للمشروع بالإنجليزية..."
                rows={3}
                disabled={isSubmitting}
                dir="ltr"
              />
              {errors.descriptionEn && <span className="text-xs text-destructive">{errors.descriptionEn}</span>}
            </div>
          </div>

          {/* Target Amount */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="targetAmount">المبلغ المستهدف (ر.س) *</Label>
            <Input
              id="targetAmount"
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
              <Label htmlFor="categoryId">فئة المشروع *</Label>
              <Select
                value={categoryId}
                onValueChange={(val) => {
                  if (val) setCategoryId(val)
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">سقيا ماء</SelectItem>
                  <SelectItem value="food">سلال غذائية</SelectItem>
                  <SelectItem value="shelter">إيواء</SelectItem>
                  <SelectItem value="orphans">رعاية أيتام</SelectItem>
                  <SelectItem value="health">صحة</SelectItem>
                  <SelectItem value="education">تعليم</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
              {errors.categoryId && <span className="text-xs text-destructive">{errors.categoryId}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">حالة المشروع *</Label>
              <Select
                value={status}
                onValueChange={(val) => {
                  if (val) setStatus(val as "ACTIVE" | "COMPLETED" | "PAUSED")
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger id="status">
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

          {/* 9: Image File Upload Dropzone Only */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="image">صورة المشروع الرئيسية *</Label>
            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-primary/50 bg-muted/20">
              <Upload className="mb-2 size-8 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                اضغط هنا لاختيار صورة من جهازك
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                PNG, JPG, WEBP حتى 5 ميجابايت
              </p>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            {imageFile && (
              <p className="text-xs font-medium text-primary">
                تم تحديد الصورة: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} ك.ب)
              </p>
            )}
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة المشروع"
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
