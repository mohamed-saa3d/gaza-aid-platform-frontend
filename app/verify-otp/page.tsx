import { Suspense } from "react"
import { VerifyOtpForm } from "@/modules/auth/components/verify-otp-form"

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  )
}
