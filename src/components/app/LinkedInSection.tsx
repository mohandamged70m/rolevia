"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface LinkedInSectionProps {
  initialUrl: string | null
}

export function LinkedInSection({ initialUrl }: LinkedInSectionProps) {
  const router = useRouter()
  const [url, setUrl] = useState(initialUrl || "")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch("/api/account/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl: url }),
      })
      if (res.ok) {
        setSaved(true)
        router.refresh()
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  function extractProfileName(linkedinUrl: string): string | null {
    const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?#]+)/)
    return match ? match[1] : null
  }

  const profileName = url ? extractProfileName(url) : null
  const isValid = url.length === 0 || url.startsWith("https://www.linkedin.com/") || url.startsWith("https://linkedin.com/")

  return (
    <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A66C2]/10">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-sm font-semibold text-[#111827]">LinkedIn</h2>
            <p className="mt-0.5 text-xs text-[#6b7280]">
              {initialUrl
                ? "Your LinkedIn profile is connected."
                : "Link your LinkedIn profile to include in your job descriptions."}
            </p>
          </div>
        </div>
        {initialUrl && (
          <a
            href={initialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[#EAE8FF] px-3 py-1.5 text-xs font-medium text-[#0A66C2] transition-colors hover:bg-[#0A66C2]/5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Open profile
          </a>
        )}
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-[#111827]">LinkedIn profile URL</label>
          <div className="mt-1 flex gap-2">
            <input
              type="url"
              placeholder="https://www.linkedin.com/in/your-profile"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setSaved(false) }}
              className={`flex-1 rounded-xl border bg-white px-3 py-2 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10 ${
                url && !isValid ? "border-[#FF5C3A]" : "border-[#EAE8FF] focus:border-[#3D2BFF]/40"
              }`}
            />
            <button
              onClick={handleSave}
              disabled={saving || !url.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0A66C2]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              ) : saved ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
              {saving ? "Saving..." : saved ? "Saved" : "Save"}
            </button>
          </div>
          {url && !isValid && (
            <p className="mt-1 text-xs text-[#FF5C3A]">URL must start with https://www.linkedin.com/</p>
          )}
          {profileName && isValid && (
            <p className="mt-1 text-xs text-[#6b7280]">
              Profile: <span className="font-medium text-[#111827]">{profileName}</span>
            </p>
          )}
        </div>

        <div className="rounded-xl bg-[#F0EEFF]/50 p-3">
          <p className="text-xs text-[#6b7280]">
            <span className="font-medium text-[#111827]">Tip:</span> Adding your LinkedIn profile URL allows the AI
            to reference your professional background when generating tailored job descriptions.
          </p>
        </div>
      </div>
    </div>
  )
}
