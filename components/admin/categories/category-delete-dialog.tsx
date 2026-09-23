"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { DeleteOutcome } from "./use-categories"
import type { Category } from "./types"

interface CategoryDeleteDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Performs the delete. Called once without confirmation, and — if the backend
   * answers that the category still owns projects — a second time with
   * `confirmUnassignProjects: true` once the admin acknowledges the warning.
   */
  onConfirm: (
    id: string,
    name: string,
    options?: { confirmUnassignProjects?: boolean },
  ) => Promise<DeleteOutcome>
}

export function CategoryDeleteDialog({
  category,
  open,
  onOpenChange,
  onConfirm,
}: CategoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [linkedProjectCount, setLinkedProjectCount] = useState<number | null>(null)
  const categoryName = category.nameAr || category.nameEn

  // Reset the warning state every time the dialog is opened for a category, so a
  // previous category's count can never leak into this one.
  useEffect(() => {
    if (open) {
      setLinkedProjectCount(null)
      setIsDeleting(false)
    }
  }, [open, category.id])

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const outcome = await onConfirm(category.id, categoryName)

      if (outcome.status === "deleted") {
        onOpenChange(false)
        return
      }

      if (outcome.status === "confirmation_required") {
        setLinkedProjectCount(outcome.warning.data.linkedProjectCount)
      }
      // status === 'error' — the toast is already shown by the hook.
    } finally {
      setIsDeleting(false)
    }
  }

  const handleConfirmedDelete = async () => {
    setIsDeleting(true)
    try {
      const outcome = await onConfirm(category.id, categoryName, {
        confirmUnassignProjects: true,
      })

      if (outcome.status === "deleted") {
        onOpenChange(false)
        return
      }

      if (outcome.status === "confirmation_required") {
        setLinkedProjectCount(outcome.warning.data.linkedProjectCount)
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const requiresWarning = linkedProjectCount !== null && linkedProjectCount > 0

  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>
            {requiresWarning ? "تحذير: الفئة مرتبطة بمشاريع" : "هل أنت متأكد من حذف هذه الفئة؟"}
          </DialogTitle>
          {requiresWarning ? (
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
                <AlertTriangle className="mt-0.5 size-5 shrink-0" />
                <p className="font-medium">
                  الفئة &quot;{categoryName}&quot; مرتبطة بـ {linkedProjectCount} مشروع.
                </p>
              </div>
              <ul className="list-inside list-disc space-y-1">
                <li>لن يتم حذف المشاريع نهائياً.</li>
                <li>سيتم إلغاء ربطها بالفئة لتصبح &quot;غير مصنفة&quot;.</li>
                <li>ستظل جميع المشاريع ظاهرة في صفحة &quot;كل المشاريع&quot;.</li>
                <li>سيتم حذف الفئة &quot;{categoryName}&quot; نفسها.</li>
              </ul>
            </div>
          ) : (
            <DialogDescription>
              سيتم حذف الفئة &quot;{categoryName}&quot; نهائياً. لا توجد مشاريع مرتبطة بها، ولن
              يتأثر أي مشروع بهذا الإجراء.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
          {requiresWarning ? (
            <Button variant="destructive" onClick={handleConfirmedDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "نعم، احذف الفئة وأبقِ المشاريع"
              )}
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

