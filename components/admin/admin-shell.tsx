'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, CircleHelp, FileText, Home, LayoutDashboard, LogOut, Megaphone, Newspaper, Settings, Users, Wallet, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/content', label: 'إدارة المحتوى', icon: FileText },
  { href: '/admin/newsletter', label: 'النشرة البريدية', icon: Newspaper },
  { href: '/admin/notifications', label: 'الإشعارات والتقارير', icon: Bell },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-muted/50 text-foreground">
      <aside className="fixed inset-y-0 right-0 z-20 hidden w-72 border-l bg-card lg:flex lg:flex-col">
        <div className="flex items-center gap-3 border-b px-6 py-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Megaphone /></div>
          <div><p className="font-heading text-lg font-bold text-primary">للأدمن فقط</p><p className="text-xs text-muted-foreground">غير مصرح للجميع</p></div>
        </div>
        <nav aria-label="القائمة الرئيسية" className="flex flex-1 flex-col gap-1 p-4">
          <p className="px-3 pb-2 pt-3 text-xs font-semibold text-muted-foreground">الإدارة</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
            return <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors', active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}><Icon className="size-5" />{label}</Link>
          })}
          <p className="px-3 pb-2 pt-7 text-xs font-semibold text-muted-foreground">أدوات المنصة</p>
          <Link href="/admin/content" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Settings className="size-5" />إعدادات المنصة</Link>
          <Link href="/admin/newsletter" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"><Users className="size-5" />المشتركون</Link>
        </nav>
        <div className="flex flex-col gap-2 border-t p-4"><Link href="#" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted"><CircleHelp className="size-5" />مركز المساعدة</Link><Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted"><LogOut className="size-5" />تسجيل الخروج</Link></div>
      </aside>
      <div className="lg:mr-72">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-card/95 px-5 backdrop-blur md:px-10">
          <div className="flex items-center gap-3"><Avatar className="size-10"><AvatarFallback className="bg-muted text-muted-foreground">أ</AvatarFallback></Avatar><div className="hidden sm:block"><p className="text-sm font-bold">أمن المنصة</p><p className="text-xs text-muted-foreground">مسؤول النظام</p></div><ChevronDown className="size-4 text-muted-foreground" /></div>
          <div className="flex items-center gap-4"><div className="relative"><Bell className="size-5 text-primary" /><Badge className="absolute -right-2 -top-2 size-4 justify-center rounded-full p-0 text-[10px]">4</Badge></div><span className="hidden font-heading text-xl font-bold md:block">لوحة الإدارة</span></div>
        </header>
        <main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main>
      </div>
    </div>
  )
}
