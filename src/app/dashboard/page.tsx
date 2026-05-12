import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { isClerkConfigured } from "@/lib/clerk"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"
import { getMonthlyUsage, MONTHLY_LIMIT } from "@/lib/user-usage"
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner"
import { DashboardCard } from "@/components/dashboard/DashboardCard"
import { DASHBOARD_FEATURES } from "@/lib/features"

interface RecentEntry {
  id: string
  title: string
  created_at: string
  language: string
}

async function getRecentJDs(userId: string): Promise<RecentEntry[]> {
  try {
    const supabase = await getAuthenticatedSupabase()
    if (!supabase) return []
    const { data } = await supabase
      .from("jd_library")
      .select("id, title, created_at, language")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(3)
    return data || []
  } catch {
    return []
  }
}

export default async function DashboardHubPage() {
  if (!isClerkConfigured) redirect("/")

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const displayName = user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "there"

  const [usage, recentJDs] = await Promise.all([
    getMonthlyUsage(user.id).catch(() => ({ used: 0, limit: MONTHLY_LIMIT })),
    getRecentJDs(user.id),
  ])

  const activeFeatures = DASHBOARD_FEATURES.filter((f) => f.status === "active")
  const comingFeatures = DASHBOARD_FEATURES.filter((f) => f.status === "coming-soon")

  const usagePct = Math.min((usage.used / usage.limit) * 100, 100)
  const usageColor =
    usage.used >= usage.limit ? "bg-[#FF5C3A]" : usagePct >= 80 ? "bg-[#FFBD2E]" : "bg-[#3D2BFF]"

  return (
    <div className="space-y-8">
      <WelcomeBanner userName={displayName} />

      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/generate"
          className="flex items-center gap-3 rounded-xl border border-[#EAE8FF] bg-white p-4 transition-all hover:border-[#3D2BFF]/30 hover:shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0EEFF]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#111827]">New Generation</p>
            <p className="text-xs text-[#6b7280]">Create a job description</p>
          </div>
        </Link>

        <div className="rounded-xl border border-[#EAE8FF] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#111827]">Monthly Usage</p>
            <span className="text-xs text-[#6b7280]">{usage.used} / {usage.limit}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EAE8FF]">
            <div className={`h-full rounded-full transition-all ${usageColor}`} style={{ width: `${usagePct}%` }} />
          </div>
          <p className="mt-1 text-xs text-[#6b7280]">
            {usage.limit - usage.used} generations remaining
          </p>
        </div>

        <div className="rounded-xl border border-[#EAE8FF] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0EEFF]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6" />
                <path d="m9 15 3-3 3 3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Saved JDs</p>
              <p className="text-xs text-[#6b7280]">{recentJDs.length} total</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-base font-semibold text-[#111827]">Recent JDs</h2>
          {recentJDs.length > 0 && (
            <Link href="/dashboard/library" className="text-xs font-medium text-[#3D2BFF] hover:text-[#3525E0]">
              View all
            </Link>
          )}
        </div>
        {recentJDs.length > 0 ? (
          <div className="space-y-2">
            {recentJDs.map((jd) => (
              <Link
                key={jd.id}
                href={`/dashboard/library/${jd.id}`}
                className="flex items-center justify-between rounded-xl border border-[#EAE8FF] bg-white px-4 py-3 transition-all hover:border-[#3D2BFF]/30 hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#111827]">{jd.title}</p>
                  <p className="text-xs text-[#6b7280]">
                    {new Date(jd.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="ml-3 shrink-0 rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
                  {jd.language === "both" ? "AR/EN" : jd.language === "arabic" ? "AR" : "EN"}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#EAE8FF] bg-white/50 px-4 py-8 text-center">
            <p className="text-sm text-[#9ca3af]">No saved JDs yet</p>
            <Link
              href="/dashboard/generate"
              className="mt-2 inline-block text-xs font-medium text-[#3D2BFF] hover:text-[#3525E0]"
            >
              Generate your first JD
            </Link>
          </div>
        )}
      </div>

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
