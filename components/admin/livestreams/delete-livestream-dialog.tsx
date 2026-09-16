"use client"

import * as React from "react"
import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

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

interface DeleteLivestreamDialogProps {
  streamId: string
  streamTitle: string
  onSuccess: (id: string) => void
  trigger?: React.ReactNode
}

export function DeleteLivestreamDialog({
  streamId,
  streamTitle,
  onSuccess,
  trigger,
}: DeleteLivestreamDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      onSuccess(streamId)
      toast.success("تم حذف البث المباشر بنجاح")
      setOpen(false)
      setIsDeleting(false)
    }, 200)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="حذف البث">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">تأكيد حذف البث المباشر</DialogTitle>
          <DialogDescription>
            هل أنت تأكد من رغبتك في حذف البث <strong>"{streamTitle}"</strong>؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="ml-2 size-4 animate-spin" />
                جاري الحذف...
              </>
            ) : (
              "نعم، احذف البث"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
