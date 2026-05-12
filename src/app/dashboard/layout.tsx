"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { useMediaQuery } from "@/lib/use-media-query"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 767px)")

  return (
    <div className="flex min-h-screen">
      <AppSidebar
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#EAE8FF] bg-white/90 px-4 backdrop-blur-xl md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#F8F7FF] hover:text-[#3D2BFF]"
            aria-label="Open sidebar"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="font-heading text-lg font-extrabold text-[#3D2BFF]">
              Rolevia
            </span>
            <span className="h-2 w-2 rounded-full bg-[#FF5C3A]" />
          </Link>
        </header>

        <main className="flex-1 overflow-auto bg-[#FAFAFE]">
          <div className="mx-auto max-w-5xl px-6 py-8 max-sm:px-4 max-sm:py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
