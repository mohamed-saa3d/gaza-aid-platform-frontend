"use client"

import Link from "next/link"
import { HandHeart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/components/locale-provider"

export function AboutCta() {
  const { t } = useLocale()

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <h2 className="font-heading text-2xl font-bold text-balance text-foreground sm:text-3xl">
        {t.about.ctaHeading}
      </h2>
      <Button asChild size="lg" className="mt-8 gap-2 rounded-full">
        <Link href="/donate">
          <HandHeart className="size-4" data-icon="inline-start" />
          {t.about.ctaButton}
        </Link>
      </Button>
    </section>
  )
}
