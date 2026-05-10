"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

interface UsageData {
  used: number
  limit: number
  plan: string
}

export function UsageCounter() {
  const [data, setData] = useState<UsageData | null>(null)

  const fetchUsage = useCallback(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchUsage()
    window.addEventListener("usage-updated", fetchUsage)
    return () => window.removeEventListener("usage-updated", fetchUsage)
  }, [fetchUsage])

  if (!data) return null

  const pct = Math.min((data.used / data.limit) * 100, 100)
  const color =
    data.used >= data.limit ? "bg-[#FF5C3A]" : pct >= 80 ? "bg-[#FFBD2E]" : pct >= 60 ? "bg-[#FFBD2E]" : "bg-[#3D2BFF]"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className={data.used >= data.limit ? "font-semibold text-[#FF5C3A]" : "text-[#6b7280]"}>
          {data.used} of {data.limit} JDs
        </span>
        <span className="font-medium text-[#111827]">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#EAE8FF]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {data.used >= data.limit && (
        <Link
          href="/dashboard/account"
          className="block rounded-lg bg-[#FF5C3A]/10 px-2 py-1.5 text-center text-xs font-medium text-[#FF5C3A] transition-colors hover:bg-[#FF5C3A]/20"
        >
          Limit reached — upgrade
        </Link>
      )}
      {data.used < data.limit && pct >= 80 && (
        <Link
          href="/dashboard/account"
          className="block rounded-lg bg-[#3D2BFF]/10 px-2 py-1.5 text-center text-xs font-medium text-[#3D2BFF] transition-colors hover:bg-[#3D2BFF]/20"
        >
          Upgrade for unlimited
        </Link>
      )}
    </div>
  )
}
