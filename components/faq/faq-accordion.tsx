"use client"

import { useMemo, useState } from "react"
import { Search, HandCoins, ShieldCheck, UserRound, BarChart3, type LucideIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { faqCategories } from "@/lib/mock-data"

const iconMap: Record<string, LucideIcon> = {
  donations: HandCoins,
  transparency: BarChart3,
  account: UserRound,
  security: ShieldCheck,
}

export function FaqAccordion() {
  const [query, setQuery] = useState("")

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqCategories

    return faqCategories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q),
        ),
      }))
      .filter((category) => category.items.length > 0)
  }, [query])

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

      {filteredCategories.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد نتائج مطابقة لبحثك.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCategories.map((category) => {
            const Icon = iconMap[category.id] ?? HandCoins
            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <CardTitle className="font-heading text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion>
                    {category.items.map((item, i) => (
                      <AccordionItem key={i} value={`${category.id}-${i}`}>
                        <AccordionTrigger>{item.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-pretty leading-relaxed text-muted-foreground">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
