import { AboutHero } from "@/components/about/about-hero"
import { FoundationInfoCard } from "@/components/about/foundation-info-card"
import { WartimeMission } from "@/components/about/wartime-mission"
import { AboutCta } from "@/components/about/about-cta"

export default function AboutPage() {
  return (
    <main>
      <AboutHero />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <FoundationInfoCard />
      </div>

      <WartimeMission />

      <AboutCta />
    </main>
  )
}
