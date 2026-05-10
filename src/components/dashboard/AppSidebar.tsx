"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SIDEBAR_NAV, SIDEBAR_FUTURE } from "@/lib/features"
import { IconHub, IconGenerate, IconLibrary, IconAccount, IconAts, IconInterview, IconCandidates, IconAnalytics, IconCollapse, IconExpand } from "@/components/icons"
import { UsageCounter } from "./UsageCounter"

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  hub: IconHub,
  generate: IconGenerate,
  library: IconLibrary,
  account: IconAccount,
  ats: IconAts,
  interview: IconInterview,
  candidates: IconCandidates,
  analytics: IconAnalytics,
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[#EAE8FF] bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-[#EAE8FF] px-4">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="font-heading text-lg font-extrabold text-[#3D2BFF]">
              Rolevia
            </span>
            <span className="h-2 w-2 rounded-full bg-[#FF5C3A]" />
          </Link>
        )}
        {collapsed && (
          <Link href="/dashboard" className="mx-auto">
            <span className="font-heading text-lg font-extrabold text-[#3D2BFF]">R</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center rounded-lg p-1.5 text-[#6b7280] transition-colors hover:bg-[#F8F7FF] hover:text-[#3D2BFF]"
        >
          {collapsed ? <IconExpand size={18} /> : <IconCollapse size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        <p className={cn("px-2 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]", collapsed && "sr-only")}>
          Main
        </p>
        {SIDEBAR_NAV.map((item) => {
          const Icon = iconMap[item.iconId]
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#F0EEFF] text-[#3D2BFF]"
                  : "text-[#6b7280] hover:bg-[#F8F7FF] hover:text-[#111827]",
              )}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon size={20} className={cn(isActive ? "text-[#3D2BFF]" : "text-[#9ca3af]")} />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}

        <div className={cn("my-3 border-t border-[#EAE8FF]", collapsed && "mx-2")} />

        <p className={cn("px-2 text-xs font-semibold uppercase tracking-wider text-[#9ca3af]", collapsed && "sr-only")}>
          Coming Soon
        </p>
        {SIDEBAR_FUTURE.map((item) => {
          const Icon = iconMap[item.iconId]
          return (
            <div
              key={item.id}
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-[#d1d5db]"
              title={collapsed ? `${item.label} (coming soon)` : undefined}
            >
              {Icon && <Icon size={20} className="text-[#d1d5db]" />}
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between">
                  <span>{item.label}</span>
                  <span className="rounded-full bg-[#F0EEFF] px-1.5 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
                    Soon
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-[#EAE8FF] px-4 py-4">
          <UsageCounter />
        </div>
      )}
    </aside>
  )
}
