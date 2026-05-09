"use client"

import { useState, type FormEvent } from "react"
import { Loader2, CheckCircle } from "lucide-react"

export default function BookForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(e: FormEvent) {
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
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4">
        <CheckCircle className="h-5 w-5 shrink-0 text-[#10B981]" />
        <div className="text-left">
          <p className="text-sm font-semibold text-white">You&apos;re booked!</p>
          <p className="text-xs text-white/50">We&apos;ll confirm your demo slot shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
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
          className="w-full min-w-[240px] rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-white/50 focus:bg-white/[0.15]"
        />
        {error && <p className="mt-1 text-left text-xs text-[#FF5C3A]">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:border-white/40 hover:bg-white/5 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Booking...
          </>
        ) : (
          "Book a live demo →"
        )}
      </button>
    </form>
  )
}
