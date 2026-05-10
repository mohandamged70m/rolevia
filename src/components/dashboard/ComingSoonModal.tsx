"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ComingSoonModalProps {
  feature: string
  open: boolean
  onClose: () => void
}

export function ComingSoonModal({ feature, open, onClose }: ComingSoonModalProps) {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setError(false)
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, feature }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl border border-[#EAE8FF] bg-white p-6 shadow-xl">
        {!sent ? (
          <>
            <h3 className="font-heading text-lg font-bold text-[#111827]">
              {feature} — early access
            </h3>
            <p className="mt-2 text-sm text-[#6b7280]">
              This feature is coming soon. Leave your email and we&apos;ll notify you when it&apos;s ready.
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#EAE8FF] px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:border-[#3D2BFF]/40 focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10"
              />
              {error && (
                <p className="text-xs text-[#FF5C3A]">Something went wrong. Try again.</p>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-[#3D2BFF] text-white hover:bg-[#3525E0]"
                >
                  Notify me
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-[#EAE8FF] text-[#6b7280] hover:bg-[#F8F7FF]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F5E9]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-[#111827]">You&apos;re on the list!</h3>
            <p className="mt-1 text-sm text-[#6b7280]">
              We&apos;ll email you at {email} when {feature} launches.
            </p>
            <Button
              onClick={onClose}
              variant="outline"
              className="mt-4 border-[#EAE8FF] text-[#6b7280]"
            >
              Got it
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
