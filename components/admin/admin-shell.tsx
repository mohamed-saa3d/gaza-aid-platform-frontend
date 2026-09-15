  'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  CircleHelp,
  FileText,
  LogOut,
  Megaphone,
  Newspaper,
  Users,
  Menu,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet'
import { useState } from 'react'

const navItems = [
  { href: '/admin/content', label: 'إدارة المحتوى', icon: FileText },
  { href: '/admin/newsletter', label: 'النشرة البريدية', icon: Newspaper },
  { href: '/admin/notifications', label: 'الإشعارات والتقارير', icon: Bell },
  { href: '/admin/admins', label: 'إدارة المديرين', icon: Users },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  const NavList = (
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = href === '/admin' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className='size-5' />
            {label}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className='min-h-screen bg-muted/50 text-foreground'>
      {/* Mobile Sheet navigation */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            className='fixed top-4 end-4 z-30 flex size-10 items-center justify-center rounded-full bg-card lg:hidden'
            aria-label='فتح قائمة الإدارة'
          >
            <Menu className='size-6' />
          </button>
        </SheetTrigger>
        <SheetContent side='right' className='w-72 bg-card p-4'>
          <nav className='flex flex-col gap-1'>{NavList}</nav>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar – RTL aware */}
      <aside className='fixed inset-y-0 start-0 z-20 hidden w-72 border-r bg-card lg:flex lg:flex-col'>
        <div className='flex items-center gap-3 border-b px-6 py-6'>
          <div className='flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary'>
            <Megaphone />
          </div>
          <div>
            <p className='font-heading text-lg font-bold text-primary'>للأدمن فقط</p>
            <p className='text-xs text-muted-foreground'>غير مصرح للجميع</p>
          </div>
        </div>
        <nav aria-label='القائمة الرئيسية' className='flex flex-1 flex-col gap-1 p-4'>
          {NavList}
        </nav>
        <div className='flex flex-col gap-2 border-t p-4'>
          <a
            href={`https://wa.me/201092731005?text=${encodeURIComponent("السلام عليكم عندي استفسار بخصوص لوحات التحكم او غيره الخاصه بمشروع غزه")}`}
            target="_blank"
            rel="noopener noreferrer"
            className='flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted'
          >
            <CircleHelp className='size-5' /> مركز المساعدة
          </a>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted-foreground hover:bg-muted'
          >
            <LogOut className='size-5' /> تسجيل الخروج
          </Link>
        </div>
      </aside>

      {/* Main content – logical margin‑start */}
      <div className='lg:ms-72'>
        <header className='sticky top-0 z-10 flex h-20 items-center justify-between border-b bg-card/95 px-5 backdrop-blur md:px-10'>
          <div className='flex items-center gap-3'>
            <Avatar className='size-10'>
              <AvatarFallback className='bg-muted text-muted-foreground'>أ</AvatarFallback>
            </Avatar>
            <div className='hidden sm:block'>
              <p className='text-sm font-bold'>أمن المنصة</p>
              <p className='text-xs text-muted-foreground'>مسؤول النظام</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <span className='font-heading text-lg font-bold sm:text-xl'>لوحة الإدارة</span>
            <Link href='/admin/notifications' className='relative'>
              <Bell className='size-5 text-primary' />
              <Badge className='absolute -end-2 -top-2 size-4 justify-center rounded-full p-0 text-[10px]'>4</Badge>
            </Link>
          </div>
        </header>
        <main className='mx-auto max-w-7xl p-5 md:p-8'>{children}</main>
      </div>
    </div>
  )
}
