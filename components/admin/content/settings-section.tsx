"use client"

import * as React from "react"
import { Radio, Save } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function SettingsSection() {
  return (
    <section className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="text-primary" />
            إعدادات التواصل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input id="phone" defaultValue="010 1234 5678" placeholder="أدخل رقم الهاتف" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input id="email" type="email" defaultValue="support@charity.org" placeholder="أدخل البريد الإلكتروني" />
            </div>
            <Button className="mt-2 w-full">
              <Save className="ml-2 size-4" />
              حفظ التحديثات
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
