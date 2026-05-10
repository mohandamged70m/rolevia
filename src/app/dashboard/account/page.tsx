import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isClerkConfigured } from "@/lib/clerk"
import { ensureUser, isSupabaseConfigured, getUser } from "@/lib/supabase/users"
import { getMonthlyUsage, MONTHLY_LIMIT } from "@/lib/user-usage"
import { PLANS, getPlanLimit, isLemonConfigured } from "@/lib/payments/plans"
import { UpgradeButton } from "@/components/app/UpgradeButton"

export default async function AccountPage() {
  if (!isClerkConfigured) redirect("/")

  const clerkUser = await currentUser()
  if (!clerkUser) redirect("/sign-in")

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? null

  if (isSupabaseConfigured()) {
    await ensureUser(clerkUser.id, email)
  }

  const { plan, plan_expires_at } = isSupabaseConfigured()
    ? await getUser(clerkUser.id).then((u) => ({
        plan: u?.plan ?? "free",
        plan_expires_at: u?.plan_expires_at ?? null,
      }))
    : { plan: "free" as string, plan_expires_at: null as string | null }

  const { used, limit } = await getMonthlyUsage(clerkUser.id)
  const planLimit = getPlanLimit(plan)
  const effectiveLimit = typeof planLimit === "number" ? planLimit : limit
  const isUnlimited = planLimit === "unlimited"
  const usagePercent = isUnlimited ? 0 : Math.min((used / effectiveLimit) * 100, 100)

  const planPrice: Record<string, string> = {
    free: "$0/mo",
    starter: "$12/mo",
    pro: "$29/mo",
    team: "$79/mo",
  }

  const joinDate = clerkUser.createdAt
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(clerkUser.createdAt))
    : null

  const isActivePlan = plan !== "free"
  const statusLabel = plan_expires_at
    ? new Date(plan_expires_at) > new Date()
      ? "Active"
      : "Expired"
    : isActivePlan
      ? "Active"
      : null

  const lemonConfigured = isLemonConfigured()

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

  function StatusBadge({ plan, label }: { plan: string; label: string | null }) {
    if (plan === "free") {
      return (
        <span className="inline-block rounded-full bg-[#F0EEFF] px-3 py-1 text-xs font-medium text-[#3D2BFF]">
          Free tier
        </span>
      )
    }
    if (!label) return null
    const colors = label === "Active"
      ? "bg-[#E8F5E9] text-[#2E7D32]"
      : "bg-[#FFF3E0] text-[#E65100]"
    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${colors}`}>
        {label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#111827]">Account</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Manage your plan and settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-[#111827]">Current Plan</h2>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <StatusBadge plan={plan} label={statusLabel} />
              <span className="text-sm font-medium text-[#111827]">{planPrice[plan]}</span>
            </div>

            {/* Usage counter */}
            <div>
              <div className="flex items-center justify-between text-xs">
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
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EAE8FF]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      used >= effectiveLimit ? "bg-[#FF5C3A]" : usagePercent >= 80 ? "bg-[#FFBD2E]" : "bg-[#3D2BFF]"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              )}
            </div>

            {plan_expires_at && (
              <p className="text-xs text-[#6b7280]">
                Next billing date: {new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(new Date(plan_expires_at))}
              </p>
            )}

            <ul className="space-y-1.5 pt-2 text-sm text-[#6b7280]">
              {plan === "free" && (
                <>
                  <li className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    {MONTHLY_LIMIT} JDs per month
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Bilingual AR/EN
                  </li>
                  <li className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    Library storage
                  </li>
                </>
              )}
              {plan !== "free" && PLANS.find((p) => p.id === plan)?.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-[#111827]">Profile</h2>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs text-[#9ca3af]">Name</p>
              <p className="text-sm text-[#111827]">
                {clerkUser.firstName} {clerkUser.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9ca3af]">Email</p>
              <p className="text-sm text-[#111827]">
                {email || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9ca3af]">Joined</p>
              <p className="text-sm text-[#111827]">
                {joinDate || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9ca3af]">Sign-in methods</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {clerkUser.emailAddresses.length > 0 && (
                  <span className="rounded-full bg-[#F0EEFF] px-2 py-0.5 text-xs text-[#3D2BFF]">Email</span>
                )}
                {clerkUser.externalAccounts?.map((acc: { provider: string }) => (
                  <span key={acc.provider} className="rounded-full bg-[#F0EEFF] px-2 py-0.5 text-xs text-[#3D2BFF]">
                    {acc.provider}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Section */}
      {upgradeOptions.length > 0 && (
        <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-[#111827]">
            {plan === "free" ? "Upgrade your plan" : "Explore higher plans"}
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            {plan === "free"
              ? "Unlock more JDs and features with a paid plan."
              : "Get more seats and features as your team grows."}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upgradeOptions.map((p) => (
              <div key={p.id} className="rounded-xl border border-[#EAE8FF] bg-[#FAFAFE] p-4">
                <h3 className="font-heading text-sm font-semibold text-[#111827]">{p.label}</h3>
                <p className="mt-1 text-2xl font-bold text-[#111827]">
                  ${p.price}
                  <span className="text-sm font-normal text-[#6b7280]">/mo</span>
                </p>
                <p className="mt-1 text-xs text-[#6b7280]">{p.description}</p>
                <ul className="mt-3 space-y-1">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
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
      )}

      {/* Billing Management */}
      <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
        <h2 className="font-heading text-sm font-semibold text-[#111827]">Billing</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Manage your subscription, invoices, and payment methods.
        </p>
        <div className="mt-3">
          {lemonConfigured ? (
            <span className="inline-block cursor-not-allowed rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-4 py-2 text-sm text-[#9ca3af]">
              Manage billing — coming soon
            </span>
          ) : (
            <span className="inline-block rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-4 py-2 text-sm text-[#9ca3af]">
              Billing portal — not yet configured
            </span>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-[#FF5C3A]/30 bg-white p-5">
        <h2 className="font-heading text-sm font-semibold text-[#FF5C3A]">Danger Zone</h2>
        <p className="mt-1 text-sm text-[#6b7280]">
          Irreversible actions for your account.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <span className="cursor-not-allowed rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-4 py-2 text-sm text-[#9ca3af]">
            Cancel subscription — available on paid plans
          </span>
          <span className="cursor-not-allowed rounded-lg border border-[#EAE8FF] bg-[#F9F9FB] px-4 py-2 text-sm text-[#9ca3af]">
            Delete account — coming soon
          </span>
        </div>
      </div>
    </div>
  )
}
