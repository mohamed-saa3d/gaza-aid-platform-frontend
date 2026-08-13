import { HandHeart } from "lucide-react"
import { DonationFlow } from "@/components/donate/donation-flow"

export default function DonatePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <HandHeart className="size-7 text-primary" aria-hidden="true" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-balance sm:text-4xl">تبرع بدون حساب بنكي</h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          أكمل خطوات التبرع في دقيقة واحدة، وساهم في إحداث فرق حقيقي في حياة المحتاجين.
        </p>
      </div>

      <DonationFlow />
    </main>
  )
}
