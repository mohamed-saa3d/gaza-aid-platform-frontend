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
import { deleteNews } from "./api"
import { getErrorMessage } from "@/lib/http"

interface DeleteNewsDialogProps {
  newsId: string
  newsTitle: string
  onSuccess: (id: string) => void
  trigger?: React.ReactNode
}

export function DeleteNewsDialog({
  newsId,
  newsTitle,
  onSuccess,
  trigger,
}: DeleteNewsDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteNews(newsId)
      onSuccess(newsId)
      toast.success("تم حذف الخبر بنجاح")
      setOpen(false)
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل في حذف الخبر")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="حذف الخبر">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">تأكيد حذف الخبر</DialogTitle>
          <DialogDescription>
            هل أنت تأكد من رغبتك في حذف خبر <strong>"{newsTitle}"</strong>؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
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
              "نعم، احذف الخبر"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
