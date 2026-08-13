"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLocale } from "@/components/locale-provider"
import { FacebookIcon, InstagramIcon, XIcon, YoutubeIcon } from "@/components/social-icons"

export function SiteFooter() {
  const { t } = useLocale()

  const quickLinks = [
    { href: "/about", label: t.footer.about },
    { href: "/contact", label: t.footer.contact },
    { href: "/projects", label: t.nav.projects },
    { href: "/donate", label: t.nav.noBank },
  ]

  const helpLinks = [
    { href: "/faq", label: t.footer.faq },
    { href: "/privacy", label: t.footer.privacy },
    { href: "/terms", label: t.footer.terms },
  ]

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-mark.png"
                alt="شعار المؤسسة"
                width={28}
                height={28}
                className="size-7 object-contain"
              />
              <span className="font-heading text-lg font-bold">{t.footer.orgName}</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/75">
              مؤسسة خيرية تعمل على تقديم الإغاثة والدعم للمحتاجين في فلسطين وخارجها، وبناء مجتمعات مستدامة.
            </p>
            <div className="flex items-center gap-2">
              {[YoutubeIcon, InstagramIcon, FacebookIcon, XIcon].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
                  aria-label="رابط شبكة اجتماعية"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold">{t.footer.quickLinks}</h3>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/75">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold">{t.footer.contactInfo}</h3>
            <ul className="flex flex-col gap-3 text-sm text-primary-foreground/75">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>info@qudsrelief.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>المملكة العربية السعودية</span>
              </li>
              <li className="pt-1">
                <ul className="flex flex-col gap-2">
                  {helpLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-primary-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-base font-bold">{t.footer.newsletter}</h3>
            <p className="text-sm text-primary-foreground/75">{t.footer.newsletterCopy}</p>
            <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <Button type="submit" size="icon" variant="secondary" className="shrink-0 rounded-full">
                <Send className="size-4" />
              </Button>
              <Input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50"
              />
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60 sm:flex-row">
          <p>
            © 2026 {t.footer.orgName}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3 py-1.5">
            <span>مرخصة من المركز الوطني لتنمية القطاع غير الربحي (رقم 1234)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
