import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isClerkConfigured } from "@/lib/clerk"

export default async function AccountPage() {
  if (!isClerkConfigured) redirect("/")

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#111827]">Account</h1>
        <p className="mt-1 text-sm text-[#6b7280]">Manage your plan and settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-[#111827]">Profile</h2>
          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs text-[#9ca3af]">Name</p>
              <p className="text-sm text-[#111827]">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9ca3af]">Email</p>
              <p className="text-sm text-[#111827]">
                {user.emailAddresses[0]?.emailAddress || "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
          <h2 className="font-heading text-sm font-semibold text-[#111827]">Current Plan</h2>
          <div className="mt-3">
            <div className="mb-3 inline-block rounded-full bg-[#F0EEFF] px-3 py-1 text-xs font-medium text-[#3D2BFF]">
              Free tier
            </div>
            <ul className="space-y-1.5 text-sm text-[#6b7280]">
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                10 JDs per month
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Bilingual AR/EN
              </li>
              <li className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Library storage
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
