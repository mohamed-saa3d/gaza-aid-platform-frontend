"use client"

import * as React from "react"
import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
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

import { livestreamFormSchema } from "@/lib/validations/admin"
import type { LivestreamItemData } from "./types"

interface CreateLivestreamDialogProps {
  onSuccess?: (newItem: LivestreamItemData) => void
  trigger?: React.ReactNode
}

export function CreateLivestreamDialog({ onSuccess, trigger }: CreateLivestreamDialogProps) {
  const [open, setOpen] = useState(false)
  const [titleAr, setTitleAr] = useState("")
  const [titleEn, setTitleEn] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setTitleAr("")
    setTitleEn("")
    setYoutubeUrl("")
    setIsActive(true)
    setErrors({})
  }

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
      const newItem: LivestreamItemData = {
        id: Date.now().toString(),
        titleAr: validation.data.titleAr,
        titleEn: validation.data.titleEn,
        youtubeUrl: validation.data.youtubeUrl,
        isActive: validation.data.isActive,
      }

      if (onSuccess) {
        onSuccess(newItem)
      }
      toast.success("تم إضافة البث المباشر بنجاح!")
      resetForm()
      setOpen(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" aria-label="إضافة بث جديد">
            <Plus className="ml-2 size-4" />
            إضافة بث جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة بث مباشر جديد</DialogTitle>
          <DialogDescription>
            أدخل عنوان البث باللغتين العربية والإنجليزية ورابط YouTube.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="addTitleAr">عنوان البث (بالعربية) *</Label>
            <Input
              id="addTitleAr"
              value={titleAr}
              onChange={(e) => setTitleAr(e.target.value)}
              placeholder="عنوان البث بالعربية..."
              dir="rtl"
            />
            {errors.titleAr && <span className="text-xs text-destructive">{errors.titleAr}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="addTitleEn">عنوان البث (بالإنجليزية) *</Label>
            <Input
              id="addTitleEn"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="عنوان البث بالإنجليزية..."
              dir="ltr"
            />
            {errors.titleEn && <span className="text-xs text-destructive">{errors.titleEn}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="addYoutubeUrl">رابط YouTube المباشر *</Label>
            <Input
              id="addYoutubeUrl"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              dir="ltr"
            />
            {errors.youtubeUrl && (
              <span className="text-xs text-destructive">{errors.youtubeUrl}</span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="addIsActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <Label htmlFor="addIsActive" className="cursor-pointer font-medium">
              بث نشط الآن
            </Label>
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="ml-2 size-4 animate-spin" /> : "إضافة البث"}
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
