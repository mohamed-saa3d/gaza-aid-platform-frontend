"use client"

import Image from "next/image"
import { useLocale } from "@/components/locale-provider"

export function AboutHero() {
  const { t } = useLocale()

  return (
    <section className="relative flex h-[420px] items-end justify-center overflow-hidden sm:h-[480px]">
      <Image
        src="/images/about-hero.png"
        alt={t.about.heroImageAlt}
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center gap-4 px-4 pb-10 text-center">
        <h1 className="font-heading text-4xl font-bold text-balance text-white drop-shadow sm:text-5xl">
          {t.about.pageTitle}
        </h1>
        <p className="rounded-full bg-black/60 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm sm:text-base">
          {t.about.heroSubtitle}
        </p>
      </div>
    </section>
  )
}
