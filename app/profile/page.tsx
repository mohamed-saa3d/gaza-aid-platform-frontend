"use client"

import { Loader2 } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { useLocale } from "@/components/locale-provider"
import { ProfileHeader } from "@/components/profile/profile-header"
import { NotificationsCard } from "@/components/profile/notifications-card"
import { WalletCard } from "@/components/profile/wallet-card"
import { MonthlyDonationCard } from "@/components/profile/monthly-donation-card"
import { DonationHistoryList } from "@/components/profile/donation-history-list"
import { MyProjectsGrid } from "@/components/profile/my-projects-grid"
import { SecurityCard } from "@/components/profile/security-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/auth-context"
import { GuestProfilePrompt } from "@/components/profile/guest-profile-prompt"

export default function ProfilePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const { t } = useLocale()

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
          {t.profile.loading}
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <GuestProfilePrompt />
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb label="profile" />

      <div className="mb-8">
        <ProfileHeader />
      </div>

      <Tabs defaultValue="settings">
        <TabsList className="mb-6">
          <TabsTrigger value="history">{t.profile.tabHistory}</TabsTrigger>
          <TabsTrigger value="projects">{t.profile.tabProjects}</TabsTrigger>
          <TabsTrigger value="settings">{t.profile.tabSettings}</TabsTrigger>
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
