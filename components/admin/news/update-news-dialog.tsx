"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Loader2, Upload, Pencil } from "lucide-react"
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

import { newsFormSchema, updateNewsSchema } from "./schema"
import type { NewsItemData } from "./types"

interface UpdateNewsDialogProps {
  item: NewsItemData
  onSuccess: (updatedItem: NewsItemData) => void
  trigger?: React.ReactNode
}

export function UpdateNewsDialog({ item, onSuccess, trigger }: UpdateNewsDialogProps) {
  const [open, setOpen] = useState(false)
  const [titleAr, setTitleAr] = useState(item.titleAr)
  const [titleEn, setTitleEn] = useState(item.titleEn)
  const [descAr, setDescAr] = useState(item.descriptionAr)
  const [descEn, setDescEn] = useState(item.descriptionEn)
  const [detailsUrl, setDetailsUrl] = useState(item.detailsUrl || "")
  const [isUrgent, setIsUrgent] = useState(item.isUrgent)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTitleAr(item.titleAr)
      setTitleEn(item.titleEn)
      setDescAr(item.descriptionAr)
      setDescEn(item.descriptionEn)
      setDetailsUrl(item.detailsUrl || "")
      setIsUrgent(item.isUrgent)
      setImageFile(null)
      setErrors({})
    }
  }, [open, item])

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
      const updatedItem: NewsItemData = {
        ...item,
        titleAr: validation.data.titleAr,
        titleEn: validation.data.titleEn,
        descriptionAr: validation.data.descriptionAr,
        descriptionEn: validation.data.descriptionEn,
        detailsUrl: validation.data.detailsUrl || "",
        isUrgent: validation.data.isUrgent ?? isUrgent,
        imageUrl: imageFile ? URL.createObjectURL(imageFile) : item.imageUrl,
      }

      onSuccess(updatedItem)
      toast.success("تم تحديث الخبر بنجاح!")
      setOpen(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="تعديل الخبر">
            <Pencil className="size-4 text-primary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الخبر</DialogTitle>
          <DialogDescription>
            تعديل بيانات الخبر باللغتين العربية والإنجليزية.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editTitleAr">عنوان الخبر (بالعربية) *</Label>
              <Input
                id="editTitleAr"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                dir="rtl"
              />
              {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr}</span>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editTitleEn">عنوان الخبر (بالإنجليزية) *</Label>
              <Input
                id="editTitleEn"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                dir="ltr"
              />
              {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editDescAr">تفاصيل الخبر (بالعربية) *</Label>
              <Textarea
                id="editDescAr"
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                rows={3}
                dir="rtl"
              />
              {errors.descriptionAr && (
                <span className="text-xs text-destructive">{errors.descriptionAr}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editDescEn">تفاصيل الخبر (بالإنجليزية) *</Label>
              <Textarea
                id="editDescEn"
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                rows={3}
                dir="ltr"
              />
              {errors.descriptionEn && (
                <span className="text-xs text-destructive">{errors.descriptionEn}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="editDetailsUrl">رابط تفاصيل الخبر المباشر</Label>
            <Input
              id="editDetailsUrl"
              type="url"
              value={detailsUrl}
              onChange={(e) => setDetailsUrl(e.target.value)}
              dir="ltr"
            />
            {errors.detailsUrl && (
              <span className="text-xs text-destructive">{errors.detailsUrl}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="editImageFile">تغيير صورة الخبر (اختياري)</Label>
            <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-5 transition-colors hover:border-primary/50 bg-muted/20">
              <Upload className="mb-2 size-7 text-muted-foreground" />
              <p className="text-xs font-medium text-foreground">
                اضغط لتغيير الصورة
              </p>
              <Input
                id="editImageFile"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
            {imageFile && (
              <p className="text-xs font-medium text-primary">
                الملف الجديد: {imageFile.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="editIsUrgent"
              checked={isUrgent}
              onCheckedChange={(checked) => setIsUrgent(Boolean(checked))}
            />
            <Label htmlFor="editIsUrgent" className="cursor-pointer font-medium">
              تعيين كخبر عاجل
            </Label>
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="ml-2 size-4 animate-spin" /> : "حفظ التعديلات"}
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
