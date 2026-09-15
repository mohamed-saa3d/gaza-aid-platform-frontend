"use client"

import * as React from "react"
import { useState } from "react"
import { HelpCircle, Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { faqFormSchema } from "@/lib/validations/admin"

interface FAQItemData {
  id: string
  questionAr: string
  questionEn: string
  answerAr: string
  answerEn: string
  isActive: boolean
  createdAt?: string
}

const initialFaqs: FAQItemData[] = [
  {
    id: "1",
    questionAr: "كيف يمكنني التبرع للمشاريع؟",
    questionEn: "How can I donate to projects?",
    answerAr: "يمكنك التبرع بكل سهولة عبر البطاقات الائتمانية أو التحويل المباشر عن طريق اختيار المشروع ثم إدخال المبلغ.",
    answerEn: "You can donate easily using credit cards or direct transfers by selecting a project and entering the amount.",
    isActive: true,
    createdAt: "2024-05-10",
  },
  {
    id: "2",
    questionAr: "هل التبرع يصل لمستحقيه المباشرين؟",
    questionEn: "Does donation reach direct beneficiaries?",
    answerAr: "نعم، نلتزم بأعلى معايير الشفافية ونرسل تقارير ميدانية دورية لجميع المتبرعين.",
    answerEn: "Yes, we adhere to highest transparency standards and send periodic field reports to all donors.",
    isActive: true,
    createdAt: "2024-05-09",
  },
  {
    id: "3",
    questionAr: "هل يمكنني التبرع بشكل شهري؟",
    questionEn: "Can I donate on a monthly basis?",
    answerAr: "نعم، يوفر النظام خاصية التبرع الدوري الشهري التلقائي لرعاية الأسر والأيتام.",
    answerEn: "Yes, the system provides automatic monthly recurring donations to support families and orphans.",
    isActive: true,
    createdAt: "2024-05-08",
  },
]

export function FaqsSection() {
  const [faqs, setFaqs] = useState<FAQItemData[]>(initialFaqs)
  const [searchQuery, setSearchQuery] = useState("")

  // Add FAQ Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addQuestionAr, setAddQuestionAr] = useState("")
  const [addQuestionEn, setAddQuestionEn] = useState("")
  const [addAnswerAr, setAddAnswerAr] = useState("")
  const [addAnswerEn, setAddAnswerEn] = useState("")
  const [addIsActive, setAddIsActive] = useState(true)
  const [addErrors, setAddErrors] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  // Edit FAQ Dialog State
  const [editingFaq, setEditingFaq] = useState<FAQItemData | null>(null)
  const [editQuestionAr, setEditQuestionAr] = useState("")
  const [editQuestionEn, setEditQuestionEn] = useState("")
  const [editAnswerAr, setEditAnswerAr] = useState("")
  const [editAnswerEn, setEditAnswerEn] = useState("")
  const [editIsActive, setEditIsActive] = useState(true)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  const resetAddForm = () => {
    setAddQuestionAr("")
    setAddQuestionEn("")
    setAddAnswerAr("")
    setAddAnswerEn("")
    setAddIsActive(true)
    setAddErrors({})
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAddErrors({})

    const payload = {
      questionAr: addQuestionAr,
      questionEn: addQuestionEn,
      answerAr: addAnswerAr,
      answerEn: addAnswerEn,
      isActive: addIsActive,
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
      setAddErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للسؤال الشائع")
      return
    }

    setIsAdding(true)
    setTimeout(() => {
      const newItem: FAQItemData = {
        id: Date.now().toString(),
        questionAr: validation.data.questionAr,
        questionEn: validation.data.questionEn,
        answerAr: validation.data.answerAr,
        answerEn: validation.data.answerEn,
        isActive: validation.data.isActive,
        createdAt: new Date().toISOString().split("T")[0],
      }

      setFaqs((prev) => [newItem, ...prev])
      toast.success("تم إضافة السؤال الشائع بنجاح!")
      resetAddForm()
      setIsAddOpen(false)
      setIsAdding(false)
    }, 300)
  }

  const openEditDialog = (faq: FAQItemData) => {
    setEditingFaq(faq)
    setEditQuestionAr(faq.questionAr)
    setEditQuestionEn(faq.questionEn)
    setEditAnswerAr(faq.answerAr)
    setEditAnswerEn(faq.answerEn)
    setEditIsActive(faq.isActive)
    setEditErrors({})
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingFaq) return
    setEditErrors({})

    const payload = {
      questionAr: editQuestionAr,
      questionEn: editQuestionEn,
      answerAr: editAnswerAr,
      answerEn: editAnswerEn,
      isActive: editIsActive,
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
      setEditErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للسؤال الشائع")
      return
    }

    setIsEditing(true)
    setTimeout(() => {
      setFaqs((prev) =>
        prev.map((item) =>
          item.id === editingFaq.id
            ? {
              ...item,
              questionAr: validation.data.questionAr,
              questionEn: validation.data.questionEn,
              answerAr: validation.data.answerAr,
              answerEn: validation.data.answerEn,
              isActive: validation.data.isActive,
            }
            : item
        )
      )
      toast.success("تم تحديث السؤال بنجاح!")
      setEditingFaq(null)
      setIsEditing(false)
    }, 300)
  }

  const handleDelete = (id: string) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id))
    toast.success("تم حذف السؤال بنجاح")
  }

  const filteredFaqs = faqs.filter(
    (item) =>
      item.questionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answerAr.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="text-primary" />
          إدارة الأسئلة الشائعة (يمكنك التعديل فقد في اساله الشفافية والتقارير)
        </CardTitle>

        {/* Add FAQ Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" aria-label="إضافة سؤال جديد">
              <Plus className="ml-2 size-4" />
              إضافة سؤال جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>إضافة سؤال شائع جديد</DialogTitle>
              <DialogDescription>
                أدخل السؤال وإجابته باللغتين العربية والإنجليزية.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="addQuestionAr">السؤال (بالعربية) *</Label>
                  <Input
                    id="addQuestionAr"
                    value={addQuestionAr}
                    onChange={(e) => setAddQuestionAr(e.target.value)}
                    placeholder="مثال: كيف يمكنني التبرع للمشاريع؟"
                    dir="rtl"
                  />
                  {addErrors.questionAr && (
                    <span className="text-xs text-destructive">{addErrors.questionAr}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addQuestionEn">السؤال (بالإنجليزية) *</Label>
                  <Input
                    id="addQuestionEn"
                    value={addQuestionEn}
                    onChange={(e) => setAddQuestionEn(e.target.value)}
                    placeholder="مثال: How can I donate to projects?"
                    dir="ltr"
                  />
                  {addErrors.questionEn && (
                    <span className="text-xs text-destructive">{addErrors.questionEn}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="addAnswerAr">الإجابة (بالعربية) *</Label>
                  <Textarea
                    id="addAnswerAr"
                    value={addAnswerAr}
                    onChange={(e) => setAddAnswerAr(e.target.value)}
                    placeholder="تفاصيل الإجابة بالعربية..."
                    rows={3}
                    dir="rtl"
                  />
                  {addErrors.answerAr && (
                    <span className="text-xs text-destructive">{addErrors.answerAr}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addAnswerEn">الإجابة (بالإنجليزية) *</Label>
                  <Textarea
                    id="addAnswerEn"
                    value={addAnswerEn}
                    onChange={(e) => setAddAnswerEn(e.target.value)}
                    placeholder="Answer details in English..."
                    rows={3}
                    dir="ltr"
                  />
                  {addErrors.answerEn && (
                    <span className="text-xs text-destructive">{addErrors.answerEn}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="addIsActive"
                  checked={addIsActive}
                  onCheckedChange={(checked) => setAddIsActive(Boolean(checked))}
                />
                <Label htmlFor="addIsActive" className="cursor-pointer font-medium">
                  تفعيل السؤال (إظهاره للمستخدمين)
                </Label>
              </div>

              <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? <Loader2 className="ml-2 size-4 animate-spin" /> : "إضافة السؤال"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pr-9"
            placeholder="ابحث عن سؤال شائع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-muted/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground">{faq.questionAr}</h3>
                    {faq.isActive ? (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">
                        مفعل
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">
                        غير مفعل
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground" dir="ltr">
                    {faq.questionEn}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="تعديل السؤال"
                    onClick={() => openEditDialog(faq)}
                  >
                    <Pencil className="size-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="حذف السؤال"
                    onClick={() => handleDelete(faq.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                {faq.answerAr}
              </p>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Edit FAQ Dialog */}
      {editingFaq && (
        <Dialog open={Boolean(editingFaq)} onOpenChange={(open) => !open && setEditingFaq(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>تعديل السؤال الشائع</DialogTitle>
              <DialogDescription>
                تعديل بيانات السؤال والإجابة باللغتين العربية والإنجليزية.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editQuestionAr">السؤال (بالعربية) *</Label>
                  <Input
                    id="editQuestionAr"
                    value={editQuestionAr}
                    onChange={(e) => setEditQuestionAr(e.target.value)}
                    dir="rtl"
                  />
                  {editErrors.questionAr && (
                    <span className="text-xs text-destructive">{editErrors.questionAr}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="editQuestionEn">السؤال (بالإنجليزية) *</Label>
                  <Input
                    id="editQuestionEn"
                    value={editQuestionEn}
                    onChange={(e) => setEditQuestionEn(e.target.value)}
                    dir="ltr"
                  />
                  {editErrors.questionEn && (
                    <span className="text-xs text-destructive">{editErrors.questionEn}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editAnswerAr">الإجابة (بالعربية) *</Label>
                  <Textarea
                    id="editAnswerAr"
                    value={editAnswerAr}
                    onChange={(e) => setEditAnswerAr(e.target.value)}
                    rows={3}
                    dir="rtl"
                  />
                  {editErrors.answerAr && (
                    <span className="text-xs text-destructive">{editErrors.answerAr}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="editAnswerEn">الإجابة (بالإنجليزية) *</Label>
                  <Textarea
                    id="editAnswerEn"
                    value={editAnswerEn}
                    onChange={(e) => setEditAnswerEn(e.target.value)}
                    rows={3}
                    dir="ltr"
                  />
                  {editErrors.answerEn && (
                    <span className="text-xs text-destructive">{editErrors.answerEn}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="editIsActive"
                  checked={editIsActive}
                  onCheckedChange={(checked) => setEditIsActive(Boolean(checked))}
                />
                <Label htmlFor="editIsActive" className="cursor-pointer font-medium">
                  تفعيل السؤال (إظهاره للمستخدمين)
                </Label>
              </div>

              <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
                <Button type="submit" disabled={isEditing}>
                  {isEditing ? <Loader2 className="ml-2 size-4 animate-spin" /> : "حفظ التعديلات"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingFaq(null)}>
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
