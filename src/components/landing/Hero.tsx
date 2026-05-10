"use client"

import { useState, useEffect } from "react"
import { Loader2, CheckCircle, X } from "lucide-react"

const TAGS = [
  "Professional",
  "Arabic/English",
  "KSA labor law",
  "UAE",
  "Egypt",
  "Startup-ready",
  "Include salary band",
]

const GENERATION_LIMIT = 3

export default function Hero() {
  const [role, setRole] = useState("Senior Product Manager")
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [generationsRemaining, setGenerationsRemaining] = useState<number | null>(null)
  const [showBookingPopup, setShowBookingPopup] = useState(false)

  useEffect(() => {
    fetch("/api/generate")
      .then((r) => r.json())
      .then((data) => setGenerationsRemaining(data.remaining))
      .catch(() => setGenerationsRemaining(GENERATION_LIMIT))
  }, [])

  async function handleGenerate() {
    if (!role.trim()) return
    setLoading(true)
    setError(null)
    setGeneratedContent(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: role.trim() }),
      })
      const data = await res.json()

      if (data.remaining !== undefined) {
        setGenerationsRemaining(data.remaining)
      }

      if (!res.ok) throw new Error(data.error || "Generation failed")

      setGeneratedContent(data.content)

      if (data.remaining <= 0) {
        setShowBookingPopup(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!generatedContent) return
    navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleGenerate()
  }

  return (
    <section className="relative overflow-hidden px-4 pb-32 pt-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F0EEFF] via-[#F0EEFF]/50 to-white" />
      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#EAE8FF] bg-white px-4 py-1.5 text-xs font-medium text-[#4b5563] shadow-sm">
          <span className="rounded-full bg-[#FF5C3A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            NEW
          </span>
          Now supporting Arabic & bilingual JDs for MENA markets
        </div>

        <h1 className="font-heading text-[42px] font-extrabold leading-[1.05] tracking-[-2px] text-[#111827] sm:text-[56px] lg:text-[68px]">
          Write perfect job descriptions,{" "}
          <em className="not-italic text-[#3D2BFF] underline decoration-[#FF5C3A] decoration-4 underline-offset-8">
            in seconds
          </em>
          , for any role.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-[#6b7280] sm:text-xl">
          The AI-powered job description writer built for HR teams in MENA.
          Attract top talent, stay compliant, and cut writing time by 90%.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="inline-flex items-center rounded-xl bg-[#3D2BFF] px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-[#3D2BFF]/25 transition-all hover:scale-[1.02] hover:bg-[#3525E0]"
          >
            Try for free &mdash; no credit card
          </a>
          <a
            href="#"
            className="inline-flex items-center rounded-xl border-2 border-[#3D2BFF]/20 px-8 py-3.5 text-base font-medium text-[#3D2BFF] transition-all hover:scale-[1.02] hover:border-[#3D2BFF]/40 hover:bg-[#F8F7FF]"
          >
            See a live demo &rarr;
          </a>
        </div>
      </div>

      {/* Browser mockup card */}
      <div className="relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-t-2xl border border-[#EAE8FF] bg-white shadow-2xl shadow-[#3D2BFF]/5">
        {/* Top bar */}
        <div className="flex items-center gap-3 border-b border-[#EAE8FF] bg-[#F8F7FF] px-4 py-3">
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-[#FF5F56]" />
            <div className="size-3 rounded-full bg-[#FFBD2E]" />
            <div className="size-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="flex-1 rounded-md bg-white px-3 py-1.5 text-center text-xs text-[#9ca3af] shadow-sm">
            app.rolevia.ai /new-job
          </div>
        </div>

        {/* Mockup body */}
        <div className="p-6 sm:p-8">
          {/* Role input */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-[#6b7280]">
              Enter a role title
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-[#EAE8FF] bg-white px-4 py-1 shadow-sm transition-shadow focus-within:border-[#3D2BFF]/40 focus-within:shadow-[#3D2BFF]/10">
              <svg className="h-5 w-5 shrink-0 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Software Engineer"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af]"
              />
              <button
                onClick={handleGenerate}
                disabled={loading || !role.trim() || (generationsRemaining !== null && generationsRemaining <= 0)}
                className="shrink-0 rounded-md bg-[#3D2BFF] px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-[#3525E0] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generationsRemaining !== null && generationsRemaining <= 0
                  ? "Limit reached"
                  : loading
                    ? "Generating..."
                    : "Generate"}
              </button>
            </div>
          </div>

          {/* Tag chips */}
          <div className="mb-6 flex flex-wrap gap-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#EAE8FF] bg-white px-3 py-1 text-xs font-medium text-[#4b5563] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Remaining count */}
          {generationsRemaining !== null && (
            <div className="mb-3 flex items-center justify-between text-xs text-[#6b7280]">
              <span>
                {generationsRemaining > 0
                  ? `${generationsRemaining} / ${GENERATION_LIMIT} free generations remaining`
                  : "You've used all free generations"}
              </span>
              {generationsRemaining > 0 && generationsRemaining <= 2 && (
                <span className="rounded-full border border-[#FFBD2E]/30 bg-[#FFBD2E]/10 px-2.5 py-0.5 font-medium text-[#B8860B]">
                  {generationsRemaining === 1 ? "Last one!" : `${generationsRemaining} left`}
                </span>
              )}
            </div>
          )}

          {/* Output area */}
          <div className="min-h-[200px] rounded-xl bg-[#F8F7FF] p-5">
            {loading && (
              <div className="space-y-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#EAE8FF]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#EAE8FF]" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-[#EAE8FF]" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-[#EAE8FF]" />
                <div className="h-4 w-full animate-pulse rounded bg-[#EAE8FF]" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-[#EAE8FF]" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-[#EAE8FF]" />
              </div>
            )}

            {!loading && !generatedContent && !error && (
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-[#EAE8FF]/50" />
                <div className="h-4 w-full rounded bg-[#EAE8FF]/50" />
                <div className="h-4 w-5/6 rounded bg-[#EAE8FF]/50" />
                <div className="h-4 w-2/3 rounded bg-[#EAE8FF]/50" />
                <div className="h-4 w-full rounded bg-[#EAE8FF]/50" />
                <div className="h-4 w-4/5 rounded bg-[#EAE8FF]/50" />
                <div className="h-4 w-1/2 rounded bg-[#EAE8FF]/50" />
              </div>
            )}

            {!loading && generatedContent && (
              <div className="prose prose-sm max-w-none text-[#111827]">
                {generatedContent.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="mb-4 text-xl font-bold text-[#111827]">
                        {line.replace(/^# /, "")}
                      </h1>
                    )
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="mb-3 mt-5 text-base font-semibold text-[#3D2BFF]">
                        {line.replace(/^## /, "")}
                      </h2>
                    )
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="mb-2 mt-4 text-sm font-semibold text-[#111827]">
                        {line.replace(/^### /, "")}
                      </h3>
                    )
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <li key={i} className="ml-4 list-disc text-sm leading-relaxed text-[#4b5563]">
                        {line.replace(/^- /, "")}
                      </li>
                    )
                  }
                  if (line.trim() === "") {
                    return <div key={i} className="h-2" />
                  }
                  return (
                    <p key={i} className="text-sm leading-relaxed text-[#4b5563]">
                      {line}
                    </p>
                  )
                })}
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="rounded-md bg-[#3D2BFF] px-4 py-2 text-xs font-medium text-white transition-all hover:bg-[#3525E0]"
                >
                  Try again
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={handleCopy}
              disabled={!generatedContent}
              className="rounded-lg bg-[#3D2BFF] px-4 py-2 text-xs font-medium text-white transition-all hover:bg-[#3525E0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              disabled={!generatedContent}
              className="rounded-lg border border-[#EAE8FF] px-4 py-2 text-xs font-medium text-[#4b5563] transition-all hover:border-[#3D2BFF]/30 hover:text-[#3D2BFF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Export to ATS
            </button>
            <button
              disabled={!generatedContent}
              className="rounded-lg border border-[#EAE8FF] px-4 py-2 text-xs font-medium text-[#4b5563] transition-all hover:border-[#3D2BFF]/30 hover:text-[#3D2BFF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Arabic version
            </button>
          </div>
        </div>
      </div>
      {/* Booking popup */}
      {showBookingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <button
              onClick={() => setShowBookingPopup(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-[#9ca3af] transition-colors hover:bg-[#F8F7FF] hover:text-[#111827]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0ED]">
                <span className="text-xl">🎉</span>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">
                You&apos;ve used all free generations!
              </h3>
              <p className="mt-1.5 text-sm text-[#6b7280]">
                Want unlimited access? Book a demo to see what Rolevia can do for your team.
              </p>
            </div>

            <BookingFormInline onClose={() => setShowBookingPopup(false)} />
          </div>
        </div>
      )}
    </section>
  )
}

function BookingFormInline({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
        return
      }

      setSubmitted(true)
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 px-6 py-4">
        <CheckCircle className="h-5 w-5 shrink-0 text-[#10B981]" />
        <div className="text-left">
          <p className="text-sm font-semibold text-[#111827]">You&apos;re booked!</p>
          <p className="text-xs text-[#6b7280]">We&apos;ll confirm your demo slot shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError("")
          }}
          disabled={loading}
          className="w-full rounded-xl border border-[#EAE8FF] bg-white px-4 py-3 text-sm text-[#111827] outline-none transition-all placeholder:text-[#9ca3af] focus:border-[#3D2BFF]/40"
        />
        {error && <p className="mt-1 text-xs text-[#FF5C3A]">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3D2BFF] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#3D2BFF]/25 transition-all hover:bg-[#3525E0] disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Booking...
          </>
        ) : (
          "Book a live demo"
        )}
      </button>
      <p className="text-center text-xs text-[#9ca3af]">
        No credit card required &middot; Cancel anytime
      </p>
    </form>
  )
}
