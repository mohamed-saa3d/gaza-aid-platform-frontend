"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Loader2, Pencil } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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

import { livestreamFormSchema, updateLiveStreamSchema } from "./schema"
import type { LivestreamItemData } from "./types"

interface UpdateLivestreamDialogProps {
  stream: LivestreamItemData
  onSuccess: (updatedStream: LivestreamItemData) => void
  trigger?: React.ReactNode
}

export function UpdateLivestreamDialog({
  stream,
  onSuccess,
  trigger,
}: UpdateLivestreamDialogProps) {
  const [open, setOpen] = useState(false)
  const [titleAr, setTitleAr] = useState(stream.titleAr)
  const [titleEn, setTitleEn] = useState(stream.titleEn)
  const [youtubeUrl, setYoutubeUrl] = useState(stream.youtubeUrl)
  const [isActive, setIsActive] = useState(stream.isActive)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTitleAr(stream.titleAr)
      setTitleEn(stream.titleEn)
      setYoutubeUrl(stream.youtubeUrl)
      setIsActive(stream.isActive)
      setErrors({})
    }
  }, [open, stream])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const payload = {
      titleAr,
      titleEn,
      youtubeUrl,
      isActive,
    }

    const validation = livestreamFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للبث المباشر")
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      const updatedStream: LivestreamItemData = {
        ...stream,
        titleAr: validation.data.titleAr,
        titleEn: validation.data.titleEn,
        youtubeUrl: validation.data.youtubeUrl,
        isActive: validation.data.isActive ?? isActive,
      }

      onSuccess(updatedStream)
      toast.success("تم تحديث البث المباشر بنجاح!")
      setOpen(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="تعديل البث">
            <Pencil className="size-4 text-primary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تعديل البث المباشر</DialogTitle>
          <DialogDescription>
            تعديل بيانات البث باللغتين العربية والإنجليزية ورابط YouTube.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="editTitleAr">عنوان البث (بالعربية) *</Label>
            <Input
              id="editTitleAr"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              dir="rtl"
            />
            {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="editTitleEn">عنوان البث (بالإنجليزية) *</Label>
            <Input
              id="editTitleEn"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              dir="ltr"
            />
            {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="editYoutubeUrl">رابط YouTube المباشر *</Label>
            <Input
              id="editYoutubeUrl"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              dir="ltr"
            />
            {errors.youtubeUrl && (
              <span className="text-xs text-destructive">{errors.youtubeUrl}</span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="editIsActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <Label htmlFor="editIsActive" className="cursor-pointer font-medium">
              بث نشط الآن
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
