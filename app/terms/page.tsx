"use client"

import Link from "next/link"
import { useLocale } from "@/components/locale-provider"

export default function TermsPage() {
  const { t } = useLocale()

  const sections = [
    { title: t.termsPage.section1Title, description: t.termsPage.section1Body },
    { title: t.termsPage.section2Title, description: t.termsPage.section2Body },
    { title: t.termsPage.section3Title, description: t.termsPage.section3Body },
    { title: t.termsPage.section4Title, description: t.termsPage.section4Body },
    { title: t.termsPage.section5Title, description: t.termsPage.section5Body },
    { title: t.termsPage.section6Title, description: t.termsPage.section6Body },
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 md:px-6 lg:px-8">
      <div className="rounded-3xl border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-primary">{t.termsPage.badge}</p>
          <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">{t.termsPage.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            {t.termsPage.intro}
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
          <p>{t.termsPage.footnote1}</p>
          <p className="mt-2">{t.termsPage.footnote2}</p>
          <div className="mt-4">
            <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
              {t.termsPage.backHome}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
