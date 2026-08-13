import { Home, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ProfileHeader } from "@/components/profile/profile-header"
import { NotificationsCard } from "@/components/profile/notifications-card"
import { WalletCard } from "@/components/profile/wallet-card"
import { MonthlyDonationCard } from "@/components/profile/monthly-donation-card"
import { DonationHistoryList } from "@/components/profile/donation-history-list"
import { MyProjectsGrid } from "@/components/profile/my-projects-grid"
import { SecurityCard } from "@/components/profile/security-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="flex items-center gap-1 hover:text-foreground">
          <Home className="size-4" />
          <span>الرئيسية</span>
        </Link>
        <ChevronLeft className="size-4 ltr:rotate-180" />
        <span className="font-medium text-foreground">الملف الشخصي</span>
      </nav>

      <div className="mb-8">
        <ProfileHeader />
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-6">
          <TabsTrigger value="history">سجل التبرعات</TabsTrigger>
          <TabsTrigger value="projects">مشاريعي</TabsTrigger>
          <TabsTrigger value="settings">إعدادات الحساب</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <DonationHistoryList />
        </TabsContent>

        <TabsContent value="projects">
          <MyProjectsGrid />
        </TabsContent>

        <TabsContent value="settings" className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <NotificationsCard />
            <WalletCard />
            <MonthlyDonationCard />
          </div>
          <SecurityCard />
        </TabsContent>
      </Tabs>
    </main>
  )
}
