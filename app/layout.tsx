import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Kufi_Arabic, Noto_Sans_Arabic } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/components/locale-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-heading',
})

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'مؤسسة قدس للإغاثة | معاً من أجل غزة',
  description:
    'مؤسسة خيرية تعمل على تقديم الإغاثة والدعم للمحتاجين في فلسطين، من خلال مشاريع المياه والغذاء والإيواء وكفالة الأيتام.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`bg-background ${notoKufiArabic.variable} ${notoSansArabic.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </LocaleProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
