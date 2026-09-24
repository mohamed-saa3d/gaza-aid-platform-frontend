"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"

export default function PrivacyPage() {
  const { t } = useLocale()

  const sections = [
    { title: t.privacyPage.section1Title, description: t.privacyPage.section1Body },
    { title: t.privacyPage.section2Title, description: t.privacyPage.section2Body },
    { title: t.privacyPage.section3Title, description: t.privacyPage.section3Body },
    { title: t.privacyPage.section4Title, description: t.privacyPage.section4Body },
    { title: t.privacyPage.section5Title, description: t.privacyPage.section5Body },
    { title: t.privacyPage.section6Title, description: t.privacyPage.section6Body },
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <div className="rounded-3xl border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-primary">{t.privacyPage.badge}</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{t.privacyPage.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {t.privacyPage.intro}
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border-border/80 bg-background/80 p-5">
              <h2 className="mb-2 text-lg font-bold text-foreground">{section.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{section.description}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-secondary/40 p-5 text-sm leading-7 text-muted-foreground">
          <p>{t.privacyPage.footnote1}</p>
          <p className="mt-2">{t.privacyPage.footnote2}</p>
          <div className="mt-4">
            <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
              {t.privacyPage.backHome}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
