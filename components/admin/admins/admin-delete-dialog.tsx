'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { AdminUser } from './types'

interface AdminDeleteDialogProps {
  admin: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string, name: string) => Promise<boolean | void>
}

export function AdminDeleteDialog({
  admin,
  open,
  onOpenChange,
  onConfirm,
}: AdminDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  if (!admin) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onConfirm(admin.id, admin.name)
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold">تأكيد حذف المدير</DialogTitle>
          <DialogDescription>
            هل أنت تأكد من رغبتك في حذف المدير "{admin.name}" ({admin.email})؟ لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            إلغاء
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
            {isDeleting && <Loader2 className="size-4 animate-spin" />}
            حذف
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
