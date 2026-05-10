"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

const INDUSTRIES = [
  "Technology / IT", "Finance & Banking", "Retail & E-commerce",
  "Healthcare & Pharma", "Construction & Engineering", "Education & Training",
  "Logistics & Supply Chain", "Food & Beverage", "Real Estate",
  "Government & Public Sector", "Telecom", "Oil & Gas",
  "Media & Advertising", "Hospitality & Tourism", "Agriculture",
  "Automotive", "Insurance", "Legal", "Non-Profit", "Other",
]

const TONES = ["Formal", "Professional", "Startup-Friendly"] as const

const LANGUAGES = [
  { value: "both", label: "Both" },
  { value: "arabic", label: "Arabic" },
  { value: "english", label: "English" },
] as const

interface FormData {
  title: string
  industry: string
  tone: string
  responsibilities: string[]
  language: string
}

interface GenerateFormProps {
  onGenerate: (data: FormData) => void
  isGenerating: boolean
  initialData?: Partial<FormData>
}

export function GenerateForm({ onGenerate, isGenerating, initialData }: GenerateFormProps) {
  const [form, setForm] = useState<FormData>({
    title: initialData?.title || "",
    industry: initialData?.industry || "",
    tone: initialData?.tone || "Professional",
    responsibilities: initialData?.responsibilities || [""],
    language: initialData?.language || "both",
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.title || form.title.length < 2) next.title = "Job title is required (min 2 chars)"
    if (!form.industry) next.industry = "Select an industry"
    if (!form.tone) next.tone = "Select a tone"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onGenerate(form)
  }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function addResponsibility() {
    if (form.responsibilities.length < 5) {
      update("responsibilities", [...form.responsibilities, ""])
    }
  }

  function setResponsibility(i: number, value: string) {
    const next = [...form.responsibilities]
    next[i] = value
    update("responsibilities", next)
  }

  function removeResponsibility(i: number) {
    if (form.responsibilities.length > 1) {
      update("responsibilities", form.responsibilities.filter((_, j) => j !== i))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#111827]">
          Job Title <span className="text-[#FF5C3A]">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Software Engineer, Marketing Manager"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-xl border border-[#EAE8FF] px-4 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:border-[#3D2BFF]/40 focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10"
        />
        {errors.title && <p className="mt-1 text-xs text-[#FF5C3A]">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#111827]">
          Industry <span className="text-[#FF5C3A]">*</span>
        </label>
        <select
          value={form.industry}
          onChange={(e) => update("industry", e.target.value)}
          className="w-full rounded-xl border border-[#EAE8FF] px-4 py-2.5 text-sm text-[#111827] transition-colors focus:border-[#3D2BFF]/40 focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10"
        >
          <option value="">Select industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
        {errors.industry && <p className="mt-1 text-xs text-[#FF5C3A]">{errors.industry}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#111827]">
          Company Tone <span className="text-[#FF5C3A]">*</span>
        </label>
        <div className="flex gap-2">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update("tone", t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                form.tone === t
                  ? "bg-[#3D2BFF] text-white"
                  : "border border-[#EAE8FF] text-[#6b7280] hover:border-[#3D2BFF]/30 hover:text-[#111827]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#111827]">
          Output Language <span className="text-[#FF5C3A]">*</span>
        </label>
        <div className="flex gap-2">
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              type="button"
              onClick={() => update("language", l.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                form.language === l.value
                  ? "bg-[#3D2BFF] text-white"
                  : "border border-[#EAE8FF] text-[#6b7280] hover:border-[#3D2BFF]/30 hover:text-[#111827]"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#111827]">
          Key Responsibilities{" "}
          <span className="text-xs font-normal text-[#9ca3af]">(optional)</span>
        </label>
        <div className="space-y-2">
          {form.responsibilities.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder={`Responsibility ${i + 1}`}
                value={r}
                onChange={(e) => setResponsibility(i, e.target.value)}
                className="flex-1 rounded-xl border border-[#EAE8FF] px-4 py-2 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:border-[#3D2BFF]/40 focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10"
              />
              {form.responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResponsibility(i)}
                  className="rounded-lg px-2 text-[#9ca3af] transition-colors hover:text-[#FF5C3A]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {form.responsibilities.length < 5 && (
          <button
            type="button"
            onClick={addResponsibility}
            className="mt-2 text-xs font-medium text-[#3D2BFF] hover:text-[#3525E0]"
          >
            + Add another
          </button>
        )}
      </div>

      <Button
        type="submit"
        disabled={isGenerating}
        className="w-full bg-[#3D2BFF] py-2.5 text-white hover:bg-[#3525E0]"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            Writing your JD...
          </span>
        ) : (
          "Generate Job Description"
        )}
      </Button>
    </form>
  )
}
