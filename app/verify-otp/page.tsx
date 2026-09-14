import { Suspense } from "react"
import { VerifyOtpForm } from "@/components/auth/verify-otp-form"
import { Card, CardContent } from "@/components/ui/card"

function VerifyOtpCardSkeleton() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px-1px)] w-full max-w-xs sm:max-w-md flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 size-12 animate-pulse rounded-full bg-muted" />
      <Card className="w-full">
        <CardContent className="flex flex-col gap-6 py-4">
          <div className="flex flex-col items-center gap-2">
            <div className="h-7 w-36 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-60 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="flex justify-center gap-2 py-2">
            <div className="size-12 animate-pulse rounded-md bg-muted" />
            <div className="size-12 animate-pulse rounded-md bg-muted" />
            <div className="size-12 animate-pulse rounded-md bg-muted" />
            <div className="size-12 animate-pulse rounded-md bg-muted" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
          <div className="flex flex-col items-center gap-2">
            <div className="h-4 w-44 animate-pulse rounded-md bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<VerifyOtpCardSkeleton />}>
      <VerifyOtpForm />
    </Suspense>
  )
}
