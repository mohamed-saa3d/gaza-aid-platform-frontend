"use client"

import * as React from "react"
import { useState } from "react"
import { Loader2, Plus, Upload } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { createNewsSchema, newsFormSchema } from "./schema"
import type { NewsItemData } from "./types"

interface CreateNewsDialogProps {
  onSuccess?: (newItem: NewsItemData) => void
  trigger?: React.ReactNode
}

export function CreateNewsDialog({ onSuccess, trigger }: CreateNewsDialogProps) {
  const [open, setOpen] = useState(false)
  const [titleAr, setTitleAr] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [descAr, setDescAr] = useState("")
  const [descEn, setDescEn] = useState("")
  const [detailsUrl, setDetailsUrl] = useState("")
  const [isUrgent, setIsUrgent] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setTitleAr("")
    setTitleEn("")
    setDescAr("")
    setDescEn("")
    setDetailsUrl("")
    setIsUrgent(false)
    setImageFile(null)
    setErrors({})
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const payload = {
      titleAr,
      titleEn,
      descriptionAr: descAr,
      descriptionEn: descEn,
      detailsUrl: detailsUrl || undefined,
      isUrgent,
      imageUrl: "",
    }

    const validation = newsFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للخبر")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const newItem: NewsItemData = {
        id: Date.now().toString(),
        titleAr: validation.data.titleAr,
        titleEn: validation.data.titleEn,
        descriptionAr: validation.data.descriptionAr,
        descriptionEn: validation.data.descriptionEn,
        detailsUrl: validation.data.detailsUrl || "",
        isUrgent: validation.data.isUrgent ?? false,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : "/images/news-food-distribution.png",
      }

      if (onSuccess) {
        onSuccess(newItem)
      }
      toast.success("تم إضافة الخبر بنجاح!")
      resetForm()
      setOpen(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" aria-label="إضافة خبر جديد">
            <Plus className="ml-2 size-4" />
            إضافة خبر جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>إضافة خبر جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الخبر باللغتين العربية والإنجليزية.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addTitleAr">عنوان الخبر (بالعربية) *</Label>
              <Input
                id="addTitleAr"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="عنوان الخبر بالعربية..."
                dir="rtl"
              />
              {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="addTitleEn">عنوان الخبر (بالإنجليزية) *</Label>
              <Input
                id="addTitleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="عنوان الخبر بالإنجليزية..."
                dir="ltr"
              />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addDescAr">تفاصيل الخبر (بالعربية) *</Label>
              <Textarea
                id="addDescAr"
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="تفاصيل الخبر بالعربية..."
                rows={3}
                dir="rtl"
              />
              {errors.descriptionAr && (
                <span className="text-xs text-destructive">{errors.descriptionAr}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="addDescEn">تفاصيل الخبر (بالإنجليزية) *</Label>
              <Textarea
                id="addDescEn"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                placeholder="تفاصيل الخبر بالإنجليزية..."
                rows={3}
                dir="ltr"
              />
              {errors.descriptionEn && (
                <span className="text-xs text-destructive">{errors.descriptionEn}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="addDetailsUrl">رابط تفاصيل الخبر المباشر</Label>
            <Input
              id="addDetailsUrl"
              type="url"
              value={detailsUrl}
              onChange={(e) => setDetailsUrl(e.target.value)}
              placeholder="https://example.com/news/1"
              dir="ltr"
            />
            {errors.detailsUrl && (
              <span className="text-xs text-destructive">{errors.detailsUrl}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="addImageFile">صورة الخبر الرئيسية</Label>
            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-5 transition-colors hover:border-primary/50 bg-muted/20">
              <Upload className="mb-2 size-7 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                اضغط هنا لاختيار صورة الخبر
              </p>
              <Input
                id="addImageFile"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            {imageFile && (
              <p className="text-xs font-medium text-primary">
                تم تحديد الملف: {imageFile.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="addIsUrgent"
              checked={isUrgent}
              onCheckedChange={(checked) => setIsUrgent(Boolean(checked))}
            />
            <Label htmlFor="addIsUrgent" className="cursor-pointer font-medium">
              تعيين كخبر عاجل
            </Label>
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="ml-2 size-4 animate-spin" /> : "إضافة الخبر"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
