'use client'

import { Mail, Send, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const stats = { totalSubscribers: 1240 }

export default function NewsletterPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">التواصل مع المجتمع</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">إرسال النشرة البريدية</h1>
        <p className="mt-2 text-muted-foreground">أرسل آخر الأخبار والتحديثات إلى مشتركي المنصة.</p>
      </div>

      <Card className="max-w-xs">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">عدد المشتركين الإجمالي</p>
            <p className="font-heading text-3xl font-bold text-primary">
              {stats.totalSubscribers.toLocaleString('ar-EG')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="text-primary" />
            إرسال نشرة بريدية جديدة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex max-w-3xl flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="subject">عنوان الرسالة</Label>
              <Input id="subject" placeholder="أدخل عنوان النشرة هنا..." />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">محتوى الرسالة</Label>
              <Textarea
                id="message"
                className="min-h-48"
                placeholder="اكتب تفاصيل الرسالة التي سيتم إرسالها لكافة المشتركين..."
              />
            </div>
            <Button className="w-fit">
              <Send className="ml-2 size-4" />
              إرسال النشرة
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
  