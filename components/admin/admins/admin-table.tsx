'use client'

import { useState } from 'react'
import { MoreVertical, Loader2, Trash2, Pencil, ShieldAlert } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { AdminDialog } from './admin-dialog'
import { AdminDeleteDialog } from './admin-delete-dialog'
import type { AdminUser } from './types'

interface AdminTableProps {
  admins: AdminUser[]
  loading: boolean
  onToggleRole: (admin: AdminUser) => Promise<void>
  onDelete: (id: string, name: string) => Promise<boolean | void>
  onEditSuccess?: () => void
}

export function AdminTable({
  admins,
  loading,
  onToggleRole,
  onDelete,
  onEditSuccess,
}: AdminTableProps) {
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [deletingAdmin, setDeletingAdmin] = useState<AdminUser | null>(null)

  return (
    <>
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
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  <Loader2 className="mx-auto mb-2 size-6 animate-spin" />
                  جاري تحميل قائمة المديرين...
                </TableCell>
              </TableRow>
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  لا يوجد مسؤولين حالياً.
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
                        <DropdownMenuItem onClick={() => setEditingAdmin(admin)}>
                          <Pencil className="ml-2 size-4" />
                          تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleRole(admin)}>
                          <ShieldAlert className="ml-2 size-4" />
                          تغيير الصلاحية
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeletingAdmin(admin)}
                        >
                          <Trash2 className="ml-2 size-4" />
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

      {editingAdmin && (
        <AdminDialog
          initialData={editingAdmin}
          open={!!editingAdmin}
          onOpenChange={(open) => {
            if (!open) setEditingAdmin(null)
          }}
          onSuccess={() => {
            setEditingAdmin(null)
            if (onEditSuccess) onEditSuccess()
          }}
        />
      )}

      {deletingAdmin && (
        <AdminDeleteDialog
          admin={deletingAdmin}
          open={!!deletingAdmin}
          onOpenChange={(open) => {
            if (!open) setDeletingAdmin(null)
          }}
          onConfirm={onDelete}
        />
      )}
    </>
  )
}
