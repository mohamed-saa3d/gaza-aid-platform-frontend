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
import { apiClient } from "@/lib/api/client"
import { useLocale } from "@/components/locale-provider"
import { otpSchema, type OtpInput } from "@/lib/validations/auth"

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || searchParams.get("phone") || ""
  const { locale } = useLocale()
  const isAr = locale === "ar"

  const [apiError, setApiError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)
  const [resendStatus, setResendStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  })

  const otpValue = watch("otp") || ""

  async function onSubmit(data: OtpInput) {
    setApiError(null)
    setResendStatus(null)
    try {
      await apiClient.post("/auth/verify-email", data)
      router.push("/profile")
    } catch (err: any) {
      setApiError(
        err.response?.data?.message ||
          (isAr
            ? "حدث خطأ أثناء التحقق، يرجى المحاولة مرة أخرى."
            : "An error occurred during verification. Please try again.")
      )
    }
  }

  async function handleResend() {
    if (!email) {
      setResendStatus({
        type: "error",
        message: isAr
          ? "البريد الإلكتروني مفقود. يرجى العودة للتسجيل."
          : "Email parameter is missing. Please return to registration.",
      })
      return
    }

    setIsResending(true)
    setResendStatus(null)

    try {
      await apiClient.post("/auth/resend-otp", { email })
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
        email
          ? isAr
            ? `أدخل رمز التحقق المرسل إلى ${email}`
            : `Enter the verification code sent to ${email}`
          : isAr
          ? "أدخل رمز التحقق المرسل إلى بريدك/هاتفك"
          : "Enter the verification code sent to your email/phone"
      }
    >
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="otp"
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

        {errors.email && (
          <p className="text-center text-sm font-medium text-destructive">
            {isAr
              ? "البريد الإلكتروني مفقود أو غير صحيح. يرجى البدء من جديد من صفحة التسجيل."
              : "Email parameter is missing or invalid. Please restart registration."}
          </p>
        )}

        {errors.otp && (
          <p className="text-center text-sm font-medium text-destructive">{errors.otp.message}</p>
        )}

        {apiError && (
          <p className="text-center text-sm font-medium text-destructive">{apiError}</p>
        )}

        <Button
          type="submit"
          disabled={otpValue.length < 4 || isSubmitting}
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
            disabled={isResending || !email}
            className="inline-flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50"
          >
            {isResending && <Loader2 className="size-3 animate-spin" />}
            {isAr ? "إعادة الإرسال" : "Resend"}
          </button>
        </p>

        {resendStatus && (
          <p
            className={`text-center text-sm font-medium ${
              resendStatus.type === "success" ? "text-emerald-600" : "text-destructive"
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
