"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function SignOutButton() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleSignOut() {
    setPending(true)
    await signOut()
    router.push("/")
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={pending}
      className="rounded-lg border border-[#FF5C3A]/30 px-4 py-2 text-sm font-medium text-[#FF5C3A] transition-colors hover:bg-[#FF5C3A]/5 disabled:opacity-50"
    >
      {pending ? "Signing out..." : "Sign out"}
    </button>
  )
}
