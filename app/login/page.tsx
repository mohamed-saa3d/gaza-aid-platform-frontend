"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { http, getErrorMessage, extractFieldErrors } from "@/lib/http"
import { createLoginSchema } from "@/lib/validations/auth"
import { useAuth, type UserProfile } from "@/context/auth-context"
import { useLocale } from "@/components/locale-provider"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { t } = useLocale()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = createLoginSchema(t.validation).safeParse({ email, password })
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
      const res = await http.post<{ user: UserProfile; data?: { user: UserProfile } }>("/auth/login", validation.data)

      const responseData = res.data.data || res.data
      const user = responseData.user || {
        id: "user-id",
        name: email.split("@")[0],
        email,
        role: "DONOR",
      }

      login(user, "user")
      toast.success(t.auth.loginButton)

      if (user.role === "ADMIN") {
        router.push("/admin/content")
      } else {
        router.push("/profile")
      }
    } catch (error: unknown) {
      const fieldErrs = extractFieldErrors(error)
      if (Object.keys(fieldErrs).length > 0) {
        setErrors(fieldErrs)
      } else {
        const errorMsg = getErrorMessage(error) || t.validation.passwordRequired
        toast.error(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard title={t.auth.loginTitle} description={t.auth.loginDescription}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">{t.auth.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.auth.passwordLabel}</Label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              {t.auth.forgotPasswordLink}
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
            <LogIn className="size-4" data-icon="inline-start" />
          )}
          {t.auth.loginButton}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.noAccount}{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          {t.auth.registerNow}
        </Link>
      </p>
    </AuthCard>
  )
}
