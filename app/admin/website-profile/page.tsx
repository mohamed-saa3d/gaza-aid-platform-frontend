import { WebsiteProfileSection } from "@/components/admin/website-profile/website-profile-section"

export default function WebsiteProfilePage() {
  return (
    <div dir="rtl" className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">إدارة المنصة</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">ملف الموقع</h1>
        <p className="mt-2 text-muted-foreground">
          تحكم في اسم الموقع وشعاره كما يظهران للزوار في ترويسة الموقع وتذييله.
        </p>
      </div>

      <WebsiteProfileSection />
    </div>
  )
}
