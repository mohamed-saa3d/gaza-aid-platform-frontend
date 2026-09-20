"use client"

import Image from "next/image"
import { LogOut, Pencil, Settings, Star } from "lucide-react"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"
import { getErrorMessage, http } from "@/lib/http"
import { toast } from "sonner"

export function ProfileHeader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { user, logout, updateUser } = useAuth()
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const displayName = user?.name || "مستخدم"
  const displayRole = user?.role === "SUPER_ADMIN" ? "مدير النظام" : user?.role === "ADMIN" ? "مدير" : "مستخدم"

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      setIsUploadingAvatar(true)
      const res = await http.patch<{ data?: { avatar?: string }; user?: { avatar?: string } }>("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const nextAvatar = res.data.data?.avatar || res.data.user?.avatar || URL.createObjectURL(file)
      updateUser({ avatar: nextAvatar })
      toast.success("تم تحديث الصورة الشخصية بنجاح")
    } catch (error) {
      toast.error(getErrorMessage(error) || "فشل تحديث الصورة الشخصية")
    } finally {
      setIsUploadingAvatar(false)
      event.target.value = ""
    }
  }

  async function handleLogout() {
    await logout("user")
    router.push("/login")
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-start">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="relative">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group relative block overflow-hidden rounded-full border-4 border-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="تغيير الصورة الشخصية"
            disabled={isUploadingAvatar}
          >
            <div className="relative size-20 overflow-hidden rounded-full">
              <Image src={user?.avatar || "/placeholder.svg"} alt={displayName} fill className="object-cover" unoptimized />
            </div>
            <span className="absolute inset-0 flex items-center justify-center bg-black/35 text-white opacity-0 transition-opacity group-hover:opacity-100">
              {isUploadingAvatar ? "..." : <Pencil className="size-4" />}
            </span>
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">{displayName}</h1>
          <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
            <Badge variant="secondary" className="rounded-full">
              {displayRole}
            </Badge>
            {user?.email ? (
              <span className="text-sm text-muted-foreground">{user.email}</span>
            ) : (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                  4.9 (2,500)
                </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2 rounded-full">
          <Settings className="size-4" aria-hidden="true" />
          إعدادات الحساب
        </Button>
        <Button variant="outline" onClick={handleLogout} className="gap-2 rounded-full text-destructive hover:text-destructive">
          <LogOut className="size-4" aria-hidden="true" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  )
}
