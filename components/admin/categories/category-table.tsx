"use client"

import { useState } from "react"
import { MoreVertical, Loader2, Trash2, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CategoryFormDialog } from "./category-form-dialog"
import { CategoryDeleteDialog } from "./category-delete-dialog"
import type { Category } from "./types"

interface CategoryTableProps {
  categories: Category[]
  loading: boolean
  onDelete: (id: string, name: string) => Promise<boolean | void>
  onEditSuccess?: () => void
}

export function CategoryTable({
  categories,
  loading,
  onDelete,
  onEditSuccess,
}: CategoryTableProps) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead className="text-right">الاسم (بالعربية)</TableHead>
              <TableHead className="text-right">الاسم (بالإنجليزية)</TableHead>
              <TableHead className="text-right">الوصف (بالعربية)</TableHead>
              <TableHead className="w-24 text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  <Loader2 className="mx-auto mb-2 size-6 animate-spin" />
                  جاري تحميل قائمة الفئات...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                  لا توجد فئات حالياً.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="h-16">
                  <TableCell className="font-medium text-right">
                    {category.nameAr}
                  </TableCell>
                  <TableCell dir="ltr" className="text-right text-muted-foreground">
                    {category.nameEn}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.descriptionAr || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label={`إجراءات ${category.nameAr}`}>
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" dir="rtl">
                        <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                          <Pencil className="ml-2 size-4" />
                          تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeletingCategory(category)}
                        >
                          <Trash2 className="ml-2 size-4" />
                          حذف الفئة
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

      {editingCategory && (
        <CategoryFormDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => {
            if (!open) setEditingCategory(null)
          }}
          onSuccess={() => {
            setEditingCategory(null)
            if (onEditSuccess) onEditSuccess()
          }}
        />
      )}

      {deletingCategory && (
        <CategoryDeleteDialog
          category={deletingCategory}
          open={!!deletingCategory}
          onOpenChange={(open) => {
            if (!open) setDeletingCategory(null)
          }}
          onConfirm={onDelete}
        />
      )}
    </>
  )
}
