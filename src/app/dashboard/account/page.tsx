import { currentUser, auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isClerkConfigured } from "@/lib/clerk"
import { ensureUser, isSupabaseConfigured } from "@/lib/supabase/users"
import { getMonthlyUsage, MONTHLY_LIMIT } from "@/lib/user-usage"
import { PLANS, getPlanLimit, getPlanPrice, getUserPlan, isClerkBillingEnabled } from "@/lib/payments/plans"
import { UpgradeButton } from "@/components/app/UpgradeButton"
import { SignOutButton } from "@/components/app/SignOutButton"

function daysLeftInMonth(): number {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return Math.max(0, Math.ceil((lastDay.getTime() - now.getTime()) / 86400000))
}

function PlanBadge({ plan }: { plan: string }) {
  if (plan === "free") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-[#3D2BFF]/20 bg-[#F0EEFF] px-2.5 py-0.5 text-[11px] font-medium text-[#3D2BFF]">
        Free
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#2E7D32]/20 bg-[#E8F5E9] px-2.5 py-0.5 text-[11px] font-medium text-[#2E7D32]">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  )
}

export default async function AccountPage() {
  if (!isClerkConfigured) redirect("/")

  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null
  const hasImage = clerkUser.imageUrl?.startsWith("http")

  if (isSupabaseConfigured()) {
    await ensureUser(clerkUser.id, email)
  }

  const { has } = await auth()
  const plan = getUserPlan(has)
  const isActivePlan = plan !== "free"

  const { used, limit } = await getMonthlyUsage(clerkUser.id)
  const planLimit = getPlanLimit(plan)
  const effectiveLimit = typeof planLimit === "number" ? planLimit : limit
  const isUnlimited = planLimit === "unlimited"
  const usagePercent = isUnlimited ? 0 : Math.min((used / effectiveLimit) * 100, 100)

  const clerkBillingEnabled = isClerkBillingEnabled()

  const joinDate = clerkUser.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(clerkUser.createdAt))
    : null

  const daysLeft = daysLeftInMonth()

  function getUpgradeOptions() {
    switch (plan) {
      case "free":
        return PLANS
      case "starter":
        return PLANS.filter((p) => p.id === "pro" || p.id === "team")
      case "pro":
        return PLANS.filter((p) => p.id === "team")
      default:
        return []
    }
  }

  const upgradeOptions = getUpgradeOptions()

  const initials = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).map((n) => n?.charAt(0)).join("").toUpperCase() || "?"

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-[#F0EEFF] text-sm font-bold text-[#3D2BFF]">
          {hasImage ? (
            <img src={clerkUser.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-heading text-xl font-bold text-[#111827]">
              {clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ""}` : "Account"}
            </h1>
            <PlanBadge plan={plan} />
          </div>
          <p className="mt-0.5 text-sm text-[#6b7280]">
            {email || "Manage your account settings and plan."}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Plan Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan */}
          <div className="rounded-xl border border-[#EAE8FF] bg-white">
            <div className="flex items-center justify-between border-b border-[#EAE8FF]/60 px-6 py-4">
              <h2 className="font-heading text-sm font-semibold text-[#111827]">Current Plan</h2>
              <PlanBadge plan={plan} />
            </div>
            <div className="p-6">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#111827]">{getPlanPrice(plan)}</span>
                {!isActivePlan && (
                  <span className="text-sm text-[#9ca3af]">— {effectiveLimit} JDs / month</span>
                )}
              </div>

              <div className="mt-6 space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className={used >= effectiveLimit && !isUnlimited ? "font-semibold text-[#FF5C3A]" : "text-[#6b7280]"}>
                    {isUnlimited ? (
                      <span className="font-medium text-[#3D2BFF]">Unlimited JDs</span>
                    ) : (
                      `${used} of ${effectiveLimit} JDs used this month`
                    )}
                  </span>
                  {!isUnlimited && (
                    <span className="font-medium text-[#111827]">{Math.round(usagePercent)}%</span>
                  )}
                </div>
                {!isUnlimited && (
                  <div className="h-2 overflow-hidden rounded-full bg-[#EAE8FF]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        used >= effectiveLimit ? "bg-[#FF5C3A]" : usagePercent >= 80 ? "bg-[#FFBD2E]" : "bg-[#3D2BFF]"
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                )}
                {daysLeft > 0 && (
                  <p className="pt-1 text-xs text-[#9ca3af]">
                    {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining in this billing period
                  </p>
                )}
              </div>

              <div className="mt-5 border-t border-[#EAE8FF]/60 pt-5">
                <h3 className="text-xs font-medium text-[#111827]">Plan features</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(plan === "free"
                    ? [
                        `${effectiveLimit} JDs per month`,
                        "Bilingual AR/EN",
                        "Library storage",
                      ]
                    : PLANS.find((p) => p.id === plan)?.features ?? []
                  ).map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#6b7280]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="rounded-xl border border-[#EAE8FF] bg-white">
            <div className="border-b border-[#EAE8FF]/60 px-6 py-4">
              <h2 className="font-heading text-sm font-semibold text-[#111827]">Billing</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-[#FAFAFE] px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-[#111827]">Plan</p>
                  <p className="text-sm text-[#6b7280]">{plan === "free" ? "Free" : `${plan.charAt(0).toUpperCase() + plan.slice(1)} — ${getPlanPrice(plan)}`}</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-xs font-medium text-[#111827]">Status</p>
                  <p className="text-sm text-[#2E7D32]">{isActivePlan ? "Active" : "Active"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#FAFAFE] px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-[#111827]">Payment method</p>
                  <p className="text-sm text-[#6b7280]">Not configured</p>
                </div>
                <div className="space-y-0.5 text-right">
                  <p className="text-xs font-medium text-[#111827]">Next bill</p>
                  <p className="text-sm text-[#6b7280]">—</p>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                {clerkBillingEnabled ? (
                  isActivePlan ? (
                    <a
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#3D2BFF]/30 bg-white px-4 py-2 text-sm font-medium text-[#3D2BFF] transition-colors hover:bg-[#F8F7FF]"
                    >
                      Manage billing
                    </a>
                  ) : (
                    <a
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#3D2BFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
                    >
                      Choose a plan
                    </a>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-4 py-2 text-sm text-[#9ca3af]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Billing portal not configured
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-xl border border-[#FF5C3A]/20 bg-white">
            <div className="border-b border-[#FF5C3A]/10 px-6 py-4">
              <h2 className="font-heading text-sm font-semibold text-[#FF5C3A]">Danger Zone</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-[#EAE8FF] px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#111827]">Cancel subscription</p>
                  <p className="text-xs text-[#9ca3af]">Cancel your active subscription and downgrade to Free.</p>
                </div>
                {isActivePlan ? (
                  <a
                    href="/pricing"
                    className="rounded-lg border border-[#FF5C3A]/50 px-3 py-1.5 text-xs font-medium text-[#FF5C3A] transition-colors hover:bg-[#FFF5F2]"
                  >
                    Cancel
                  </a>
                ) : (
                  <span className="rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-3 py-1.5 text-xs text-[#9ca3af]">
                    No active subscription
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#EAE8FF] px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#111827]">Delete account</p>
                  <p className="text-xs text-[#9ca3af]">Permanently delete your account and all data.</p>
                </div>
                <span className="rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-3 py-1.5 text-xs text-[#9ca3af]">
                  Coming soon
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#EAE8FF] px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-[#111827]">Sign out</p>
                  <p className="text-xs text-[#9ca3af]">Sign out of your account on this device.</p>
                </div>
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="rounded-xl border border-[#EAE8FF] bg-white">
            <div className="border-b border-[#EAE8FF]/60 px-6 py-4">
              <h2 className="font-heading text-sm font-semibold text-[#111827]">Profile</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#F0EEFF] text-lg font-bold text-[#3D2BFF] ring-2 ring-[#EAE8FF]">
                  {hasImage ? (
                    <img src={clerkUser.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-[#111827]">
                    {clerkUser.firstName} {clerkUser.lastName}
                  </p>
                  <p className="text-xs text-[#6b7280]">{email || "No email"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-[#FAFAFE] px-3 py-2">
                  <span className="text-xs text-[#6b7280]">Joined</span>
                  <span className="text-xs font-medium text-[#111827]">{joinDate || "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#FAFAFE] px-3 py-2">
                  <span className="text-xs text-[#6b7280]">Plan</span>
                  <span className="text-xs font-medium text-[#111827]">{plan === "free" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#FAFAFE] px-3 py-2">
                  <span className="text-xs text-[#6b7280]">JDs this month</span>
                  <span className="text-xs font-medium text-[#111827]">{used}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#9ca3af]">Sign-in methods</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {clerkUser.emailAddresses.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[11px] text-[#3D2BFF]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>
                      Email
                    </span>
                  )}
                  {clerkUser.externalAccounts?.map((acc: { provider: string; name?: string }) => (
                    <span key={acc.provider} className="inline-flex items-center gap-1 rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[11px] text-[#3D2BFF]">
                      {acc.provider === "google" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    )}
                      {acc.provider || "OAuth"}
                    </span>
                  ))}
                </div>
              </div>
              <a
                href="https://clerk.com/user"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#EAE8FF] px-4 py-2 text-xs font-medium text-[#6b7280] transition-colors hover:bg-[#FAFAFE]"
              >
                Manage profile
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-[#EAE8FF] bg-white">
            <div className="border-b border-[#EAE8FF]/60 px-6 py-4">
              <h2 className="font-heading text-sm font-semibold text-[#111827]">Usage</h2>
            </div>
            <div className="p-6 space-y-4">
              {!isUnlimited && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#6b7280]">Monthly limit</span>
                    <span className="font-medium text-[#111827]">{used}/{effectiveLimit}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#EAE8FF]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        used >= effectiveLimit ? "bg-[#FF5C3A]" : "bg-[#3D2BFF]"
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[#FAFAFE] p-3 text-center">
                  <p className="text-lg font-bold text-[#111827]">{used}</p>
                  <p className="text-xs text-[#6b7280]">Used</p>
                </div>
                <div className="rounded-lg bg-[#FAFAFE] p-3 text-center">
                  <p className="text-lg font-bold text-[#111827]">{isUnlimited ? "∞" : effectiveLimit - used}</p>
                  <p className="text-xs text-[#6b7280]">Remaining</p>
                </div>
              </div>
              {isUnlimited && (
                <div className="rounded-lg bg-[#F0EEFF] p-3 text-center">
                  <p className="text-sm font-semibold text-[#3D2BFF]">Unlimited</p>
                  <p className="text-xs text-[#6b7280]">No usage limits on your plan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      {upgradeOptions.length > 0 && (
        <div className="rounded-xl border border-[#EAE8FF] bg-white">
          <div className="border-b border-[#EAE8FF]/60 px-6 py-4">
            <h2 className="font-heading text-sm font-semibold text-[#111827]">
              {plan === "free" ? "Upgrade your plan" : "Explore higher plans"}
            </h2>
            <p className="mt-0.5 text-sm text-[#6b7280]">
              {plan === "free"
                ? "Unlock more JDs and features with a paid plan."
                : "Get more seats and features as your team grows."}
            </p>
          </div>
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upgradeOptions.map((p) => (
                <div
                  key={p.id}
                  className="relative rounded-xl border border-[#EAE8FF] bg-[#FAFAFE] p-5 transition-all hover:border-[#3D2BFF]/30 hover:shadow-sm"
                >
                  {p.id === "pro" && (
                    <span className="absolute right-3 top-3 rounded-full bg-[#3D2BFF] px-2 py-0.5 text-[10px] font-medium text-white">
                      Popular
                    </span>
                  )}
                  <h3 className="font-heading text-base font-semibold text-[#111827]">{p.label}</h3>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-[#111827]">${p.price}</span>
                    <span className="text-sm text-[#6b7280]">/month</span>
                  </div>
                  <p className="mt-1 text-xs text-[#6b7280]">{p.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5">
                    <UpgradeButton
                      planId={p.id}
                      userId={clerkUser.id}
                      label={`Upgrade to ${p.label}`}
                      size="sm"
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
