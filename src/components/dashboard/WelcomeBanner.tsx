"use client"

import { useState, useEffect } from "react"

interface WelcomeBannerProps {
  userName: string
}

export function WelcomeBanner({ userName }: WelcomeBannerProps) {
  const [visible, setVisible] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const val = sessionStorage.getItem("welcome-dismissed")
    if (val) setDismissed(true)
  }, [])

  if (dismissed || !visible) return null

  function handleDismiss() {
    sessionStorage.setItem("welcome-dismissed", "true")
    setDismissed(true)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#3D2BFF]/20 bg-gradient-to-br from-[#F0EEFF] via-[#F8F7FF] to-white p-6">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[#3D2BFF]/5 blur-3xl" />
      <div className="relative">
        <h1 className="font-heading text-xl font-bold text-[#111827]">
          Welcome back, {userName} 👋
        </h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Your workspace is ready. Generate a JD, browse your library, or explore upcoming tools.
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-[#3D2BFF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            10 free JDs per month
          </span>
          <span className="flex items-center gap-1 text-[#3D2BFF]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            Bilingual AR/EN output
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute right-0 top-0 rounded-lg p-1 text-[#9ca3af] transition-colors hover:bg-[#EAE8FF] hover:text-[#6b7280]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
