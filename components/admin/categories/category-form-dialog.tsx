"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Loader2, Plus, Edit } from "lucide-react"

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

import { categoryFormSchema, type CategoryFormInput } from "./schema"
import type { Category } from "./types"
import { useCategories } from "./use-categories"
import { toast } from "sonner"

interface CategoryFormDialogProps {
  category?: Category | null
  onSuccess?: () => void
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CategoryFormDialog({ category, onSuccess, trigger, open: externalOpen, onOpenChange }: CategoryFormDialogProps) {
  const isEdit = !!category
  const [internalOpen, setInternalOpen] = useState(false)
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { createCategory, editCategory } = useCategories()

  const [nameAr, setNameAr] = useState(category?.nameAr || "")
  const [nameEn, setNameEn] = useState(category?.nameEn || "")
  const [descriptionAr, setDescriptionAr] = useState(category?.descriptionAr || "")
  const [descriptionEn, setDescriptionEn] = useState(category?.descriptionEn || "")

  useEffect(() => {
    if (category) {
      setNameAr(category.nameAr || "")
      setNameEn(category.nameEn || "")
      setDescriptionAr(category.descriptionAr || "")
      setDescriptionEn(category.descriptionEn || "")
    } else {
      setNameAr("")
      setNameEn("")
      setDescriptionAr("")
      setDescriptionEn("")
    }
    setErrors({})
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const rawData = { nameAr, nameEn, descriptionAr, descriptionEn }
    const validationResult = categoryFormSchema.safeParse(rawData)

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
    let success = false

    if (isEdit && category) {
      success = await editCategory(category.id, validationResult.data)
    } else {
      success = await createCategory(validationResult.data)
    }

    setIsSubmitting(false)

    if (success) {
      setOpen(false)
      if (onSuccess) onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!externalOpen && (
        <DialogTrigger asChild>
          {trigger || (
            <Button variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"}>
              {isEdit ? <Edit className="ml-2 size-4" /> : <Plus className="ml-2 size-4" />}
              {isEdit ? "تعديل" : "إضافة فئة"}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "قم بتعديل بيانات الفئة الحالية" : "أدخل بيانات الفئة الجديدة للظهور في المنصة."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nameAr">الاسم (بالعربية) *</Label>
            <Input
              id="nameAr"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              placeholder="مثال: سقيا ماء"
              disabled={isSubmitting}
              dir="rtl"
            />
            {errors.nameAr && <span className="text-xs text-destructive">{errors.nameAr}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="nameEn">الاسم (بالإنجليزية) *</Label>
            <Input
              id="nameEn"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="مثال: Water Provision"
              disabled={isSubmitting}
              dir="ltr"
            />
            {errors.nameEn && <span className="text-xs text-destructive">{errors.nameEn}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descriptionAr">الوصف (بالعربية)</Label>
            <Textarea
              id="descriptionAr"
              value={descriptionAr}
              onChange={(e) => setDescriptionAr(e.target.value)}
              placeholder="وصف الفئة بالعربية..."
              disabled={isSubmitting}
              dir="rtl"
            />
            {errors.descriptionAr && <span className="text-xs text-destructive">{errors.descriptionAr}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descriptionEn">الوصف (بالإنجليزية)</Label>
            <Textarea
              id="descriptionEn"
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Category description..."
              disabled={isSubmitting}
              dir="ltr"
            />
            {errors.descriptionEn && <span className="text-xs text-destructive">{errors.descriptionEn}</span>}
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ الفئة"
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
