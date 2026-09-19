"use client"

import { Suspense, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { LockKeyhole, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPasswordSchema } from "@/lib/validations/auth"
import { http, getErrorMessage } from "@/lib/http"

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="إعادة تعيين كلمة المرور" description="جاري تجهيز رابط إعادة التعيين...">
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            جاري التحميل...
          </div>
        </AuthCard>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenParam = searchParams.get("token") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = resetPasswordSchema.safeParse({
      token: tokenParam,
      password,
      confirmPassword,
    })

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
      await http.post("/auth/reset-password", {
        otp: validation.data.token,
        newPassword: validation.data.password,
      })
      toast.success("تم إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.")
      router.push("/login")
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error) || "فشل إعادة تعيين كلمة المرور، قد يكون الرابط منتهي الصلاحية"
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard title="إعادة تعيين كلمة المرور" description="أدخل كلمة المرور الجديدة للحساب.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {!tokenParam && (
          <p className="text-xs font-semibold text-destructive text-center">
            رمز إرجاع كلمة المرور غير موجود في الرابط.
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">كلمة المرور الجديدة</Label>
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-10"
          />
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting || !tokenParam} className="mt-2 gap-2 rounded-full">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <LockKeyhole className="size-4" data-icon="inline-start" />
          )}
          حفظ كلمة المرور الجديدة
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-2">
        <Link href="/login" className="font-semibold text-primary hover:underline">
          العودة لتسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  )
}
