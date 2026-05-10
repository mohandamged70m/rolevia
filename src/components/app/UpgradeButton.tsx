"use client"

import { useState } from "react"
import { isLemonConfigured, getCheckoutUrl } from "@/lib/payments/plans"

interface UpgradeButtonProps {
  planId: string
  userId: string
  label?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md"
  className?: string
}

export function UpgradeButton({
  planId,
  userId,
  label = "Upgrade",
  variant = "default",
  size = "md",
  className = "",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const configured = isLemonConfigured()

  function handleClick() {
    if (!configured) return
    setLoading(true)
    const url = getCheckoutUrl(planId, userId)
    if (url) {
      window.location.href = url
    } else {
      setLoading(false)
    }
  }

  const baseClass =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all whitespace-nowrap"
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
  const variantClass =
    variant === "outline"
      ? "border border-[#EAE8FF] bg-white text-[#111827] hover:border-[#3D2BFF]/30 hover:bg-[#F8F7FF]"
      : variant === "ghost"
        ? "text-[#3D2BFF] hover:bg-[#F0EEFF]"
        : "bg-[#3D2BFF] text-white hover:bg-[#3525E0]"

  if (!configured) {
    return (
      <span
        title="Payment integration not configured"
        className={`${baseClass} ${sizeClass} cursor-not-allowed border border-[#EAE8FF] bg-[#F9F9FB] text-[#9ca3af] ${className}`}
      >
        {label}
      </span>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${baseClass} ${sizeClass} ${variantClass} disabled:opacity-60 ${className}`}
    >
      {loading ? "Redirecting..." : label}
    </button>
  )
}
