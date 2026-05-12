"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface LinkedInStatus {
  connected: boolean
  configured: boolean
  linkedinUserId?: string | null
  connectedAt?: string | null
}

export function LinkedInSection() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<LinkedInStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  useEffect(() => {
    const param = searchParams.get("linkedin")
    if (param === "connected") setNotification("LinkedIn connected successfully!")
    else if (param === "error") setNotification("Failed to connect LinkedIn. Please try again.")
    else if (param === "token_error") setNotification("Could not get LinkedIn access. Please try again.")
    else if (param === "not_configured") setNotification("LinkedIn is not configured yet.")

    fetchStatus()
  }, [searchParams])

  async function fetchStatus() {
    try {
      const res = await fetch("/api/account/linkedin")
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ connected: false, configured: false })
    } finally {
      setLoading(false)
    }
  }

  async function handleConnect() {
    window.location.href = "/api/account/linkedin/auth"
  }

  async function handleDisconnect() {
    setDisconnecting(true)
    try {
      await fetch("/api/account/linkedin", { method: "DELETE" })
      setStatus({ connected: false, configured: status?.configured ?? false })
    } finally {
      setDisconnecting(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-[#F0EEFF]" />
          <div className="space-y-1.5 flex-1">
            <div className="h-4 w-24 animate-pulse rounded bg-[#F0EEFF]" />
            <div className="h-3 w-48 animate-pulse rounded bg-[#F0EEFF]" />
          </div>
        </div>
      </div>
    )
  }

  const isConnected = status?.connected ?? false
  const isConfigured = status?.configured ?? false

  return (
    <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
      {notification && (
        <div className="mb-4 rounded-lg border border-[#EAE8FF] bg-[#FAFAFE] px-3 py-2 text-xs text-[#6b7280]">
          {notification}
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isConnected ? "bg-[#0A66C2]" : "bg-[#0A66C2]/10"}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isConnected ? "white" : "#0A66C2"}>
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-sm font-semibold text-[#111827]">LinkedIn</h2>
            <p className="mt-0.5 text-xs text-[#6b7280]">
              {isConnected
                ? "Your LinkedIn account is connected. You can now post job descriptions directly to LinkedIn."
                : isConfigured
                  ? "Connect your LinkedIn account to post job descriptions directly to your profile."
                  : "LinkedIn integration is not configured yet."}
            </p>
          </div>
        </div>

        {isConnected && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-1 text-[10px] font-medium text-[#2E7D32]">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Connected
          </span>
        )}
      </div>

      <div className="mt-4">
        {isConnected ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-[#F0EEFF]/50 p-3">
              <p className="text-xs text-[#6b7280]">
                <span className="font-medium text-[#111827]">Ready to post.</span> When you generate a job
                description, look for the "Post to LinkedIn" button to share it directly.
              </p>
            </div>
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#FFE5E0] px-3 py-1.5 text-xs font-medium text-[#FF5C3A] transition-colors hover:bg-[#FF5C3A]/5"
            >
              {disconnecting ? "Disconnecting..." : "Disconnect LinkedIn"}
            </button>
          </div>
        ) : isConfigured ? (
          <button
            onClick={handleConnect}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0A66C2]/90"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect with LinkedIn
          </button>
        ) : (
          <div className="rounded-xl bg-[#F9F9FB] p-3">
            <p className="text-xs text-[#9ca3af]">
              LinkedIn posting requires{" "}
              <code className="rounded bg-[#EAE8FF] px-1 py-0.5 font-mono text-[10px] text-[#6b7280]">
                LINKEDIN_CLIENT_ID
              </code>{" "}
              and{" "}
              <code className="rounded bg-[#EAE8FF] px-1 py-0.5 font-mono text-[10px] text-[#6b7280]">
                LINKEDIN_CLIENT_SECRET
              </code>{" "}
              environment variables. Contact your administrator to set these up.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
