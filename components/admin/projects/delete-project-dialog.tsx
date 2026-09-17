"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AxiosError } from "axios"
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
import { deleteProject } from "./api"

interface DeleteProjectDialogProps {
  projectId: string
  projectTitle: string
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function DeleteProjectDialog({
  projectId,
  projectTitle,
  onSuccess,
  trigger,
}: DeleteProjectDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await deleteProject(projectId)
      toast.success(`تم حذف المشروع "${projectTitle}" بنجاح!`)
      setOpen(false)

      // Data Refetching: Refresh Next.js server components or trigger callback
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMsg =
        axiosError?.response?.data?.message || axiosError?.message || "فشل في حذف المشروع"
      toast.error(errorMsg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="حذف المشروع">
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive">تأكيد حذف المشروع</DialogTitle>
          <DialogDescription>
            هل أنت تأكد من رغبتك في حذف مشروع <strong>"{projectTitle}"</strong>؟ هذا الإجراء نهائي ولا يمكن التراجع عنه.
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
              "نعم، احذف المشروع"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
