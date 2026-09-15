"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    router.push("/profile")
  }

  return (
    <AuthCard title="تسجيل الدخول" description="أدخل بيانات حسابك للوصول إلى ملفك الشخصي">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <Link href="/register" className="text-xs font-medium text-primary hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10"
          />
        </div>

        <Button type="submit" className="mt-2 gap-2 rounded-full">
          <LogIn className="size-4" data-icon="inline-start" />
          تسجيل الدخول
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          سجل الآن
        </Link>
      </p>
    </AuthCard>
  )
}
