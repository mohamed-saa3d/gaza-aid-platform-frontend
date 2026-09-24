"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { createRegisterSchema, formatRegisterPayload } from "@/lib/validations/auth"
import { http, getErrorMessage, extractFieldErrors } from "@/lib/http"
import { useLocale } from "@/components/locale-provider"

export default function RegisterPage() {
  const router = useRouter()
  const { t } = useLocale()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = createRegisterSchema(t.validation).safeParse({
      name,
      email,
      password,
      confirmPassword: confirmPassword || password,
      agreed,
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
      const payload = formatRegisterPayload(validation.data)
      await http.post("/auth/register", payload)
      toast.success(t.auth.registerButton)
      router.push(`/verify-otp?email=${encodeURIComponent(validation.data.email)}`)
    } catch (error: unknown) {
      const fieldErrs = extractFieldErrors(error)
      if (Object.keys(fieldErrs).length > 0) {
        setErrors(fieldErrs)
      } else {
        const errorMsg = getErrorMessage(error) || t.common.error
        toast.error(errorMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard title={t.auth.registerTitle} description={t.auth.registerDescription}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">{t.auth.fullNameLabel}</Label>
          <Input
            id="name"
            type="text"
            placeholder={t.auth.fullNamePlaceholder}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10"
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

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
          <Label htmlFor="password">{t.auth.passwordLabel}</Label>
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
          <Label htmlFor="confirmPassword">{t.auth.confirmPasswordLabel}</Label>
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

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs font-normal leading-relaxed text-muted-foreground">
            {t.auth.agreeTerms}
          </Label>
        </div>
        {errors.agreed && <p className="text-xs text-destructive">{errors.agreed}</p>}

        <Button type="submit" disabled={!agreed || isSubmitting} className="mt-2 gap-2 rounded-full">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <UserPlus className="size-4" data-icon="inline-start" />
          )}
          {t.auth.registerButton}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          {t.auth.loginButton}
        </Link>
      </p>
    </AuthCard>
  )
}
