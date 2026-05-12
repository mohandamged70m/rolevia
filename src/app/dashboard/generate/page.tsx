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
  companyName?: string
  location?: string
  experienceLevel?: string
  employmentType?: string
  salaryRange?: string
  skills?: string
}

interface UsageInfo {
  used: number
  limit: number
}

export default function GeneratePage() {
  const router = useRouter()
  const [usage, setUsage] = useState<UsageInfo | null>(null)
  const [output, setOutput] = useState<{ id: string; content: string; title: string; language: string } | null>(null)
  const [lastFormData, setLastFormData] = useState<FormData | null>(null)
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
    setLastFormData(data)
    try {
      const res = await fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: data.title,
          language: data.language,
          industry: data.industry,
          tone: data.tone,
          responsibilities: data.responsibilities.filter(Boolean),
          companyName: data.companyName,
          location: data.location,
          experienceLevel: data.experienceLevel,
          employmentType: data.employmentType,
          salaryRange: data.salaryRange,
          skills: data.skills,
        }),
      })

      if (res.status === 403) {
        const err = await res.json()
        setUsage({ used: err.used ?? usage!.limit, limit: err.limit ?? usage!.limit })
        throw new Error(err.error || "You've reached your monthly limit")
      }

      if (!res.ok) {
        const err = await res.json()
        const msg = err.error || "Generation failed"
        if (res.status === 503) {
          throw new Error("AI service is temporarily unavailable. Please try again in a few seconds.")
        }
        throw new Error(msg)
      }

      const result = await res.json()
      setOutput({ id: crypto.randomUUID(), content: result.content, title: data.title, language: data.language })
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
    const fd = lastFormData || { title: output.title, language: output.language, industry: "", tone: "", responsibilities: [] as string[] }
    try {
      const res = await fetch("/api/dashboard/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: fd.title,
          language: fd.language,
          industry: fd.industry,
          tone: fd.tone,
          responsibilities: (fd.responsibilities || []).filter(Boolean),
          companyName: fd.companyName,
          location: fd.location,
          experienceLevel: fd.experienceLevel,
          employmentType: fd.employmentType,
          salaryRange: fd.salaryRange,
          skills: fd.skills,
        }),
      })

      if (res.status === 403) {
        const err = await res.json()
        setUsage({ used: err.used ?? usage!.limit, limit: err.limit ?? usage!.limit })
        throw new Error(err.error || "You've reached your monthly limit")
      }

      if (!res.ok) {
        const err = await res.json()
        const msg = err.error || "Regeneration failed"
        if (res.status === 503) {
          throw new Error("AI service is temporarily unavailable. Please try again in a few seconds.")
        }
        throw new Error(msg)
      }

      const result = await res.json()
      setOutput((prev) => prev ? { ...prev, id: crypto.randomUUID(), content: result.content } : prev)
      setUsage({ used: result.used, limit: result.limit })
      setError(null)
      window.dispatchEvent(new CustomEvent("usage-updated"))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsRegenerating(false)
    }
  }, [output, isAtLimit, usage, lastFormData])

  async function handleSave() {
    if (!output) return
    setIsSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: output.id, title: output.title, content: output.content, language: output.language }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Failed to save")
      }
      window.location.href = "/dashboard/library"
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#111827]">Generate JD</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Create a bilingual job description in seconds.
          </p>
        </div>
        {usage && (
          <div className="flex items-center gap-2 self-start rounded-xl border border-[#EAE8FF] bg-white px-3 py-2 text-sm shadow-xs">
            <span className="whitespace-nowrap text-[#6b7280]">Monthly usage:</span>
            <span className={`font-semibold ${usage.used >= usage.limit ? "text-[#FF5C3A]" : "text-[#111827]"}`}>
              {usage.used}/{usage.limit}
            </span>
            <div className="h-2 w-16 shrink-0 overflow-hidden rounded-full bg-[#EAE8FF]">
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
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-[#FF5C3A]/20 bg-[#FF5C3A]/5 p-4 text-sm text-[#FF5C3A]">
                <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {output ? (
              <JdOutput
                id={output.id}
                title={output.title}
                content={output.content}
                language={output.language as "arabic" | "english" | "both"}
                onRegenerate={handleRegenerate}
                onSave={handleSave}
                isSaving={isSaving}
                isRegenerating={isRegenerating}
              />
            ) : isGenerating ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-40 animate-pulse rounded bg-[#EAE8FF]" />
                  <div className="flex gap-2">
                    <div className="h-7 w-16 animate-pulse rounded-lg bg-[#EAE8FF]" />
                    <div className="h-7 w-16 animate-pulse rounded-lg bg-[#EAE8FF]" />
                  </div>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-[#EAE8FF] bg-white p-5">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#EAE8FF]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#F5F5F5]" />
                  </div>
                  <div className="space-y-3 rounded-xl border border-[#EAE8FF] bg-white p-5" dir="rtl">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#EAE8FF]" />
                    <div className="h-3 w-full animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-3 w-5/6 animate-pulse rounded bg-[#F5F5F5]" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-[#F5F5F5]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-[#EAE8FF] bg-white/50 px-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EEFF]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                    <path d="M14 2v6h6" />
                    <path d="M12 18v-6" />
                    <path d="m9 15 3-3 3 3" />
                  </svg>
                </div>
                <h3 className="mt-4 font-heading text-sm font-semibold text-[#111827]">Ready to create a JD</h3>
                <p className="mt-1 max-w-xs text-center text-xs text-[#9ca3af]">
                  Fill in the form and click generate. Your bilingual job description will appear here.
                </p>
                <div className="mt-5 flex gap-4 text-xs text-[#6b7280]">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    English + Arabic
                  </span>
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Save to library
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
