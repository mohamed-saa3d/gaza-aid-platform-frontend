import Link from "next/link"
import { HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutCta() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h2 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">
        الوقوف إلى جانب المتضررين واجبٌ أخلاقي وإنساني لا يتوقف
      </h2>
      <Button asChild size="lg" className="mt-8 gap-2 rounded-full">
        <Link href="/donate">
          <HandHeart className="size-4" data-icon="inline-start" />
          ساهم معنا الآن
        </Link>
      </Button>
    </section>
  )
}
