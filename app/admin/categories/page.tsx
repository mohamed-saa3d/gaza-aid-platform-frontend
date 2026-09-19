'use client'

import { useCategories } from '@/components/admin/categories/use-categories'
import { CategoryTable } from '@/components/admin/categories/category-table'
import { CategoryFormDialog } from '@/components/admin/categories/category-form-dialog'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function CategoriesPage() {
  const { categories, meta, loading, refetch, deleteCategory } = useCategories()

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      refetch(newPage, meta.limit)
    }
  }

  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">إدارة الفئات</h1>
          <p className="mt-2 text-muted-foreground">
            إدارة فئات المشاريع (سقيا ماء، سلال غذائية، وغيرها).
          </p>
        </div>
        <div>
          <CategoryFormDialog onSuccess={() => refetch(meta.page, meta.limit)} />
        </div>
      </div>

      <CategoryTable
        categories={categories}
        loading={loading}
        onDelete={deleteCategory}
        onEditSuccess={() => refetch(meta.page, meta.limit)}
      />

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground">
            عرض {categories.length} من {meta.total} فئة
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page === 1 || loading}
            >
              <ChevronRight className="size-4" />
              السابق
            </Button>
            <span className="text-sm font-medium">
              صفحة {meta.page} من {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page === meta.totalPages || loading}
            >
              التالي
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
