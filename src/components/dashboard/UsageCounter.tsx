"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface UsageData {
  used: number
  limit: number
  plan: string
}

export function UsageCounter() {
  const [data, setData] = useState<UsageData | null>(null)

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) return null

  const pct = Math.min((data.used / data.limit) * 100, 100)
  const color =
    pct >= 80 ? "bg-[#FF5C3A]" : pct >= 60 ? "bg-[#FFBD2E]" : "bg-[#3D2BFF]"

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#6b7280]">
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
      {pct >= 80 && (
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
