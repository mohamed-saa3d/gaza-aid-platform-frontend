"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, HelpCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { getPublicFaqs } from "@/lib/api/public"
import type { FAQItemData } from "@/components/admin/faqs/types"

export function FaqAccordion() {
  const [faqs, setFaqs] = useState<FAQItemData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  const fetchFaqsList = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPublicFaqs({ limit: 100 })
      const rawData = (response as any)?.data
      const fetched: FAQItemData[] = Array.isArray(rawData?.data)
        ? rawData.data
        : Array.isArray(rawData)
        ? rawData
        : []
      setFaqs(fetched.filter((item) => item.isActive !== false))
    } catch {
      setError("فشل تحميل الأسئلة الشائعة من الخادم.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFaqsList()
  }, [])

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqs

    return faqs.filter(
      (item) =>
        (item.questionAr && item.questionAr.toLowerCase().includes(q)) ||
        (item.questionEn && item.questionEn.toLowerCase().includes(q)) ||
        (item.answerAr && item.answerAr.toLowerCase().includes(q)) ||
        (item.answerEn && item.answerEn.toLowerCase().includes(q))
    )
  }, [query, faqs])

  return (
    <div className="flex flex-col gap-8">
      <div className="relative mx-auto w-full max-w-xl">
        <Search className="absolute inset-y-0 my-auto size-4 text-muted-foreground start-3.5" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن سؤالك..."
          className="h-11 rounded-full ps-10"
          aria-label="البحث في الأسئلة الشائعة"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="size-6 animate-spin text-primary" />
          جاري تحميل الأسئلة الشائعة...
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm font-medium text-destructive">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchFaqsList} className="gap-2">
            <RefreshCw className="size-4" />
            إعادة المحاولة
          </Button>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          {query ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد أسئلة شائعة متاحة حالياً."}
        </p>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HelpCircle className="size-5" aria-hidden="true" />
              </div>
              <CardTitle className="font-heading text-xl">الأسئلة والإجابات العامة</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion>
              {filteredFaqs.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-right text-base font-semibold">
                    {item.questionAr || item.questionEn}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-pretty leading-relaxed text-muted-foreground">
                      {item.answerAr || item.answerEn}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
