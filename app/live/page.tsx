import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { VideoOff } from "lucide-react"

export const metadata: Metadata = {
  title: "بث مباشر | مؤسسة قدس للإغاثة",
  description: "تابع البث المباشر لفعاليات وتحديثات مشاريع مؤسسة قدس للإغاثة.",
}

export default function LivePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <VideoOff className="size-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">لا يوجد بث مباشر حالياً</h1>
        <p className="max-w-md text-balance text-muted-foreground">
          نحن لا نقوم بأي بث مباشر في الوقت الحالي. يرجى متابعة صفحاتنا على وسائل التواصل الاجتماعي لمعرفة مواعيد البث القادمة.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/">العودة إلى الرئيسية</Link>
        </Button>
      </div>
    </main>
  )
}
