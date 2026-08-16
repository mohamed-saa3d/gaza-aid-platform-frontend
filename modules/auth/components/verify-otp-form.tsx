"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { apiClient } from "@/lib/api/client"
import { otpSchema } from "@/modules/auth/schemas/auth.schema"

export function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const payload = { email, otp: code }
    const result = otpSchema.safeParse(payload)

    if (!result.success) {
      return
    }

    setSubmitting(true)

    try {
      await apiClient.post("/auth/verify-email", result.data)
      router.push("/profile")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard
      title="تأكيد رقم الهاتف"
      description={email ? `أدخل رمز التحقق المرسل إلى ${email}` : "أدخل رمز التحقق المرسل إلى هاتفك"}
    >
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit}>
        <InputOTP maxLength={4} value={code} onChange={setCode} containerClassName="justify-center">
          <InputOTPGroup>
            <InputOTPSlot index={0} className="size-12 text-lg" />
            <InputOTPSlot index={1} className="size-12 text-lg" />
            <InputOTPSlot index={2} className="size-12 text-lg" />
            <InputOTPSlot index={3} className="size-12 text-lg" />
          </InputOTPGroup>
        </InputOTP>

        <Button type="submit" disabled={code.length < 4 || submitting} className="w-full gap-2 rounded-full">
          <ShieldCheck className="size-4" data-icon="inline-start" />
          تأكيد
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        لم يصلك الرمز؟{" "}
        <button type="button" className="font-semibold text-primary hover:underline">
          إعادة الإرسال
        </button>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/register" className="hover:underline">
          العودة إلى التسجيل
        </Link>
      </p>
    </AuthCard>
  )
}
