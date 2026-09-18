'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { createAdmin, updateAdmin } from './api'
import { createAdminSchema } from './schema'
import type { AdminUser, AdminRole } from './types'
import type { CreateAdminInput, UpdateAdminInput } from './schema'
import { getErrorMessage } from '@/lib/http'

export interface AdminDialogProps {
  admin?: AdminUser
  initialData?: AdminUser
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
  onSubmit?: (data: CreateAdminInput | UpdateAdminInput) => Promise<boolean>
  trigger?: React.ReactNode
}

export function AdminDialog({
  admin,
  initialData,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
  onSubmit,
  trigger,
}: AdminDialogProps) {
  const targetAdmin = admin || initialData
  const isEditing = !!targetAdmin

  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (setControlledOpen) {
      setControlledOpen(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  const [name, setName] = useState(targetAdmin?.name || '')
  const [email, setEmail] = useState(targetAdmin?.email || '')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<AdminRole>(targetAdmin?.role || 'ADMIN')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setName(targetAdmin?.name || '')
      setEmail(targetAdmin?.email || '')
      setPassword('')
      setRole(targetAdmin?.role || 'ADMIN')
      setErrors({})
    }
  }, [open, targetAdmin])

  const resetForm = () => {
    setName(targetAdmin?.name || '')
    setEmail(targetAdmin?.email || '')
    setPassword('')
    setRole(targetAdmin?.role || 'ADMIN')
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (isEditing) {
      setIsSubmitting(true)
      try {
        if (onSubmit) {
          const ok = await onSubmit({ name, email, role })
          if (ok) {
            handleOpenChange(false)
            if (onSuccess) onSuccess()
          }
        } else {
          await updateAdmin(targetAdmin.id, { name, email, role })
          toast.success('تم تحديث بيانات المسؤول بنجاح!')
          handleOpenChange(false)
          if (onSuccess) onSuccess()
        }
      } catch (err) {
        toast.error(getErrorMessage(err) || 'فشل تحديث البيانات')
      } finally {
        setIsSubmitting(false)
      }
      return
    }

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
      if (onSubmit) {
        const ok = await onSubmit(validation.data)
        if (ok) {
          resetForm()
          handleOpenChange(false)
          if (onSuccess) onSuccess()
        }
      } else {
        await createAdmin(validation.data)
        toast.success('تم إضافة المسؤول بنجاح!')
        resetForm()
        handleOpenChange(false)
        if (onSuccess) onSuccess()
      }
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل إضافة المسؤول')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button className="gap-2">
              <Plus className="size-4" />
              إضافة أدمن جديد
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent dir="rtl" className="max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="text-right">
            <DialogTitle className="text-xl font-bold">
              {isEditing ? 'تعديل بيانات المسؤول' : 'إضافة أدمن جديد'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'تحديث معلومات وصلاحيات الحساب الإداري الحالي.'
                : 'إنشاء حساب إداري جديد بصلاحيات محددة.'}
            </DialogDescription>
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

            {!isEditing && (
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
            )}

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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isEditing ? 'حفظ التعديلات' : 'إنشاء الحساب'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
