import * as React from "react"
import { CreateProjectDialog } from "@/components/admin/projects/create-project-dialog"
import { NewsSection } from "@/components/admin/news/news-section"
import { ProjectsSection } from "@/components/admin/projects/projects-section"
import { LivestreamsSection } from "@/components/admin/livestreams/livestreams-section"
import { FaqsSection } from "@/components/admin/faqs/faqs-section"
import { SettingsSection } from "@/components/admin/settings/settings-section"

export default function ContentPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">إدارة المنصة</p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">
            تعديل المحتوى والبيانات
          </h1>
          <p className="mt-2 text-muted-foreground">
            أدر الأخبار والمشاريع والبث المباشر والأسئلة الشائعة من مكان واحد.
          </p>
        </div>

        <CreateProjectDialog />
      </div>

      {/* Main Grid Sections */}
      <section className="grid gap-6 xl:grid-cols-2">
        <NewsSection />
        <ProjectsSection />
        <LivestreamsSection />
        <FaqsSection />
      </section>

      {/* Site Settings Section */}
      <SettingsSection />
    </div>
  )
}
