'use client'

import { useAdmins } from '@/components/admin/admins/use-admins'
import { AdminTable } from '@/components/admin/admins/admin-table'
import { AdminDialog } from '@/components/admin/admins/admin-dialog'

export default function AdminsPage() {
  const { admins, loading, refetch, deleteAdmin, toggleRole } = useAdmins()

  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">إدارة المديرين</h1>
          <p className="mt-2 text-muted-foreground">
            إدارة حسابات المسؤولين والصلاحيات داخل المنصة.
          </p>
        </div>
        <div>
          <AdminDialog onSuccess={refetch} />
        </div>
      </div>

      <AdminTable
        admins={admins}
        loading={loading}
        onToggleRole={toggleRole}
        onDelete={deleteAdmin}
        onEditSuccess={refetch}
      />
    </div>
  )
}
