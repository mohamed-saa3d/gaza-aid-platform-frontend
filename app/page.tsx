import { HeroSection } from "@/components/home/hero-section"
import { CategoryStrip } from "@/components/home/category-strip"
import { StatsBand } from "@/components/home/stats-band"
import { LifeSavingProjects } from "@/components/home/life-saving-projects"
import { WhyChooseUs } from "@/components/home/why-choose-us"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryStrip />
      <StatsBand />
      <LifeSavingProjects />
      <WhyChooseUs />
    </>
  )
}
