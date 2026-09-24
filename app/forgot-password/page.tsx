"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { KeyRound, Loader2, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createForgotPasswordSchema } from "@/lib/validations/auth"
import { http, getErrorMessage } from "@/lib/http"
import { useLocale } from "@/components/locale-provider"

export default function ForgotPasswordPage() {
  const { t } = useLocale()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrors({})

    const validation = createForgotPasswordSchema(t.validation).safeParse({ email })
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
      await http.post("/auth/forgot-password", validation.data)
      setIsSent(true)
      toast.success(t.auth.forgotSendButton)
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error) || t.common.error
      toast.error(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthCard
      title={t.auth.forgotTitle}
      description={t.auth.forgotDescription}
    >
      {isSent ? (
        <div className="flex flex-col items-center gap-4 text-center py-4">
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <KeyRound className="size-8" />
          </div>
          <p className="text-sm font-medium text-foreground">
            {t.auth.forgotSentTo} <span className="font-bold dir-ltr">{email}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {t.auth.forgotCheckInbox}
          </p>
          <Link href="/login" className="mt-2 text-sm font-semibold text-primary hover:underline">
            {t.auth.resetBackToLogin}
          </Link>
        </div>
      ) : (
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

          <Button type="submit" disabled={isSubmitting} className="mt-2 gap-2 rounded-full">
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
            ) : (
              <KeyRound className="size-4" data-icon="inline-start" />
            )}
            {t.auth.forgotSendButton}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-2">
            {t.auth.forgotRemembered}{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
              {t.auth.loginButton} <ArrowRight className="size-3" />
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  )
}
