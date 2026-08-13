import type { Metadata } from "next"
import { MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfoCards } from "@/components/contact/contact-info-cards"
import { ContactTrustStrip } from "@/components/contact/contact-trust-strip"

export const metadata: Metadata = {
  title: "تواصل معنا | مؤسسة قدس للإغاثة",
  description: "نحن هنا لخدمتك والإجابة على كافة استفساراتك بأسرع وقت ممكن.",
}

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="flex items-center justify-center gap-2 font-heading text-3xl font-bold text-balance sm:text-4xl">
          تواصل معنا
          <MessageCircle className="size-7 text-primary" aria-hidden="true" />
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
          نحن هنا لخدمتك والإجابة على كافة استفساراتك بأسرع وقت ممكن
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <ContactInfoCards />
        <Card className="border-border/60">
          <CardContent className="p-6 sm:p-8">
            <ContactForm />
          </CardContent>
        </Card>
      </div>

      <div className="mt-10">
        <ContactTrustStrip />
      </div>
    </main>
  )
}
