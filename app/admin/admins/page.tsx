'use client'

import { useState, useEffect, useCallback } from 'react'
import { MoreVertical, Plus, UserPlus, Loader2, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

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

import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/components/admin/admins/api'
import { createAdminSchema } from '@/components/admin/admins/schema'
import type { AdminUser, AdminRole } from '@/components/admin/admins/types'
import { getErrorMessage } from '@/lib/http'

const initialMockAdmins: AdminUser[] = [
  { id: '1', name: 'أحمد عبد الله', email: 'ahmed@gaza.org', role: 'SUPER_ADMIN', createdAt: '2024-03-15' },
  { id: '2', name: 'فاطمة حسن', email: 'fatima@gaza.org', role: 'ADMIN', createdAt: '2024-03-10' },
  { id: '3', name: 'محمد يوسف', email: 'mohamed@gaza.org', role: 'ADMIN', createdAt: '2024-03-05' },
  { id: '4', name: 'سارة خالد', email: 'sara@gaza.org', role: 'ADMIN', createdAt: '2024-03-01' },
]

function AddAdminDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AdminRole>('ADMIN')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setRole('ADMIN')
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = createAdminSchema.safeParse({ name, email, password, role })
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      await createAdmin(validation.data)
      toast.success('تم إضافة المسؤول بنجاح!')
      resetForm()
      setOpen(false)
      if (onSuccess) onSuccess()
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || 'فشل إضافة المسؤول'
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          إضافة أدمن جديد
        </Button>
      </DialogTrigger>
      <DialogContent dir="rtl" className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold">إضافة أدمن جديد</DialogTitle>
            <DialogDescription>إنشاء حساب إداري جديد بصلاحيات محددة.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-name">الاسم الكامل</Label>
              <Input
                id="admin-name"
                placeholder="مثال: محمد سعد"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-email">البريد الإلكتروني</Label>
              <Input
                id="admin-email"
                type="email"
                dir="ltr"
                placeholder="email@gaza.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="admin-password">كلمة المرور المؤقتة</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <Label>الصلاحية</Label>
              <Select value={role} onValueChange={(val) => { if (val) setRole(val as AdminRole) }}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="ADMIN">Admin عادي</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-row justify-end gap-2 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              إنشاء الحساب
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(initialMockAdmins)
  const [loading, setLoading] = useState(false)

  const fetchAdminsList = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAdmins()
      if (res.data && Array.isArray(res.data.data)) {
        setAdmins(res.data.data)
      }
    } catch (err) {
      // Retain fallback mock list if offline or unauthenticated API call
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdminsList()
  }, [fetchAdminsList])

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteAdmin(id)
      toast.success(`تم حذف المدير "${name}" بنجاح`)
      setAdmins((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل حذف المدير')
    }
  }

  const handleToggleRole = async (admin: AdminUser) => {
    const newRole: AdminRole = admin.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN'
    try {
      await updateAdmin(admin.id, { role: newRole })
      toast.success(`تم تغيير صلاحية ${admin.name} إلى ${newRole}`)
      setAdmins((prev) =>
        prev.map((item) => (item.id === admin.id ? { ...item, role: newRole } : item))
      )
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل تعديل الصلاحية')
    }
  }

  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">إدارة المديرين</h1>
          <p className="mt-2 text-muted-foreground">إدارة حسابات المسؤولين والصلاحيات داخل المنصة.</p>
        </div>
        <div>
          <AddAdminDialog onSuccess={fetchAdminsList} />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الصلاحية</TableHead>
              <TableHead className="text-right">تاريخ الإضافة</TableHead>
              <TableHead className="w-24 text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin mx-auto mb-2" />
                  جاري تحميل قائمة المديرين...
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id} className="h-16">
                  <TableCell>
                    <div className="flex items-center gap-3 font-medium">
                      <Avatar className="size-9">
                        <AvatarFallback
                          className={
                            admin.role === 'SUPER_ADMIN'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          }
                        >
                          {admin.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      {admin.name}
                    </div>
                  </TableCell>
                  <TableCell dir="ltr" className="text-right text-muted-foreground">
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        admin.role === 'SUPER_ADMIN'
                          ? 'border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-100'
                          : 'border-emerald-200 bg-emerald-100 text-emerald-800 hover:bg-emerald-100'
                      }
                    >
                      {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin عادي'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {admin.createdAt || admin.addedDate || 'جديد'}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`إجراءات ${admin.name}`}>
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" dir="rtl">
                        <DropdownMenuItem onClick={() => handleToggleRole(admin)}>
                          <Pencil className="size-4 ml-2" />
                          تغيير الصلاحية
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(admin.id, admin.name)}
                        >
                          <Trash2 className="size-4 ml-2" />
                          حذف المدير
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
