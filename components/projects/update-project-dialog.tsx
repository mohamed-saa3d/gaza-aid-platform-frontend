"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import type { Project, CategoryId, ProjectStatus } from "@/types/projects"

interface UpdateProjectDialogProps {
  project: Project
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function UpdateProjectDialog({ project, onSuccess, trigger }: UpdateProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-filled Form State based on existing project data
  const [title, setTitle] = useState(project.title)
  const [slug, setSlug] = useState(project.slug)
  const [description, setDescription] = useState(project.description)
  const [category, setCategory] = useState<CategoryId>(project.category)
  const [status, setStatus] = useState<ProjectStatus>(project.status)
  const [target, setTarget] = useState<number | "">(project.target)
  const [location, setLocation] = useState(project.location || "")
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Sync form state when dialog opens or project updates
  useEffect(() => {
    if (open) {
      setTitle(project.title)
      setSlug(project.slug)
      setDescription(project.description)
      setCategory(project.category)
      setStatus(project.status)
      setTarget(project.target)
      setLocation(project.location || "")
      setImageFile(null)
    }
  }, [open, project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !slug || !description || !target) {
      toast.error("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    setIsSubmitting(true)

    try {
      await projectsService.updateProject(project.id, {
        title,
        slug,
        description,
        category,
        status,
        target: Number(target),
        location,
        image: imageFile,
      })

      toast.success(`تم تحديث المشروع "${title}" بنجاح!`)
      setOpen(false)

      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.message || "فشل في تحديث المشروع"
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المشروع</DialogTitle>
          <DialogDescription>
            تعديل معلومات مشروع <strong>"{project.title}"</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`edit-title-${project.id}`}>عنوان المشروع *</Label>
              <Input
                id={`edit-title-${project.id}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان المشروع"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`edit-slug-${project.id}`}>الرابط المباشر (Slug) *</Label>
              <Input
                id={`edit-slug-${project.id}`}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="project-slug"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`edit-description-${project.id}`}>الوصف *</Label>
            <Textarea
              id={`edit-description-${project.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف المشروع..."
              rows={3}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`edit-category-${project.id}`}>التصنيف</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as CategoryId)}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`edit-category-${project.id}`}>
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
              <Label htmlFor={`edit-status-${project.id}`}>الحالة</Label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as ProjectStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger id={`edit-status-${project.id}`}>
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
              <Label htmlFor={`edit-target-${project.id}`}>المبلغ المستهدف (ر.س) *</Label>
              <Input
                id={`edit-target-${project.id}`}
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
            <Label htmlFor={`edit-location-${project.id}`}>الموقع / المنطقة</Label>
            <Input
              id={`edit-location-${project.id}`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثال: غزة - خانيونس"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`edit-image-${project.id}`}>
              صورة المشروع جديدة (اختياري - يترك فارغاً للإبقاء على الصورة الحالية)
            </Label>
            <Input
              id={`edit-image-${project.id}`}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              disabled={isSubmitting}
              className="cursor-pointer"
            />
            {imageFile ? (
              <p className="text-xs text-muted-foreground">
                الملف الجديد: {imageFile.name}
              </p>
            ) : project.image ? (
              <p className="text-xs text-muted-foreground truncate">
                الصورة الحالية: {project.image}
              </p>
            ) : null}
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

export default UpdateProjectDialog
