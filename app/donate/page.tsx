import { HandHeart } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { LocalizedHeading } from "@/components/localized-heading"
import { DonationFlow } from "@/components/donate/donation-flow"

export default function DonatePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumb label="donate" />

      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10">
          <HandHeart className="size-7 text-primary" aria-hidden="true" />
        </div>
        <LocalizedHeading section="pages" titleKey="donateTitle" subtitleKey="donateSubtitle" />
      </div>

      <DonationFlow />
    </main>
  )
}
