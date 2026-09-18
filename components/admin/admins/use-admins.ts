import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from './api'
import type { AdminUser, AdminRole } from './types'
import type { CreateAdminInput, UpdateAdminInput } from './schema'
import { getErrorMessage } from '@/lib/http'

const initialMockAdmins: AdminUser[] = [
  { id: '1', name: 'أحمد عبد الله', email: 'ahmed@gaza.org', role: 'SUPER_ADMIN', createdAt: '2024-03-15' },
  { id: '2', name: 'فاطمة حسن', email: 'fatima@gaza.org', role: 'ADMIN', createdAt: '2024-03-10' },
  { id: '3', name: 'محمد يوسف', email: 'mohamed@gaza.org', role: 'ADMIN', createdAt: '2024-03-05' },
  { id: '4', name: 'سارة خالد', email: 'sara@gaza.org', role: 'ADMIN', createdAt: '2024-03-01' },
]

export function useAdmins() {
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
      // Fallback to initial local list if offline
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdminsList()
  }, [fetchAdminsList])

  const handleCreateAdmin = async (data: CreateAdminInput) => {
    try {
      const res = await createAdmin(data)
      toast.success('تم إضافة المسؤول بنجاح!')
      if (res.data) {
        setAdmins((prev) => [res.data, ...prev])
      } else {
        await fetchAdminsList()
      }
      return true
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || 'فشل إضافة المسؤول'
      toast.error(msg)
      return false
    }
  }

  const handleEditAdmin = async (id: string, data: UpdateAdminInput) => {
    try {
      const res = await updateAdmin(id, data)
      toast.success('تم تحديث بيانات المسؤول بنجاح!')
      if (res.data) {
        setAdmins((prev) => prev.map((item) => (item.id === id ? res.data : item)))
      } else {
        await fetchAdminsList()
      }
      return true
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || 'فشل تحديث البيانات'
      toast.error(msg)
      return false
    }
  }

  const handleDeleteAdmin = async (id: string, name: string) => {
    try {
      await deleteAdmin(id)
      toast.success(`تم حذف المدير "${name}" بنجاح`)
      setAdmins((prev) => prev.filter((item) => item.id !== id))
      return true
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل حذف المدير')
      return false
    }
  }

  const handleToggleRole = async (admin: AdminUser) => {
    const newRole: AdminRole = admin.role === 'SUPER_ADMIN' ? 'ADMIN' : 'SUPER_ADMIN'
    try {
      await updateAdmin(admin.id, { role: newRole })
      toast.success(`تم تغيير صلاحية ${admin.name} إلى ${newRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin عادي'}`)
      setAdmins((prev) =>
        prev.map((item) => (item.id === admin.id ? { ...item, role: newRole } : item))
      )
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل تعديل الصلاحية')
    }
  }

  return {
    admins,
    loading,
    refetch: fetchAdminsList,
    createAdmin: handleCreateAdmin,
    editAdmin: handleEditAdmin,
    deleteAdmin: handleDeleteAdmin,
    toggleRole: handleToggleRole,
  }
}
