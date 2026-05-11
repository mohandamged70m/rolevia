"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { GenerateForm } from "@/components/app/GenerateForm"
import { JdOutput } from "@/components/app/JdOutput"

interface FormData {
  title: string
  industry: string
  tone: string
  responsibilities: string[]
  language: string
}

interface UsageInfo {
  used: number
  limit: number
}

export default function GeneratePage() {
  const router = useRouter()
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [output, setOutput] = useState<{ content: string; title: string; language: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/usage")
      .then((r) => r.json())
      .then((d) => setUsage({ used: d.used, limit: d.limit }))
      .catch(() => {})

    function onUsageUpdate() {
      fetch("/api/usage")
        .then((r) => r.json())
        .then((d) => setUsage({ used: d.used, limit: d.limit }))
        .catch(() => {})
    }

    window.addEventListener("usage-updated", onUsageUpdate)
    return () => window.removeEventListener("usage-updated", onUsageUpdate)
  }, [])

  const isAtLimit = usage ? usage.used >= usage.limit : false

  async function handleGenerate(data: FormData) {
    if (isAtLimit) return

    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: data.title, language: data.language }),
      })

      if (res.status === 403) {
        const err = await res.json()
        setUsage({ used: err.used ?? usage!.limit, limit: err.limit ?? usage!.limit })
        throw new Error(err.error || "You've reached your monthly limit")
      }

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }

      const result = await res.json()
      setOutput({ content: result.content, title: data.title, language: data.language })
      setUsage({ used: result.used, limit: result.limit })
      setError(null)
      window.dispatchEvent(new CustomEvent("usage-updated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = useCallback(async () => {
    if (isAtLimit || !output) return

    setIsRegenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: output.title, language: output.language }),
      })

      if (res.status === 403) {
        const err = await res.json()
        setUsage({ used: err.used ?? usage!.limit, limit: err.limit ?? usage!.limit })
        throw new Error(err.error || "You've reached your monthly limit")
      }

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Regeneration failed")
      }

      const result = await res.json()
      setOutput((prev) => prev ? { ...prev, content: result.content } : prev)
      setUsage({ used: result.used, limit: result.limit })
      setError(null)
      window.dispatchEvent(new CustomEvent("usage-updated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsRegenerating(false)
    }
  }, [output, isAtLimit, usage])

  async function handleSave() {
    if (!output) return
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: output.title, content: output.content, language: output.language }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save")
      }
      router.push("/dashboard/library")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#111827]">Generate JD</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Create a bilingual job description in seconds.
          </p>
        </div>
        {usage && (
          <div className="flex items-center gap-2 rounded-xl border border-[#EAE8FF] bg-white px-3 py-2 text-sm">
            <span className="text-[#6b7280]">Monthly usage:</span>
            <span className={`font-semibold ${usage.used >= usage.limit ? "text-[#FF5C3A]" : "text-[#111827]"}`}>
              {usage.used}/{usage.limit}
            </span>
            <div className="h-2 w-16 overflow-hidden rounded-full bg-[#EAE8FF]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  usage.used >= usage.limit ? "bg-[#FF5C3A]" : usage.used / usage.limit >= 0.8 ? "bg-[#FFBD2E]" : "bg-[#3D2BFF]"
                }`}
                style={{ width: `${Math.min((usage.used / usage.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isAtLimit && (
        <div className="rounded-xl border border-[#FF5C3A]/30 bg-[#FF5C3A]/5 p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FF5C3A]/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5C3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="font-heading text-lg font-bold text-[#111827]">
            You&apos;ve reached your monthly limit
          </h2>
          <p className="mt-1 text-sm text-[#6b7280]">
            You&apos;ve used all {usage?.limit} free JDs this month. Upgrade to Pro for unlimited generations.
          </p>
          <button
            onClick={() => router.push("/dashboard/account")}
            className="mt-4 rounded-xl bg-[#3D2BFF] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
          >
            View plans
          </button>
        </div>
      )}

      {!isAtLimit && (
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="rounded-xl border border-[#EAE8FF] bg-white p-5">
            <GenerateForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </div>

          <div>
            {error && (
              <div className="mb-4 rounded-xl border border-[#FF5C3A]/20 bg-[#FF5C3A]/5 p-4 text-sm text-[#FF5C3A]">
                {error}
              </div>
            )}
            {output ? (
              <JdOutput
                title={output.title}
                content={output.content}
                language={output.language as "arabic" | "english" | "both"}
                onRegenerate={handleRegenerate}
                onSave={handleSave}
                isSaving={isSaving}
                isRegenerating={isRegenerating}
              />
            ) : (
              <div className="flex h-full min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[#EAE8FF] bg-white/50">
                <p className="text-sm text-[#9ca3af]">
                  {isGenerating ? "Generating..." : "Your JD output will appear here"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
