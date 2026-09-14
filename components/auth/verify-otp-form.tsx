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

  const {
    control,
    handleSubmit,
    setValue,
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
              onChange={(val) => {
                field.onChange(val)
                setValue("email", email)
              }}
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

        {errors.otp && (
          <p className="text-sm font-medium text-destructive">{errors.otp.message}</p>
        )}

        {apiError && (
          <p className="text-sm font-medium text-destructive">{apiError}</p>
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

      <p className="text-center text-sm text-muted-foreground">
        {isAr ? "لم يصلك الرمز؟ " : "Didn't receive code? "}
        <button type="button" className="font-semibold text-primary hover:underline">
          {isAr ? "إعادة الإرسال" : "Resend"}
        </button>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/register" className="hover:underline">
          {isAr ? "العودة إلى التسجيل" : "Back to Registration"}
        </Link>
      </p>
    </AuthCard>
  )
}
