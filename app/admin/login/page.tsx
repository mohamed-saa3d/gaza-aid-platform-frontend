"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockKeyhole, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { http, getErrorMessage, extractFieldErrors } from "@/lib/http"
import { loginSchema } from "@/lib/validations/auth"
import { useAuth, type UserProfile } from "@/context/auth-context"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = loginSchema.safeParse({ email, password })
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
      const res = await http.post<{ data?: { admin?: UserProfile; user?: UserProfile }; admin?: UserProfile; user?: UserProfile }>('/admin/login', validation.data)
      const responseData = res.data.data || res.data
      const admin = (responseData?.admin || responseData?.user || {
        id: 'admin-id',
        name: email.split('@')[0],
        email,
        role: 'ADMIN' as const,
      }) as UserProfile

      login({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar ?? null,
      }, "admin")

      toast.success('تم تسجيل الدخول إلى لوحة الإدارة بنجاح!')
      router.push('/admin/content')
    } catch (error: unknown) {
      const fieldErrs = extractFieldErrors(error)
      if (Object.keys(fieldErrs).length > 0) {
        setErrors(fieldErrs)
      } else {
        const errorMsg = getErrorMessage(error) || 'فشل تسجيل الدخول إلى لوحة الإدارة'
        toast.error(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard title="تسجيل دخول المسؤول" description="أدخل بيانات حسابك الإداري للوصول إلى لوحة الإدارة">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10"
          />
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-2 gap-2 rounded-full">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <LockKeyhole className="size-4" data-icon="inline-start" />
          )}
          دخول المسؤول
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        العودة إلى صفحة المستخدم؟{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          تسجيل الدخول العام
        </Link>
      </p>
    </AuthCard>
  )
}
