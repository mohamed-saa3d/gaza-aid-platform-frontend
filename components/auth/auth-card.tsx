import Image from "next/image"
import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px-1px)] max-w-md flex-col items-center justify-center px-4 py-12">
      <Image src="/images/logo-mark.png" alt="شعار المؤسسة" width={48} height={48} className="mb-4 size-12 object-contain" />
      <Card className="w-full">
        <CardContent className="flex flex-col gap-6 py-4">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
