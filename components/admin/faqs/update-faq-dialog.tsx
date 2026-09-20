"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Loader2, Pencil } from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

import { updateFaq } from "./api"
import { faqFormSchema } from "./schema"
import type { FAQItemData } from "./types"

interface UpdateFaqDialogProps {
  faq: FAQItemData
  onSuccess: (updatedFaq: FAQItemData) => void
  trigger?: React.ReactNode
}

export function UpdateFaqDialog({ faq, onSuccess, trigger }: UpdateFaqDialogProps) {
  const [open, setOpen] = useState(false)
  const [questionAr, setQuestionAr] = useState(faq.questionAr)
  const [questionEn, setQuestionEn] = useState(faq.questionEn)
  const [answerAr, setAnswerAr] = useState(faq.answerAr)
  const [answerEn, setAnswerEn] = useState(faq.answerEn)
  const [isActive, setIsActive] = useState(faq.isActive)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setQuestionAr(faq.questionAr)
      setQuestionEn(faq.questionEn)
      setAnswerAr(faq.answerAr)
      setAnswerEn(faq.answerEn)
      setIsActive(faq.isActive)
      setErrors({})
    }
  }, [open, faq])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const payload = {
      questionAr,
      questionEn,
      answerAr,
      answerEn,
      isActive,
    }

    const validation = faqFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للسؤال الشائع")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await updateFaq(faq.id, validation.data)
      onSuccess(response.data)
      toast.success("تم تحديث السؤال بنجاح!")
      setOpen(false)
    } catch {
      toast.error("فشل تحديث السؤال")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon-sm" aria-label="تعديل السؤال">
            <Pencil className="size-4 text-primary" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>تعديل السؤال الشائع</DialogTitle>
          <DialogDescription>
            تعديل بيانات السؤال والإجابة باللغتين العربية والإنجليزية.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editQuestionAr">السؤال (بالعربية) *</Label>
              <Input
                id="editQuestionAr"
                value={questionAr}
                onChange={(e) => setQuestionAr(e.target.value)}
                dir="rtl"
              />
              {errors.questionAr && (
                <span className="text-xs text-destructive">{errors.questionAr}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editQuestionEn">السؤال (بالإنجليزية) *</Label>
              <Input
                id="editQuestionEn"
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                dir="ltr"
              />
              {errors.questionEn && (
                <span className="text-xs text-destructive">{errors.questionEn}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="editAnswerAr">الإجابة (بالعربية) *</Label>
              <Textarea
                id="editAnswerAr"
                value={answerAr}
                onChange={(e) => setAnswerAr(e.target.value)}
                rows={3}
                dir="rtl"
              />
              {errors.answerAr && (
                <span className="text-xs text-destructive">{errors.answerAr}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="editAnswerEn">الإجابة (بالإنجليزية) *</Label>
              <Textarea
                id="editAnswerEn"
                value={answerEn}
                onChange={(e) => setAnswerEn(e.target.value)}
                rows={3}
                dir="ltr"
              />
              {errors.answerEn && (
                <span className="text-xs text-destructive">{errors.answerEn}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              id="editIsActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <Label htmlFor="editIsActive" className="cursor-pointer font-medium">
              تفعيل السؤال (إظهاره للمستخدمين)
            </Label>
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="ml-2 size-4 animate-spin" /> : "حفظ التعديلات"}
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
