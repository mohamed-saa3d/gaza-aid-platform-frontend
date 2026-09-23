import { Breadcrumb } from "@/components/breadcrumb"
import { LocalizedHeading } from "@/components/localized-heading"
import { FaqAccordion } from "@/components/faq/faq-accordion"

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb label="faq" />

      <LocalizedHeading section="pages" titleKey="faqTitle" subtitleKey="faqSubtitle" />

      <FaqAccordion />
    </main>
  )
}
