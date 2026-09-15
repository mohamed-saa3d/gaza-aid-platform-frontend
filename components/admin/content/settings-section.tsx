"use client"

import * as React from "react"
import { Landmark, Radio, Save } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function SettingsSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <SettingsCard
        title="بيانات التحويل المباشر"
        icon={<Landmark />}
        fields={[
          "رقم التحويل المباشر / المحفظة",
          "رقم آخر",
          "عنوان استلام الدفع",
          "عنوان استلام الدفع الخاص بالرقم الثاني",
        ]}
      />
      <SettingsCard
        title="إعدادات التواصل"
        icon={<Radio />}
        fields={["رقم الهاتف", "البريد الإلكتروني"]}
      />
    </section>
  )
}

function SettingsCard({
  title,
  icon,
  fields,
}: {
  title: string
  icon: React.ReactNode
  fields: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          {fields.map((field, index) => (
            <div key={field} className="flex flex-col gap-2">
              <Label htmlFor={`${title}-${index}`}>{field}</Label>
              <Input
                id={`${title}-${index}`}
                defaultValue={
                  index === 0
                    ? title.includes("تواصل")
                      ? "010 1234 5678"
                      : "010922731005"
                    : undefined
                }
                placeholder={`أدخل ${field}`}
              />
            </div>
          ))}
          <Button className="mt-2 w-full">
            <Save data-icon="inline-start" />
            حفظ التحديثات
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
