"use client"

import * as React from "react"
import { useCallback, useEffect, useState } from "react"
import { AlertCircle, HelpCircle, Loader2, RefreshCw, Search } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { CreateFaqDialog } from "./create-faq-dialog"
import { UpdateFaqDialog } from "./update-faq-dialog"
import { DeleteFaqDialog } from "./delete-faq-dialog"
import { getFaqs } from "./api"
import type { FAQItemData } from "./types"
export type { FAQItemData }

export function FaqsSection() {
  const [faqs, setFaqs] = useState<FAQItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchFaqs = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getFaqs()
      setFaqs(Array.isArray(response.data?.data) ? response.data.data : [])
    } catch {
      setError("فشل تحميل الأسئلة الشائعة من الخادم.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

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
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              جاري تحميل الأسئلة...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center">
              <AlertCircle className="size-6 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchFaqs}>
                <RefreshCw className="ml-2 size-3" />
                إعادة المحاولة
              </Button>
            </div>
          ) : null}

          {!loading && !error && filteredFaqs.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              لا توجد أسئلة شائعة مطابقة.
            </div>
          ) : null}

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
