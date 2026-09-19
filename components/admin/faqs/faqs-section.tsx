"use client"

import * as React from "react"
import { useState } from "react"
import { HelpCircle, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import { CreateFaqDialog } from "./create-faq-dialog"
import { UpdateFaqDialog } from "./update-faq-dialog"
import { DeleteFaqDialog } from "./delete-faq-dialog"
import type { FAQItemData } from "./types"
export type { FAQItemData }


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

  const handleAddSuccess = (newItem: FAQItemData) => {
    setFaqs((prev) => [newItem, ...prev])
  }

  const handleUpdateSuccess = (updatedFaq: FAQItemData) => {
    setFaqs((prev) =>
      prev.map((item) => (item.id === updatedFaq.id ? updatedFaq : item))
    )
  }

  const handleDeleteSuccess = (id: string) => {
    setFaqs((prev) => prev.filter((item) => item.id !== id))
  }

  const safeFaqs = Array.isArray(faqs) ? faqs : [];
  const filteredFaqs = safeFaqs.filter(
    (item) =>
      item.questionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answerAr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="text-primary" />
          إدارة الأسئلة الشائعة (يمكنك التعديل فقد في اساله الشفافية والتقارير)
        </CardTitle>

        <CreateFaqDialog onSuccess={handleAddSuccess} />
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
                  <UpdateFaqDialog faq={faq} onSuccess={handleUpdateSuccess} />
                  <DeleteFaqDialog
                    faqId={faq.id}
                    faqQuestion={faq.questionAr}
                    onSuccess={handleDeleteSuccess}
                  />
                </div>
              </div>

              <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                {faq.answerAr}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
