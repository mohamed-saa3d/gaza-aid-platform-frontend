"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { http as apiClient, getErrorMessage } from "@/lib/http"
import { useLocale } from "@/components/locale-provider"
import { createOtpSchema, type OtpInput } from "@/lib/validations/auth"

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  const phoneParam = searchParams.get("phone") || ""
  const identifier = emailParam || phoneParam

  const { t } = useLocale()

  const [apiError, setApiError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Cooldown timer state: starts automatically at 60s upon landing
  const [cooldown, setCooldown] = useState(60)

  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(createOtpSchema(t.validation)),
    defaultValues: {
      code: "",
    },
  })

  const codeValue = watch("code") || ""

  async function onSubmit(data: OtpInput) {
    setApiError(null)
    setResendStatus(null)
    try {
      await apiClient.post("/auth/verify-email", {
        email: emailParam,
        otp: data.code,
      })
      toast.success(t.auth.otpConfirm)
      router.push("/profile")
    } catch (err: any) {
      // Clear OTP input for immediate error recovery and re-entry
      setValue("code", "")
      const msg = getErrorMessage(err) || t.common.error
      setApiError(msg)
      toast.error(msg)
    }
  }

  async function handleResend() {
    if (cooldown > 0) {
      toast.error(t.auth.otpResendIn.replace("{seconds}", String(cooldown)))
      return
    }

    const payload = emailParam ? { email: emailParam } : phoneParam ? { phone: phoneParam } : null
    if (!payload) {
      const errorMsg = t.auth.otpMissingContact
      setResendStatus({ type: "error", message: errorMsg })
      toast.error(errorMsg)
      return
    }

    setIsResending(true)
    setResendStatus(null)

    try {
      await apiClient.post("/auth/resend-otp", payload)
      const successMsg = t.auth.otpResend
      setResendStatus({ type: "success", message: successMsg })
      toast.success(successMsg)
      setCooldown(60)
    } catch (err: any) {
      const errorMsg = getErrorMessage(err) || t.common.error
      setResendStatus({ type: "error", message: errorMsg })
      toast.error(errorMsg)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthCard
      title={t.auth.otpTitle}
      description={
        identifier
          ? t.auth.otpDescriptionWithId.replace("{identifier}", identifier)
          : t.auth.otpDescription
      }
    >
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={6}
              value={field.value}
              onChange={field.onChange}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="size-12 text-lg" />
                <InputOTPSlot index={1} className="size-12 text-lg" />
                <InputOTPSlot index={2} className="size-12 text-lg" />
                <InputOTPSlot index={3} className="size-12 text-lg" />
                <InputOTPSlot index={4} className="size-12 text-lg" />
                <InputOTPSlot index={5} className="size-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {!identifier && (
          <p className="text-center text-sm font-medium text-destructive">
            {t.auth.otpMissingContact}
          </p>
        )}

        {errors.code && (
          <p className="text-center text-sm font-medium text-destructive">{errors.code.message}</p>
        )}

        {apiError && (
          <p className="text-center text-sm font-medium text-destructive">{apiError}</p>
        )}

        <Button
          type="submit"
          disabled={codeValue.length < 6 || isSubmitting}
          className="w-full gap-2 rounded-full"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <ShieldCheck className="size-4" data-icon="inline-start" />
          )}
          {t.auth.otpConfirm}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm text-muted-foreground">
          {t.auth.otpNotReceived}{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || cooldown > 0 || !identifier}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {isResending && <Loader2 className="size-3 animate-spin" />}
            {cooldown > 0
              ? t.auth.otpResendIn.replace("{seconds}", String(cooldown))
              : t.auth.otpResend}
          </button>
        </p>

        {resendStatus && (
          <p
            className={`text-center text-sm font-medium ${resendStatus.type === "success"
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-destructive"
              }`}
          >
            {resendStatus.message}
          </p>
        )}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/register" className="hover:underline">
          {t.auth.otpBackToRegister}
        </Link>
      </p>
    </AuthCard>
  )
}
