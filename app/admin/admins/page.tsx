'use client'

import { useState } from 'react'
import { LockKeyhole, MoreVertical, Plus, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type AdminRole = 'Super Admin' | 'Admin'

type AdminRecord = {
  id: string
  name: string
  email: string
  role: AdminRole
  addedDate: string
}

const adminsList: AdminRecord[] = [
  { id: '1', name: 'أحمد عبد الله', email: 'ahmed@gaza.org', role: 'Super Admin', addedDate: '15 مارس 2024' },
  { id: '2', name: 'فاطمة حسن', email: 'fatima@gaza.org', role: 'Admin', addedDate: '10 مارس 2024' },
  { id: '3', name: 'محمد يوسف', email: 'mohamed@gaza.org', role: 'Admin', addedDate: '05 مارس 2024' },
  { id: '4', name: 'سارة خالد', email: 'sara@gaza.org', role: 'Admin', addedDate: '01 مارس 2024' },
]

function AddAdminDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus data-icon="inline-end" />
        إضافة أدمن جديد
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-5 text-right">
          <DialogTitle className="text-xl font-bold">إضافة أدمن جديد</DialogTitle>
          <DialogDescription>إنشاء حساب إداري جديد بصلاحيات محددة.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-6 px-6 py-6">
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-base font-semibold text-primary">
              <UserPlus className="size-5" />
              <h2>بيانات الحساب الجديد</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="admin-name">الاسم الكامل</Label><Input id="admin-name" placeholder="مثال: علي محمد" /></div>
              <div className="flex flex-col gap-2"><Label htmlFor="admin-email">البريد الإلكتروني</Label><Input id="admin-email" type="email" dir="ltr" placeholder="email@gaza.org" /></div>
              <div className="flex flex-col gap-2"><Label htmlFor="admin-password">كلمة المرور المؤقتة</Label><Input id="admin-password" type="password" /></div>
              <div className="flex flex-col gap-2"><Label>الصلاحية</Label><Select defaultValue="Admin"><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Admin">Admin عادي</SelectItem><SelectItem value="Super Admin">Super Admin</SelectItem></SelectContent></Select></div>
            </div>
          </section>
          <section className="flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <div className="flex items-start gap-2"><LockKeyhole className="mt-0.5 size-5 shrink-0 text-amber-700" /><div><h2 className="font-semibold">تأكيد هوية الإدارة العليا (إلزامي)</h2><p className="mt-1 text-sm leading-6 text-amber-800">لإضافة مدير جديد، يرجى إدخال بيانات حساب Root الخاص بك للتأكيد الأمني.</p></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2"><Label htmlFor="root-email">بريد الـ Root</Label><Input id="root-email" type="email" dir="ltr" className="border-amber-300 bg-background" /></div>
              <div className="flex flex-col gap-2"><Label htmlFor="root-password">كلمة مرور الـ Root</Label><Input id="root-password" type="password" className="border-amber-300 bg-background" /></div>
            </div>
          </section>
        </div>
        <DialogFooter className="flex-row justify-start border-t px-6 py-4"><Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={() => setOpen(false)}>إنشاء الحساب</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminsPage() {
  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="font-heading text-3xl font-bold tracking-tight">إدارة المديرين</h1><p className="mt-2 text-muted-foreground">إدارة حسابات المسؤولين والصلاحيات داخل المنصة.</p></div>
        <div dir="ltr"><AddAdminDialog /></div>
      </div>
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-primary/10"><TableRow><TableHead className="text-right">الاسم</TableHead><TableHead className="text-right">البريد الإلكتروني</TableHead><TableHead className="text-right">الصلاحية</TableHead><TableHead className="text-right">تاريخ الإضافة</TableHead><TableHead className="w-24 text-center">إجراءات</TableHead></TableRow></TableHeader>
          <TableBody>{adminsList.map((admin) => <TableRow key={admin.id} className="h-16"><TableCell><div className="flex items-center gap-3 font-medium"><Avatar className="size-9"><AvatarFallback className={admin.role === 'Super Admin' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}>{admin.name.slice(0, 1)}</AvatarFallback></Avatar>{admin.name}</div></TableCell><TableCell dir="ltr" className="text-right text-muted-foreground">{admin.email}</TableCell><TableCell><Badge className={admin.role === 'Super Admin' ? 'border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100' : 'border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100'}>{admin.role}</Badge></TableCell><TableCell className="text-muted-foreground">{admin.addedDate}</TableCell><TableCell className="text-center"><DropdownMenu><DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`إجراءات ${admin.name}`} />}><MoreVertical /></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>تعديل البيانات</DropdownMenuItem><DropdownMenuItem variant="destructive">حذف المدير</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody>
        </Table>
        <div className="flex items-center justify-between border-t bg-primary/10 px-4 py-3 text-sm text-muted-foreground"><span>عرض 1 إلى 4 من 12</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled>السابق</Button><Button variant="outline" size="sm">التالي</Button></div></div>
      </div>
    </div>
  )
}

export { adminsList }
