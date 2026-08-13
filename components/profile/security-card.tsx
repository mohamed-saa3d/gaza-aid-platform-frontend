"use client"

import { useState } from "react"
import { KeyRound } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function SecurityCard() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <KeyRound className="size-4" />
          </div>
          <CardTitle className="font-heading text-lg">تغيير كلمة المرور</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="current-password">كلمة المرور الحالية</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="********"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="rounded-full">
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
