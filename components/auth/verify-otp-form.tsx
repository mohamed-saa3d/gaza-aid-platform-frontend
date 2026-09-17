"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck, Loader2 } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { http as apiClient } from "@/lib/http"
import { useLocale } from "@/components/locale-provider"
import { otpSchema, type OtpInput } from "@/lib/validations/auth"

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get("email") || ""
  const phoneParam = searchParams.get("phone") || ""
  const identifier = emailParam || phoneParam

  const { locale } = useLocale()
  const isAr = locale === "ar"

  const [apiError, setApiError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: "",
    },
  })

  const codeValue = watch("code") || ""

  async function onSubmit(data: OtpInput) {
    setApiError(null)
    setResendStatus(null)
    try {
      await apiClient.post("/auth/verify-email", data)
      router.push("/profile")
    } catch (err: any) {
      // Clear OTP input for immediate error recovery and re-entry
      setValue("code", "")
      setApiError(
        err.response?.data?.message ||
          (isAr
            ? "حدث خطأ أثناء التحقق، يرجى المحاولة مرة أخرى."
            : "An error occurred during verification. Please try again.")
      )
    }
  }

  async function handleResend() {
    const payload = emailParam ? { email: emailParam } : phoneParam ? { phone: phoneParam } : null

    if (!payload) {
      setResendStatus({
        type: "error",
        message: isAr
          ? "معلومات التواصل مفقودة. يرجى العودة للتسجيل."
          : "Contact information is missing. Please return to registration.",
      })
      return
    }

    setIsResending(true)
    setResendStatus(null)

    try {
      await apiClient.post("/auth/resend-otp", payload)
      setResendStatus({
        type: "success",
        message: isAr ? "تم إعادة إرسال رمز التحقق بنجاح." : "Verification code resent successfully.",
      })
    } catch (err: any) {
      setResendStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          (isAr ? "فشل إعادة إرسال الرمز. حاول مرة أخرى." : "Failed to resend verification code. Try again."),
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthCard
      title={isAr ? "تأكيد الحساب" : "Verify Account"}
      description={
        identifier
          ? isAr
            ? `أدخل رمز التحقق المرسل إلى ${identifier}`
            : `Enter the verification code sent to ${identifier}`
          : isAr
          ? "أدخل رمز التحقق المرسل إلى بريدك/هاتفك"
          : "Enter the verification code sent to your email/phone"
      }
    >
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <InputOTP
              maxLength={4}
              value={field.value}
              onChange={field.onChange}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="size-12 text-lg" />
                <InputOTPSlot index={1} className="size-12 text-lg" />
                <InputOTPSlot index={2} className="size-12 text-lg" />
                <InputOTPSlot index={3} className="size-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>
          )}
        />

        {!identifier && (
          <p className="text-center text-sm font-medium text-destructive">
            {isAr
              ? "معلومات التواصل مفقودة أو غير صحيحة. يرجى البدء من جديد من صفحة التسجيل."
              : "Contact information is missing or invalid. Please restart registration."}
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
          disabled={codeValue.length < 4 || isSubmitting}
          className="w-full gap-2 rounded-full"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" data-icon="inline-start" />
          ) : (
            <ShieldCheck className="size-4" data-icon="inline-start" />
          )}
          {isAr ? "تأكيد" : "Confirm"}
        </Button>
      </form>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-sm text-muted-foreground">
          {isAr ? "لم يصلك الرمز؟ " : "Didn't receive code? "}
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || !identifier}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {isResending && <Loader2 className="size-3 animate-spin" />}
            {isAr ? "إعادة الإرسال" : "Resend"}
          </button>
        </p>

        {resendStatus && (
          <p
            className={`text-center text-sm font-medium ${
              resendStatus.type === "success"
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
          {isAr ? "العودة إلى التسجيل" : "Back to Registration"}
        </Link>
      </p>
    </AuthCard>
  )
}
