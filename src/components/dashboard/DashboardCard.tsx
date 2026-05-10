"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Feature } from "@/lib/features"
import { IconGenerate, IconLibrary, IconAccount, IconAts, IconInterview, IconCandidates, IconAnalytics } from "@/components/icons"
import { ComingSoonModal } from "./ComingSoonModal"

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  generate: IconGenerate,
  library: IconLibrary,
  account: IconAccount,
  ats: IconAts,
  interview: IconInterview,
  candidates: IconCandidates,
  analytics: IconAnalytics,
}

interface DashboardCardProps {
  feature: Feature
}

export function DashboardCard({ feature }: DashboardCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const Icon = iconMap[feature.iconId]
  const isComingSoon = feature.status === "coming-soon"

  const shared = (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border p-5 transition-all",
        isComingSoon
          ? "cursor-default border-[#EAE8FF]/60 bg-[#FAFAFE]"
          : "cursor-pointer border-[#EAE8FF] bg-white shadow-sm hover:border-[#3D2BFF]/30 hover:shadow-md hover:shadow-[#3D2BFF]/5",
      )}
      onClick={() => isComingSoon && setModalOpen(true)}
    >
      {isComingSoon && (
        <span className="absolute right-3 top-3 rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
          {feature.comingSoonLabel || "Coming soon"}
        </span>
      )}
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          isComingSoon ? "bg-[#F0EEFF]/50" : "bg-[#F0EEFF]",
        )}
      >
        {Icon && (
          <Icon
            size={20}
            className={isComingSoon ? "text-[#c4c1e0]" : "text-[#3D2BFF]"}
          />
        )}
      </div>
      <div>
        <h3
          className={cn(
            "font-heading text-sm font-semibold",
            isComingSoon ? "text-[#9ca3af]" : "text-[#111827]",
          )}
        >
          {feature.label}
        </h3>
        <p className="mt-1 text-xs text-[#6b7280]">{feature.description}</p>
      </div>
    </div>
  )

  if (isComingSoon) {
    return (
      <>
        {shared}
        <ComingSoonModal
          feature={feature.label}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    )
  }

  return <Link href={feature.href}>{shared}</Link>
}
