"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { UserPlus } from "lucide-react"
import { AuthCard } from "@/components/auth/auth-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { registerSchema } from "@/lib/validations/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreed, setAgreed] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const result = registerSchema.safeParse({ name, email, password, agreed })

    if (!result.success) return

    router.push(`/verify-otp?email=${encodeURIComponent(result.data.email)}`)
  }

  return (
    <AuthCard title="تسجيل جديد" description="أنشئ حسابك لمتابعة تبرعاتك ومشاريعك">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">الاسم الكامل</Label>
          <Input
            id="name"
            type="text"
            placeholder="محمد سعد"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10"
          />
        </div>


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
          <Label htmlFor="password">كلمة المرور</Label>
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

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-xs font-normal leading-relaxed text-muted-foreground">
            أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمؤسسة
          </Label>
        </div>

        <Button type="submit" disabled={!agreed} className="mt-2 gap-2 rounded-full">
          <UserPlus className="size-4" data-icon="inline-start" />
          إنشاء الحساب
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          تسجيل الدخول
        </Link>
      </p>
    </AuthCard>
  )
}
