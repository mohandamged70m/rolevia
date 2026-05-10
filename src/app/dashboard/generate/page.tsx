"use client"

import { useState } from "react"
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

export default function GeneratePage() {
  const router = useRouter()
  const [output, setOutput] = useState<{ content: string; title: string; language: string } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(data: FormData) {
    setIsGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: data.title, language: data.language }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Generation failed")
      }
      const result = await res.json()
      setOutput({ content: result.content, title: data.title, language: data.language })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleRegenerate() {
    setIsRegenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: output?.title, language: output?.language }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Regeneration failed")
      }
      const result = await res.json()
      setOutput((prev) => prev ? { ...prev, content: result.content } : prev)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsRegenerating(false)
    }
  }

  async function handleSave() {
    if (!output) return
    try {
      const res = await fetch("/api/library/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: output.title, content: output.content, language: output.language }),
      })
      if (!res.ok) throw new Error()
      router.push("/dashboard/library")
    } catch {
      setError("Failed to save")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#111827]">Generate JD</h1>
        <p className="mt-1 text-sm text-[#6b7280]">
          Create a bilingual job description in seconds.
        </p>
      </div>

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
    </div>
  )
}
