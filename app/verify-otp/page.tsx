import { Suspense } from "react"
import { VerifyOtpForm } from "@/components/auth/verify-otp-form"

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  )
}
