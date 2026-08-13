import type { Metadata } from 'next'
import { AdminShell } from '@/components/admin/admin-shell'

export const metadata: Metadata = {
  title: 'لوحة الإدارة | لأدمن فقط',
  description: 'إدارة محتوى منصة القدس للإغاثة وتقاريرها',
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <AdminShell>{children}</AdminShell>
}

export const dynamic = 'force-dynamic'

// لوحة الإدارة مستقلة عن ترويسة الموقع العامة حتى تحافظ على سياق العمل الإداري.
