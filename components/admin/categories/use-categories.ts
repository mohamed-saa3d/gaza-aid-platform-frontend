import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { getCategories, createCategory, updateCategory, deleteCategory } from './api'
import { isConfirmationRequired, type Category, type CategoryDeleteConfirmationRequired } from './types'
import type { CategoryFormInput } from './schema'
import { getErrorMessage } from '@/lib/http'

export type DeleteOutcome =
  | { status: 'deleted' }
  | { status: 'confirmation_required'; warning: CategoryDeleteConfirmationRequired }
  | { status: 'error' }

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 })

  const fetchCategoriesList = useCallback(async (page = 1, limit = 10, search = '') => {
    setLoading(true)
    try {
      const res = await getCategories({ page, limit, search })
      const rawData: any = res
      const categoriesList = Array.isArray(rawData?.data) ? rawData.data : []
      const paginationMeta = rawData?.meta || { total: 0, page: 1, limit: 10, totalPages: 0 }
      setCategories(categoriesList)
      setMeta(paginationMeta)
    } catch (err) {
      toast.error('فشل في تحميل الفئات')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategoriesList()
  }, [fetchCategoriesList])

  const handleCreateCategory = async (data: CategoryFormInput) => {
    try {
      await createCategory(data)
      toast.success('تم إضافة الفئة بنجاح!')
      await fetchCategoriesList(meta.page, meta.limit)
      return true
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || 'فشل إضافة الفئة'
      toast.error(msg)
      return false
    }
  }

  const handleEditCategory = async (id: string, data: CategoryFormInput) => {
    try {
      await updateCategory(id, data)
      toast.success('تم تحديث بيانات الفئة بنجاح!')
      await fetchCategoriesList(meta.page, meta.limit)
      return true
    } catch (err: unknown) {
      const msg = getErrorMessage(err) || 'فشل تحديث البيانات'
      toast.error(msg)
      return false
    }
  }

  const handleDeleteCategory = async (
    id: string,
    name: string,
    options?: { confirmUnassignProjects?: boolean },
  ): Promise<DeleteOutcome> => {
    try {
      const result = await deleteCategory(id, options)

      if (isConfirmationRequired(result)) {
        // Nothing was deleted. The backend supplied the real linked count.
        return { status: 'confirmation_required', warning: result }
      }

      const affected = result.data?.unassignedProjectCount ?? 0
      toast.success(
        affected > 0
          ? `تم حذف الفئة "${name}" وتحويل ${affected} مشروع إلى "غير مصنف"`
          : `تم حذف الفئة "${name}" بنجاح`,
      )
      await fetchCategoriesList(meta.page, meta.limit)
      return { status: 'deleted' }
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل حذف الفئة')
      return { status: 'error' }
    }
  }

  return {
    categories,
    meta,
    loading,
    refetch: fetchCategoriesList,
    createCategory: handleCreateCategory,
    editCategory: handleEditCategory,
    deleteCategory: handleDeleteCategory,
  }
}
