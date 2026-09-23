"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuickDonateWidget } from "@/components/home/quick-donate-widget"
import { useLocale } from "@/components/locale-provider"

export function HeroSection() {
  const { t } = useLocale()

  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 md:px-8 lg:grid-cols-[380px_1fr] lg:py-0">
        <div className="order-2 lg:order-1 lg:-my-10">
          <QuickDonateWidget />
        </div>

        <div className="relative order-1 -mx-4 aspect-[4/3] overflow-hidden rounded-3xl lg:order-2 lg:-mx-0 lg:aspect-auto lg:h-[560px] lg:rounded-none">
          <Image
            src="/images/hero-child.png"
            alt={t.hero.imageAlt}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/85 via-primary/30 to-transparent" />

          <div className="absolute inset-x-4 top-4 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground sm:end-4 sm:start-auto sm:mx-0 sm:px-4">
            <MapPin className="size-3.5 shrink-0" />
            {t.hero.locationBadge}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:p-10">
            <h1 className="max-w-lg text-balance font-heading text-3xl font-extrabold leading-tight text-primary-foreground md:text-4xl lg:text-5xl">
              {t.hero.title}
            </h1>
            <p className="max-w-md text-pretty text-sm text-primary-foreground/85 md:text-base">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/donate">
                  <Heart className="size-4" data-icon="inline-start" />
                  {t.hero.donateNow}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link href="/projects">{t.hero.browseProjects}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
