"use client"

import Link from "next/link"

export default function BookForm() {
  return (
    <Link
      href="/sign-in"
      className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] hover:border-white/40 hover:bg-white/5"
    >
      Sign in
    </Link>
  )
}
