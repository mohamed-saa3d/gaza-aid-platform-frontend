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

import { projectsService } from "@/services/projects.service"
import type { CategoryId, ProjectStatus } from "@/types/models"

interface CreateProjectDialogProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CreateProjectDialog({ onSuccess, trigger }: CreateProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<CategoryId>("water")
  const [status, setStatus] = useState<ProjectStatus>("ongoing")
  const [target, setTarget] = useState<number | "">("")
  const [location, setLocation] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  const resetForm = () => {
    setTitle("")
    setSlug("")
    setDescription("")
    setCategory("water")
    setStatus("ongoing")
    setTarget("")
    setLocation("")
    setImageFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !slug || !description || !target) {
      toast.error("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setIsSubmitting(true)

    try {
      await projectsService.createProject({
        title,
        slug,
        description,
        category,
        status,
        target: Number(target),
        location,
        image: imageFile,
      })

      toast.success("تم إنشاء المشروع بنجاح!")
      resetForm()
      setOpen(false)

      // Data Refetching: Refresh Next.js server components or trigger callback
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMsg = axiosError?.response?.data?.message || axiosError?.message || "فشل في إنشاء المشروع"
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>إضافة مشروع جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل المشروع الجديد لبدء جمع التبرعات.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">عنوان المشروع *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                  }
                }}
                placeholder="مثال: حفر بئر ماء"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">الرابط المباشر (Slug) *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="well-water-project"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">الوصف *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً مفصلاً للمشروع..."
              rows={3}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">التصنيف</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as CategoryId)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="اختر التصنيف" />
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="status">الحالة</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as ProjectStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">جاري</SelectItem>
                  <SelectItem value="urgent">عاجل</SelectItem>
                  <SelectItem value="completed">مكتمل</SelectItem>
                  <SelectItem value="paused">متوقف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="target">المبلغ المستهدف (ر.س) *</Label>
              <Input
                id="target"
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value ? Number(e.target.value) : "")}
                placeholder="50000"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">الموقع / المنطقة</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثال: غزة - خانيونس"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="image">صورة المشروع (Cloudinary Upload)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
                className="cursor-pointer"
              />
            </div>
            {imageFile && (
              <p className="text-xs text-muted-foreground">
                الملف المحدد: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
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
                  جاري الإضافة...
                </>
              ) : (
                "إضافة المشروع"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
