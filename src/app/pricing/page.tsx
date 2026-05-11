"use client"

import { useClerk } from "@clerk/nextjs"
import { useEffect, useRef } from "react"
import Link from "next/link"

export default function PricingPage() {
  const clerk = useClerk()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && clerk.loaded) {
      clerk.mountPricingTable(ref.current, {
        for: "user",
        newSubscriptionRedirectUrl: "/dashboard/account",
      })
    }
    return () => {
      if (ref.current) {
        clerk.unmountPricingTable(ref.current)
      }
    }
  }, [clerk, clerk.loaded])

  return (
    <div className="min-h-screen bg-[#FAFAFE]">
      <header className="flex h-16 items-center justify-between border-b border-[#EAE8FF] bg-white px-6">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-heading text-lg font-extrabold text-[#3D2BFF]">Rolevia</span>
          <span className="h-2 w-2 rounded-full bg-[#FF5C3A]" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:text-[#111827]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-[#3D2BFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
          >
            Get started
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-3xl font-bold text-[#111827]">Choose your plan</h1>
          <p className="mt-2 text-[#6b7280]">
            Unlock more JDs and features with a paid plan.
          </p>
        </div>
        <div ref={ref} className="flex justify-center" />
      </div>
    </div>
  )
}
