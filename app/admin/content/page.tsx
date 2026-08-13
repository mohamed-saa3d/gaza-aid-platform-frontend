'use client'

import Image from 'next/image'
import { Pencil, Plus, Search, Trash2, Radio, FolderKanban, Newspaper, Landmark, Save } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

const news = [
  { id: 1, title: 'توزيع السلال الغذائية', description: 'مبادرة توزيع السلال الغذائية على الأسر الأكثر احتياجاً.', image: '/images/news-food-distribution.png' },
  { id: 2, title: 'إفطار صائم في رمضان', description: 'تستمر مبادراتنا في دعم الصائمين في مختلف المناطق.', image: '/images/news-featured-winter.png' },
  { id: 3, title: 'حملة الشتاء الدافئ', description: 'ساهم معنا لنقدم الدفء للأسر المحتاجة هذا الشتاء.', image: '/images/news-mobile-clinic.png' },
]
const projects = [
  { id: 1, title: 'تجهيز فصل دراسي', targetAmount: '180,000', collectedAmount: '75,000', progress: 42, image: '/images/project-education.png' },
  { id: 2, title: 'حفر بئر ماء ارتوازي', targetAmount: '250,000', collectedAmount: '120,000', progress: 48, image: '/images/project-well.png' },
  { id: 3, title: 'بناء مسجد الرحمن', targetAmount: '1,500,000', collectedAmount: '850,000', progress: 56, image: '/images/project-shelter.png' },
]
const liveStreams = [
  { id: 1, title: 'البث المباشر - حفل افتتاح مشروع بئر الرحمة', youtubeUrl: 'https://www.youtube.com/live/abc123' },
  { id: 2, title: 'البث المباشر - توزيع كراتين رمضان', youtubeUrl: 'https://www.youtube.com/live/def456' },
  { id: 3, title: 'البث المباشر - محاضرة عن فضل الصدقة', youtubeUrl: 'https://www.youtube.com/live/ghi789' },
]
function SearchBox({ placeholder }: { placeholder: string }) { return <div className="relative max-w-xs"><Search className="absolute right-3 top-2.5 size-4 text-muted-foreground" /><Input className="pr-9" placeholder={placeholder} /></div> }
function Actions() { return <div className="flex items-center gap-1"><Button variant="ghost" size="icon-sm" aria-label="تعديل"><Pencil className="text-primary" /></Button><Button variant="ghost" size="icon-sm" aria-label="حذف"><Trash2 className="text-destructive" /></Button></div> }

export default function ContentPage() {
  return <div className="flex flex-col gap-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-primary">إدارة المنصة</p><h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">تعديل المحتوى والبيانات</h1><p className="mt-2 text-muted-foreground">أدر الأخبار والمشاريع والبث المباشر من مكان واحد.</p></div><Button><Plus data-icon="inline-start" />إضافة محتوى</Button></div>
    <section className="grid gap-6 xl:grid-cols-2">
      <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Newspaper className="text-primary" />إدارة الأخبار</CardTitle><Button variant="ghost" size="icon-sm"><Plus /></Button></CardHeader><CardContent className="flex flex-col gap-4"><SearchBox placeholder="ابحث عن خبر..." /><div className="grid gap-4 md:grid-cols-3">{news.map(item => <article key={item.id} className="overflow-hidden rounded-lg border"><div className="relative h-28"><Image src={item.image} alt={item.title} fill className="object-cover" /></div><div className="flex flex-col gap-2 p-3"><div className="flex items-center justify-between gap-2"><h3 className="text-sm font-bold">{item.title}</h3><Actions /></div><p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{item.description}</p></div></article>)}</div></CardContent></Card>
      <Card><CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><FolderKanban className="text-primary" />إدارة المشاريع</CardTitle><Button variant="ghost" size="icon-sm"><Plus /></Button></CardHeader><CardContent className="flex flex-col gap-4"><div className="flex flex-wrap gap-3"><SearchBox placeholder="ابحث عن مشروع..." /><Input className="max-w-xs" placeholder="حدد تصنيف المشروع" /></div><div className="flex flex-col gap-3">{projects.map(item => <article key={item.id} className="flex gap-3 rounded-lg border p-3"><Image src={item.image} alt={item.title} width={116} height={88} className="rounded-md object-cover" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="font-bold">{item.title}</h3><p className="mt-1 text-xs text-muted-foreground">المستهدف: {item.targetAmount} ر.س · تم جمع: {item.collectedAmount} ر.س</p></div><Actions /></div><Progress value={item.progress} className="mt-3 h-2" /><p className="mt-1 text-xs text-primary">{item.progress}% مكتمل</p></div></article>)}</div></CardContent></Card>
      <Card className="xl:col-span-2"><CardHeader className="flex-row items-center justify-between"><CardTitle className="flex items-center gap-2"><Radio className="text-primary" />إدارة البث المباشر</CardTitle><Button variant="ghost" size="icon-sm"><Plus /></Button></CardHeader><CardContent className="flex flex-col gap-4"><SearchBox placeholder="ابحث عن رابط بث..." /><div className="flex flex-col gap-2">{liveStreams.map(item => <div key={item.id} className="flex flex-wrap items-center gap-4 rounded-lg border px-4 py-3"><span className="min-w-64 flex-1 font-medium">{item.title}</span><a href={item.youtubeUrl} className="text-sm text-primary underline" target="_blank">{item.youtubeUrl}</a><Actions /></div>)}</div></CardContent></Card>
    </section>
    <section className="grid gap-6 lg:grid-cols-2"><SettingsCard title="بيانات التحويل المباشر" icon={<Landmark />} fields={['رقم التحويل المباشر / المحفظة', 'رقم آخر', 'عنوان استلام الدفع', 'عنوان استلام الدفع الخاص بالرقم الثاني']} /><SettingsCard title="إعدادات التواصل" icon={<Radio />} fields={['رقم الهاتف', 'البريد الإلكتروني']} /></section>
  </div>
}
function SettingsCard({ title, icon, fields }: { title: string; icon: React.ReactNode; fields: string[] }) { return <Card><CardHeader><CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle></CardHeader><CardContent><form className="flex flex-col gap-4">{fields.map((field, index) => <div key={field} className="flex flex-col gap-2"><Label htmlFor={`${title}-${index}`}>{field}</Label><Input id={`${title}-${index}`} defaultValue={index === 0 ? (title.includes('تواصل') ? '010 1234 5678' : '010922731005') : undefined} placeholder={`أدخل ${field}`} /></div>)}<Button className="mt-2 w-full"><Save data-icon="inline-start" />حفظ التحديثات</Button></form></CardContent></Card> }
