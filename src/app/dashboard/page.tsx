import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isClerkConfigured } from "@/lib/clerk"
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DASHBOARD_FEATURES } from "@/lib/features"

export default async function DashboardHubPage() {
  if (!isClerkConfigured) {
    redirect("/")
  }

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const displayName = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "there"

  const activeFeatures = DASHBOARD_FEATURES.filter((f) => f.status === "active")
  const comingFeatures = DASHBOARD_FEATURES.filter((f) => f.status === "coming-soon")

  return (
    <div className="space-y-8">
      <WelcomeBanner userName={displayName} />

      <div>
        <h2 className="mb-4 font-heading text-base font-semibold text-[#111827]">Your Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeFeatures.map((feature) => (
            <DashboardCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-heading text-base font-semibold text-[#111827]">Coming Soon</h2>
          <span className="rounded-full bg-[#3D2BFF]/10 px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
            Early access
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comingFeatures.map((feature) => (
            <DashboardCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </div>
  )
}
