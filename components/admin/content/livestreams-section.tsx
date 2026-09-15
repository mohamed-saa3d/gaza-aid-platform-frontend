"use client"

import * as React from "react"
import { useState } from "react"
import { Radio, Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
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

import { livestreamFormSchema } from "@/lib/validations/admin"

interface LivestreamItemData {
  id: string
  titleAr: string
  titleEn: string
  youtubeUrl: string
  isActive: boolean
}

const initialLivestreams: LivestreamItemData[] = [
  {
    id: "1",
    titleAr: "البث المباشر - حفل افتتاح مشروع بئر الرحمة",
    titleEn: "Live Stream - Well Opening Ceremony",
    youtubeUrl: "https://www.youtube.com/watch?v=abc12345678",
    isActive: true,
  },
  {
    id: "2",
    titleAr: "البث المباشر - توزيع كراتين رمضان",
    titleEn: "Live Stream - Ramadan Food Boxes Distribution",
    youtubeUrl: "https://www.youtube.com/watch?v=def45678901",
    isActive: true,
  },
  {
    id: "3",
    titleAr: "البث المباشر - محاضرة عن فضل الصدقة",
    titleEn: "Live Stream - Charity Virtues Lecture",
    youtubeUrl: "https://www.youtube.com/watch?v=ghi78901234",
    isActive: false,
  },
]

export function LivestreamsSection() {
  const [streams, setStreams] = useState<LivestreamItemData[]>(initialLivestreams)
  const [searchQuery, setSearchQuery] = useState("")

  // Add Stream Dialog State
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [addTitleAr, setAddTitleAr] = useState("")
  const [addTitleEn, setAddTitleEn] = useState("")
  const [addYoutubeUrl, setAddYoutubeUrl] = useState("")
  const [addIsActive, setAddIsActive] = useState(true)
  const [addErrors, setAddErrors] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)

  // Edit Stream Dialog State
  const [editingStream, setEditingStream] = useState<LivestreamItemData | null>(null)
  const [editTitleAr, setEditTitleAr] = useState("")
  const [editTitleEn, setEditTitleEn] = useState("")
  const [editYoutubeUrl, setEditYoutubeUrl] = useState("")
  const [editIsActive, setEditIsActive] = useState(true)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  const resetAddForm = () => {
    setAddTitleAr("")
    setAddTitleEn("")
    setAddYoutubeUrl("")
    setAddIsActive(true)
    setAddErrors({})
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAddErrors({})

    const payload = {
      titleAr: addTitleAr,
      titleEn: addTitleEn,
      youtubeUrl: addYoutubeUrl,
      isActive: addIsActive,
    }

    const validation = livestreamFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setAddErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للبث المباشر")
      return
    }

    setIsAdding(true)
    setTimeout(() => {
      const newItem: LivestreamItemData = {
        id: Date.now().toString(),
        titleAr: validation.data.titleAr,
        titleEn: validation.data.titleEn,
        youtubeUrl: validation.data.youtubeUrl,
        isActive: validation.data.isActive,
      }

      setStreams((prev) => [newItem, ...prev])
      toast.success("تم إضافة البث المباشر بنجاح!")
      resetAddForm()
      setIsAddOpen(false)
      setIsAdding(false)
    }, 300)
  }

  const openEditDialog = (stream: LivestreamItemData) => {
    setEditingStream(stream)
    setEditTitleAr(stream.titleAr)
    setEditTitleEn(stream.titleEn)
    setEditYoutubeUrl(stream.youtubeUrl)
    setEditIsActive(stream.isActive)
    setEditErrors({})
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStream) return
    setEditErrors({})

    const payload = {
      titleAr: editTitleAr,
      titleEn: editTitleEn,
      youtubeUrl: editYoutubeUrl,
      isActive: editIsActive,
    }

    const validation = livestreamFormSchema.safeParse(payload)
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString()
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setEditErrors(fieldErrors)
      toast.error("يرجى التأكد من البيانات المدخلة للبث المباشر")
      return
    }

    setIsEditing(true)
    setTimeout(() => {
      setStreams((prev) =>
        prev.map((item) =>
          item.id === editingStream.id
            ? {
                ...item,
                titleAr: validation.data.titleAr,
                titleEn: validation.data.titleEn,
                youtubeUrl: validation.data.youtubeUrl,
                isActive: validation.data.isActive,
              }
            : item
        )
      )
      toast.success("تم تحديث البث المباشر بنجاح!")
      setEditingStream(null)
      setIsEditing(false)
    }, 300)
  }

  const handleDelete = (id: string) => {
    setStreams((prev) => prev.filter((item) => item.id !== id))
    toast.success("تم حذف البث المباشر بنجاح")
  }

  const filteredStreams = streams.filter(
    (item) =>
      item.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.youtubeUrl.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Radio className="text-primary" />
          إدارة البث المباشر
        </CardTitle>

        {/* Add Stream Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" aria-label="إضافة بث جديد">
              <Plus className="ml-2 size-4" />
              إضافة بث جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة بث مباشر جديد</DialogTitle>
              <DialogDescription>
                أدخل عنوان البث باللغتين العربية والإنجليزية ورابط YouTube.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="addTitleAr">عنوان البث (بالعربية) *</Label>
                <Input
                  id="addTitleAr"
                  value={addTitleAr}
                  onChange={(e) => setAddTitleAr(e.target.value)}
                  placeholder="عنوان البث بالعربية..."
                  dir="rtl"
                />
                {addErrors.titleAr && <span className="text-xs text-destructive">{addErrors.titleAr}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="addTitleEn">عنوان البث (بالإنجليزية) *</Label>
                <Input
                  id="addTitleEn"
                  value={addTitleEn}
                  onChange={(e) => setAddTitleEn(e.target.value)}
                  placeholder="عنوان البث بالإنجليزية..."
                  dir="ltr"
                />
                {addErrors.titleEn && <span className="text-xs text-destructive">{addErrors.titleEn}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="addYoutubeUrl">رابط YouTube المباشر *</Label>
                <Input
                  id="addYoutubeUrl"
                  type="url"
                  value={addYoutubeUrl}
                  onChange={(e) => setAddYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  dir="ltr"
                />
                {addErrors.youtubeUrl && (
                  <span className="text-xs text-destructive">{addErrors.youtubeUrl}</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="addIsActive"
                  checked={addIsActive}
                  onCheckedChange={(checked) => setAddIsActive(Boolean(checked))}
                />
                <Label htmlFor="addIsActive" className="cursor-pointer font-medium">
                  بث نشط الآن
                </Label>
              </div>

              <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? <Loader2 className="ml-2 size-4 animate-spin" /> : "إضافة البث"}
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
            placeholder="ابحث عن رابط بث..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          {filteredStreams.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.titleAr}</span>
                  {item.isActive ? (
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 font-semibold">
                      مباشر
                    </span>
                  ) : (
                    <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      متوقف
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{item.titleEn}</span>
              </div>

              <a
                href={item.youtubeUrl}
                className="text-sm text-primary underline truncate max-w-xs"
                target="_blank"
                rel="noreferrer"
              >
                {item.youtubeUrl}
              </a>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="تعديل البث"
                  onClick={() => openEditDialog(item)}
                >
                  <Pencil className="size-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="حذف البث"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* Edit Stream Dialog */}
      {editingStream && (
        <Dialog open={Boolean(editingStream)} onOpenChange={(open) => !open && setEditingStream(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>تعديل البث المباشر</DialogTitle>
              <DialogDescription>
                تعديل بيانات البث باللغتين العربية والإنجليزية ورابط YouTube.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="editTitleAr">عنوان البث (بالعربية) *</Label>
                <Input
                  id="editTitleAr"
                  value={editTitleAr}
                  onChange={(e) => setEditTitleAr(e.target.value)}
                  dir="rtl"
                />
                {editErrors.titleAr && <span className="text-xs text-destructive">{editErrors.titleAr}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="editTitleEn">عنوان البث (بالإنجليزية) *</Label>
                <Input
                  id="editTitleEn"
                  value={editTitleEn}
                  onChange={(e) => setEditTitleEn(e.target.value)}
                  dir="ltr"
                />
                {editErrors.titleEn && <span className="text-xs text-destructive">{editErrors.titleEn}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="editYoutubeUrl">رابط YouTube المباشر *</Label>
                <Input
                  id="editYoutubeUrl"
                  type="url"
                  value={editYoutubeUrl}
                  onChange={(e) => setEditYoutubeUrl(e.target.value)}
                  dir="ltr"
                />
                {editErrors.youtubeUrl && (
                  <span className="text-xs text-destructive">{editErrors.youtubeUrl}</span>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="editIsActive"
                  checked={editIsActive}
                  onCheckedChange={(checked) => setEditIsActive(Boolean(checked))}
                />
                <Label htmlFor="editIsActive" className="cursor-pointer font-medium">
                  بث نشط الآن
                </Label>
              </div>

              <DialogFooter className="mt-4 flex flex-row-reverse sm:flex-row-reverse sm:justify-start gap-2">
                <Button type="submit" disabled={isEditing}>
                  {isEditing ? <Loader2 className="ml-2 size-4 animate-spin" /> : "حفظ التعديلات"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingStream(null)}>
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
