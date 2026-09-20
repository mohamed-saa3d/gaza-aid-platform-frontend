"use client"

import * as React from "react"
import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
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

import { createFaq } from "./api"
import { faqFormSchema } from "./schema"
import type { FAQItemData } from "./types"

interface CreateFaqDialogProps {
  onSuccess?: (newItem: FAQItemData) => void
  trigger?: React.ReactNode
}

export function CreateFaqDialog({ onSuccess, trigger }: CreateFaqDialogProps) {
  const [open, setOpen] = useState(false)
  const [questionAr, setQuestionAr] = useState("")
  const [questionEn, setQuestionEn] = useState("")
  const [answerAr, setAnswerAr] = useState("")
  const [answerEn, setAnswerEn] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    setQuestionAr("")
    setQuestionEn("")
    setAnswerAr("")
    setAnswerEn("")
    setIsActive(true)
    setErrors({})
  }

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
      const response = await createFaq(validation.data)
      if (onSuccess) {
        onSuccess(response.data)
      }
      toast.success("تم إضافة السؤال الشائع بنجاح!")
      resetForm()
      setOpen(false)
    } catch {
      toast.error("فشل إضافة السؤال الشائع")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" aria-label="إضافة سؤال جديد">
            <Plus className="ml-2 size-4" />
            إضافة سؤال جديد
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>إضافة سؤال شائع جديد</DialogTitle>
          <DialogDescription>
            أدخل السؤال وإجابته باللغتين العربية والإنجليزية.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addQuestionAr">السؤال (بالعربية) *</Label>
              <Input
                id="addQuestionAr"
                value={questionAr}
                onChange={(e) => setQuestionAr(e.target.value)}
                placeholder="مثال: كيف يمكنني التبرع للمشاريع؟"
                dir="rtl"
              />
              {errors.questionAr && (
                <span className="text-xs text-destructive">{errors.questionAr}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="addQuestionEn">السؤال (بالإنجليزية) *</Label>
              <Input
                id="addQuestionEn"
                value={questionEn}
                onChange={(e) => setQuestionEn(e.target.value)}
                placeholder="مثال: How can I donate to projects?"
                dir="ltr"
              />
              {errors.questionEn && (
                <span className="text-xs text-destructive">{errors.questionEn}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addAnswerAr">الإجابة (بالعربية) *</Label>
              <Textarea
                id="addAnswerAr"
                value={answerAr}
                onChange={(e) => setAnswerAr(e.target.value)}
                placeholder="تفاصيل الإجابة بالعربية..."
                rows={3}
                dir="rtl"
              />
              {errors.answerAr && (
                <span className="text-xs text-destructive">{errors.answerAr}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="addAnswerEn">الإجابة (بالإنجليزية) *</Label>
              <Textarea
                id="addAnswerEn"
                value={answerEn}
                onChange={(e) => setAnswerEn(e.target.value)}
                placeholder="Answer details in English..."
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
              id="addIsActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(Boolean(checked))}
            />
            <Label htmlFor="addIsActive" className="cursor-pointer font-medium">
              تفعيل السؤال (إظهاره للمستخدمين)
            </Label>
          </div>

          <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="ml-2 size-4 animate-spin" /> : "إضافة السؤال"}
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
