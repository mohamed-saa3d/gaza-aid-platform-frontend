"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import { Newspaper, Plus, Pencil, Trash2, Search, Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { newsFormSchema } from "@/lib/validations/admin"

interface NewsItemData {
  id: string
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  detailsUrl?: string
  isUrgent: boolean
  imageUrl: string
}

const initialNewsItems: NewsItemData[] = [
  {
    id: "1",
    titleAr: "توزيع السلال الغذائية",
    titleEn: "Food Baskets Distribution",
    descriptionAr: "مبادرة توزيع السلال الغذائية على الأسر الأكثر احتياجاً.",
    descriptionEn: "Initiative to distribute food baskets to needy families.",
    detailsUrl: "https://example.com/news/1",
    isUrgent: true,
    imageUrl: "/images/news-food-distribution.png",
  },
  {
    id: "2",
    titleAr: "إفطار صائم في رمضان",
    titleEn: "Ramadan Iftar Campaign",
    descriptionAr: "تستمر مبادراتنا في دعم الصائمين في مختلف المناطق.",
    descriptionEn: "Our initiatives continue to support fasting people in various areas.",
    detailsUrl: "https://example.com/news/2",
    isUrgent: false,
    imageUrl: "/images/news-featured-winter.png",
  },
  {
    id: "3",
    titleAr: "حملة الشتاء الدافئ",
    titleEn: "Warm Winter Campaign",
    descriptionAr: "ساهم معنا لنقدم الدفء للأسر المحتاجة هذا الشتاء.",
    descriptionEn: "Join us in bringing warmth to families in need this winter.",
    detailsUrl: "",
    isUrgent: false,
    imageUrl: "/images/news-mobile-clinic.png",
  },
]

export function NewsSection() {
  const [news, setNews] = useState<NewsItemData[]>(initialNewsItems)
  const [searchQuery, setSearchQuery] = useState("")

  // Add Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addTitleAr, setAddTitleAr] = useState("")
  const [addTitleEn, setAddTitleEn] = useState("")
  const [addDescAr, setAddDescAr] = useState("")
  const [addDescEn, setAddDescEn] = useState("")
  const [addDetailsUrl, setAddDetailsUrl] = useState("")
  const [addIsUrgent, setAddIsUrgent] = useState(false)
  const [addImageFile, setAddImageFile] = useState<File | null>(null)
  const [addErrors, setAddErrors] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  // Edit Dialog State
  const [editingItem, setEditingItem] = useState<NewsItemData | null>(null)
  const [editTitleAr, setEditTitleAr] = useState("")
  const [editTitleEn, setEditTitleEn] = useState("")
  const [editDescAr, setEditDescAr] = useState("")
  const [editDescEn, setEditDescEn] = useState("")
  const [editDetailsUrl, setEditDetailsUrl] = useState("")
  const [editIsUrgent, setEditIsUrgent] = useState(false)
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  const resetAddForm = () => {
    setAddTitleAr("")
    setAddTitleEn("")
    setAddDescAr("")
    setAddDescEn("")
    setAddDetailsUrl("")
    setAddIsUrgent(false)
    setAddImageFile(null)
    setAddErrors({})
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAddErrors({})

    const payload = {
      titleAr: addTitleAr,
      titleEn: addTitleEn,
      descriptionAr: addDescAr,
      descriptionEn: addDescEn,
      detailsUrl: addDetailsUrl || undefined,
      isUrgent: addIsUrgent,
      imageUrl: "",
    }

    const validation = newsFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setAddErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للخبر")
      return
    }

    setIsAdding(true)
    setTimeout(() => {
      const newItem: NewsItemData = {
        id: Date.now().toString(),
        titleAr: validation.data.titleAr,
        titleEn: validation.data.titleEn,
        descriptionAr: validation.data.descriptionAr,
        descriptionEn: validation.data.descriptionEn,
        detailsUrl: validation.data.detailsUrl || "",
        isUrgent: validation.data.isUrgent,
        imageUrl: addImageFile ? URL.createObjectURL(addImageFile) : "/images/news-food-distribution.png",
      }

      setNews((prev) => [newItem, ...prev])
      toast.success("تم إضافة الخبر بنجاح!")
      resetAddForm()
      setIsAddOpen(false)
      setIsAdding(false)
    }, 300)
  }

  const openEditDialog = (item: NewsItemData) => {
    setEditingItem(item)
    setEditTitleAr(item.titleAr)
    setEditTitleEn(item.titleEn)
    setEditDescAr(item.descriptionAr)
    setEditDescEn(item.descriptionEn)
    setEditDetailsUrl(item.detailsUrl || "")
    setEditIsUrgent(item.isUrgent)
    setEditImageFile(null)
    setEditErrors({})
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    setEditErrors({})

    const payload = {
      titleAr: editTitleAr,
      titleEn: editTitleEn,
      descriptionAr: editDescAr,
      descriptionEn: editDescEn,
      detailsUrl: editDetailsUrl || undefined,
      isUrgent: editIsUrgent,
      imageUrl: "",
    }

    const validation = newsFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setEditErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للخبر")
      return
    }

    setIsEditing(true)
    setTimeout(() => {
      setNews((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                titleAr: validation.data.titleAr,
                titleEn: validation.data.titleEn,
                descriptionAr: validation.data.descriptionAr,
                descriptionEn: validation.data.descriptionEn,
                detailsUrl: validation.data.detailsUrl || "",
                isUrgent: validation.data.isUrgent,
                imageUrl: editImageFile ? URL.createObjectURL(editImageFile) : item.imageUrl,
              }
            : item
        )
      )
      toast.success("تم تحديث الخبر بنجاح!")
      setEditingItem(null)
      setIsEditing(false)
    }, 300)
  }

  const handleDelete = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id))
    toast.success("تم حذف الخبر بنجاح")
  }

  const filteredNews = news.filter(
    (item) =>
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="text-primary" />
          إدارة الأخبار
        </CardTitle>

        {/* Add News Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" aria-label="إضافة خبر جديد">
              <Plus className="ml-2 size-4" />
              إضافة خبر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>إضافة خبر جديد</DialogTitle>
              <DialogDescription>
                أدخل تفاصيل الخبر باللغتين العربية والإنجليزية.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="addTitleAr">عنوان الخبر (بالعربية) *</Label>
                  <Input
                    id="addTitleAr"
                    value={addTitleAr}
                    onChange={(e) => setAddTitleAr(e.target.value)}
                    placeholder="عنوان الخبر بالعربية..."
                    dir="rtl"
                  />
                  {addErrors.titleAr && <span className="text-xs text-destructive">{addErrors.titleAr}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addTitleEn">عنوان الخبر (بالإنجليزية) *</Label>
                  <Input
                    id="addTitleEn"
                    value={addTitleEn}
                    onChange={(e) => setAddTitleEn(e.target.value)}
                    placeholder="عنوان الخبر بالإنجليزية..."
                    dir="ltr"
                  />
                  {addErrors.titleEn && <span className="text-xs text-destructive">{addErrors.titleEn}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="addDescAr">تفاصيل الخبر (بالعربية) *</Label>
                  <Textarea
                    id="addDescAr"
                    value={addDescAr}
                    onChange={(e) => setAddDescAr(e.target.value)}
                    placeholder="تفاصيل الخبر بالعربية..."
                    rows={3}
                    dir="rtl"
                  />
                  {addErrors.descriptionAr && (
                    <span className="text-xs text-destructive">{addErrors.descriptionAr}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="addDescEn">تفاصيل الخبر (بالإنجليزية) *</Label>
                  <Textarea
                    id="addDescEn"
                    value={addDescEn}
                    onChange={(e) => setAddDescEn(e.target.value)}
                    placeholder="تفاصيل الخبر بالإنجليزية..."
                    rows={3}
                    dir="ltr"
                  />
                  {addErrors.descriptionEn && (
                    <span className="text-xs text-destructive">{addErrors.descriptionEn}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="addDetailsUrl">رابط تفاصيل الخبر المباشر</Label>
                <Input
                  id="addDetailsUrl"
                  type="url"
                  value={addDetailsUrl}
                  onChange={(e) => setAddDetailsUrl(e.target.value)}
                  placeholder="https://example.com/news/1"
                  dir="ltr"
                />
                {addErrors.detailsUrl && (
                  <span className="text-xs text-destructive">{addErrors.detailsUrl}</span>
                )}
              </div>

              {/* File Upload Box */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="addImageFile">صورة الخبر الرئيسية</Label>
                <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-5 transition-colors hover:border-primary/50 bg-muted/20">
                  <Upload className="mb-2 size-7 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">
                    اضغط هنا لاختيار صورة الخبر
                  </p>
                  <Input
                    id="addImageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAddImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
                {addImageFile && (
                  <p className="text-xs font-medium text-primary">
                    تم تحديد الملف: {addImageFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="addIsUrgent"
                  checked={addIsUrgent}
                  onCheckedChange={(checked) => setAddIsUrgent(Boolean(checked))}
                />
                <Label htmlFor="addIsUrgent" className="cursor-pointer font-medium">
                  تعيين كخبر عاجل
                </Label>
              </div>

              <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? <Loader2 className="ml-2 size-4 animate-spin" /> : "إضافة الخبر"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="relative max-w-xs">
          <Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            className="pr-9"
            placeholder="ابحث عن خبر..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {filteredNews.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border">
              <div className="relative h-28">
                <Image
                  src={item.imageUrl}
                  alt={item.titleAr}
                  fill
                  className="object-cover"
                />
                {item.isUrgent && (
                  <span className="absolute top-2 right-2 rounded bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                    عاجل
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold line-clamp-1">{item.titleAr}</h3>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="تعديل الخبر"
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="حذف الخبر"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                  {item.descriptionAr}
                </p>
              </div>
            </article>
          ))}
        </div>
      </CardContent>

      {/* Edit News Dialog */}
      {editingItem && (
        <Dialog open={Boolean(editingItem)} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>تعديل بيانات الخبر</DialogTitle>
              <DialogDescription>
                تعديل بيانات الخبر باللغتين العربية والإنجليزية.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editTitleAr">عنوان الخبر (بالعربية) *</Label>
                  <Input
                    id="editTitleAr"
                    value={editTitleAr}
                    onChange={(e) => setEditTitleAr(e.target.value)}
                    dir="rtl"
                  />
                  {editErrors.titleAr && <span className="text-xs text-destructive">{editErrors.titleAr}</span>}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="editTitleEn">عنوان الخبر (بالإنجليزية) *</Label>
                  <Input
                    id="editTitleEn"
                    value={editTitleEn}
                    onChange={(e) => setEditTitleEn(e.target.value)}
                    dir="ltr"
                  />
                  {editErrors.titleEn && <span className="text-xs text-destructive">{editErrors.titleEn}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="editDescAr">تفاصيل الخبر (بالعربية) *</Label>
                  <Textarea
                    id="editDescAr"
                    value={editDescAr}
                    onChange={(e) => setEditDescAr(e.target.value)}
                    rows={3}
                    dir="rtl"
                  />
                  {editErrors.descriptionAr && (
                    <span className="text-xs text-destructive">{editErrors.descriptionAr}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="editDescEn">تفاصيل الخبر (بالإنجليزية) *</Label>
                  <Textarea
                    id="editDescEn"
                    value={editDescEn}
                    onChange={(e) => setEditDescEn(e.target.value)}
                    rows={3}
                    dir="ltr"
                  />
                  {editErrors.descriptionEn && (
                    <span className="text-xs text-destructive">{editErrors.descriptionEn}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="editDetailsUrl">رابط تفاصيل الخبر المباشر</Label>
                <Input
                  id="editDetailsUrl"
                  type="url"
                  value={editDetailsUrl}
                  onChange={(e) => setEditDetailsUrl(e.target.value)}
                  dir="ltr"
                />
                {editErrors.detailsUrl && (
                  <span className="text-xs text-destructive">{editErrors.detailsUrl}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="editImageFile">تغيير صورة الخبر (اختياري)</Label>
                <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-5 transition-colors hover:border-primary/50 bg-muted/20">
                  <Upload className="mb-2 size-7 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">
                    اضغط لتغيير الصورة
                  </p>
                  <Input
                    id="editImageFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
                {editImageFile && (
                  <p className="text-xs font-medium text-primary">
                    الملف الجديد: {editImageFile.name}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="editIsUrgent"
                  checked={editIsUrgent}
                  onCheckedChange={(checked) => setEditIsUrgent(Boolean(checked))}
                />
                <Label htmlFor="editIsUrgent" className="cursor-pointer font-medium">
                  تعيين كخبر عاجل
                </Label>
              </div>

              <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
                <Button type="submit" disabled={isEditing}>
                  {isEditing ? <Loader2 className="ml-2 size-4 animate-spin" /> : "حفظ التعديلات"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  إلغاء
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}
