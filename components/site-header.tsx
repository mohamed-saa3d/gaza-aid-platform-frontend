"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Heart, Languages, Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useLocale } from "@/components/locale-provider"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const { t, locale, toggleLocale } = useLocale()
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/projects", label: t.nav.projects },
    { href: "/live", label: t.nav.live },
    { href: "/news", label: t.nav.news },
    { href: "/updates", label: t.nav.updates },
    { href: "/donate-no-bank", label: t.nav.noBank },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        {/* Right side (start): logo + avatar */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="الصفحة الرئيسية">
            <Image
              src="/images/logo-mark.png"
              alt="شعار المؤسسة"
              width={36}
              height={36}
              className="size-9 object-contain"
            />
          </Link>
          <Link
            href="/profile"
            className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/70"
            aria-label="الملف الشخصي"
          >
            <User className="size-4" />
          </Link>
        </div>

        {/* Center: nav links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground",
                  active && "bg-secondary text-primary",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Left side (end): locale switcher + CTA */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLocale}
            className="hidden h-10 items-center gap-1.5 rounded-sm sm:flex"
          >
            <Languages className="size-3.5" data-icon="inline-start" />
            {locale === "ar" ? "EN" : "AR"}
          </Button>
          <Button asChild size="sm" className="hidden h-10 rounded-sm px-4 sm:flex">
            <Link href="/donate" className="flex items-center justify-center gap-2">
              <Heart className="size-3.5 shrink-0" data-icon="inline-start" />
              <span>{t.nav.donate}</span>
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="فتح القائمة">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={locale === "ar" ? "left" : "right"} className="w-72">
              <SheetHeader>
                <SheetTitle className="text-start">القائمة</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="التنقل - جوال">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-2 flex flex-col gap-2 px-4">
                <Button variant="outline" onClick={toggleLocale} className="justify-center rounded-sm">
                  <Languages className="size-3.5" data-icon="inline-start" />
                  {locale === "ar" ? "English" : "العربية"}
                </Button>
                <Button asChild className="justify-center rounded-sm">
                  <Link href="/donate" className="flex items-center justify-center gap-2">
                    <Heart className="size-3.5 shrink-0" data-icon="inline-start" />
                    <span>{t.nav.donate}</span>
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
