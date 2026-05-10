import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { isClerkConfigured } from "@/lib/clerk"

export default async function DashboardPage() {
  if (!isClerkConfigured) {
    redirect("/")
  }

  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0EEFF] via-[#F0EEFF]/50 to-white">
      <header className="border-b border-[#EAE8FF] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-heading text-xl font-extrabold text-[#3D2BFF]">
              Rolevia
            </span>
            <span className="h-2 w-2 rounded-full bg-[#FF5C3A]" />
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[#4b5563] transition-colors hover:text-[#3D2BFF]"
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#EAE8FF] bg-white p-8 shadow-sm">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0ED]">
            <span className="text-2xl">🎉</span>
          </div>
          <h1 className="text-center font-heading text-2xl font-bold text-[#111827]">
            Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "there"}!
          </h1>
          <p className="mt-2 text-center text-sm text-[#6b7280]">
            Your account is ready. Your dashboard is coming soon.
          </p>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-[#EAE8FF] bg-[#F8F7FF] p-5">
              <h2 className="text-sm font-semibold text-[#111827]">
                Email
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">
                {user.emailAddresses[0]?.emailAddress || "No email"}
              </p>
            </div>

            <div className="rounded-xl border border-[#EAE8FF] bg-[#F8F7FF] p-5">
              <h2 className="text-sm font-semibold text-[#111827]">
                Plan
              </h2>
              <p className="mt-1 text-sm text-[#6b7280]">Free tier</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-[#FFBD2E]/30 bg-[#FFBD2E]/5 p-5">
            <p className="text-center text-sm text-[#B8860B]">
              🚀 We&apos;re building your workspace. In the meantime, you can{" "}
              <Link
                href="/"
                className="font-medium text-[#3D2BFF] underline underline-offset-2 hover:text-[#3525E0]"
              >
                try the JD generator
              </Link>{" "}
              on the landing page.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
