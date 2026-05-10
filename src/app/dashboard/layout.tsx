import { ClerkProvider } from "@clerk/nextjs"
import { isClerkConfigured } from "@/lib/clerk"
import { AppSidebar } from "@/components/dashboard/AppSidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured) {
    return <>{children}</>
  }

  return (
    <ClerkProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-[#FAFAFE]">
          <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        </main>
      </div>
    </ClerkProvider>
  )
}
