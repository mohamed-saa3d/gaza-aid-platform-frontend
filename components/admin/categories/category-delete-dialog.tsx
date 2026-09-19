"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Category } from "./types"

interface CategoryDeleteDialogProps {
  category: Category
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string, name: string) => Promise<boolean | void>
}

export function CategoryDeleteDialog({
  category,
  open,
  onOpenChange,
  onConfirm,
}: CategoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await onConfirm(category.id, category.nameAr || category.nameEn)
    setIsDeleting(false)
    if (success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>هل أنت متأكد من حذف هذه الفئة؟</DialogTitle>
          <DialogDescription>
            سيتم حذف الفئة "{category.nameAr || category.nameEn}" نهائياً. لا يمكن التراجع عن هذا الإجراء وقد يؤثر على المشاريع المرتبطة بها.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-start">
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

