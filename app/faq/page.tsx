import { Home, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { FaqAccordion } from "@/components/faq/faq-accordion"

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="size-4" />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft className="size-4 ltr:rotate-180" />
        <span className="font-medium text-foreground">الأسئلة الشائعة</span>
      </nav>

      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold text-balance sm:text-4xl">الأسئلة الشائعة</h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          إجابات على أكثر الأسئلة تكراراً حول التبرع وحسابك ومشاريعنا
        </p>
      </div>

      <FaqAccordion />
    </main>
  )
}
