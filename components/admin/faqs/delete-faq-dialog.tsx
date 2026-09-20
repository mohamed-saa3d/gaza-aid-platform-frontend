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
import { deleteFaq } from "./api"

interface DeleteFaqDialogProps {
  faqId: string
  faqQuestion: string
  onSuccess: (id: string) => void
  trigger?: React.ReactNode
}

export function DeleteFaqDialog({
  faqId,
  faqQuestion,
  onSuccess,
  trigger,
}: DeleteFaqDialogProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteFaq(faqId)
      onSuccess(faqId)
      toast.success("تم حذف السؤال بنجاح")
      setOpen(false)
    } catch {
      toast.error("فشل حذف السؤال")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="حذف السؤال">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">تأكيد حذف السؤال الشائع</DialogTitle>
          <DialogDescription>
            هل أنت تأكد من رغبتك في حذف السؤال <strong>"{faqQuestion}"</strong>؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
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
              "نعم، احذف السؤال"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
