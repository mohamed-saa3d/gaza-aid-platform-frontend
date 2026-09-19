import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { getCategories, createCategory, updateCategory, deleteCategory } from './api'
import type { Category } from './types'
import type { CategoryFormInput } from './schema'
import { getErrorMessage } from '@/lib/http'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 })

  const fetchCategoriesList = useCallback(async (page = 1, limit = 10, search = '') => {
    setLoading(true)
    try {
      const res = await getCategories({ page, limit, search })
      setCategories(res.data)
      setMeta(res.meta)
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

  const handleDeleteCategory = async (id: string, name: string) => {
    try {
      await deleteCategory(id)
      toast.success(`تم حذف الفئة "${name}" بنجاح`)
      await fetchCategoriesList(meta.page, meta.limit)
      return true
    } catch (err) {
      toast.error(getErrorMessage(err) || 'فشل حذف الفئة')
      return false
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
