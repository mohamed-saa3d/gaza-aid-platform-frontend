import type { Metadata } from "next"
import { MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { LocalizedHeading } from "@/components/localized-heading"
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
      <Breadcrumb label="contact" />

      <LocalizedHeading section="contact" titleKey="title" subtitleKey="subtitle" icon={<MessageCircle className="size-7 text-primary" aria-hidden="true" />} />

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
