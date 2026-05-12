import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { isClerkConfigured } from "@/lib/clerk"
import { JdOutput } from "@/components/app/JdOutput"

interface PageProps {
  params: Promise<{ id: string }>
}

interface LibraryEntry {
  id: string
  title: string
  content: string
  language: string
  created_at: string
}

async function getEntry(id: string): Promise<LibraryEntry | null> {
  try {
    const cookieStore = await cookies()
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/library/list`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = await res.json()
    return (data.items || []).find((item: LibraryEntry) => item.id === id) || null
  } catch {
    return null
  }
}

export default async function LibraryIdPage({ params }: PageProps) {
  if (!isClerkConfigured) redirect("/")

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const { id } = await params
  const entry = await getEntry(id)

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="font-heading text-lg font-semibold text-[#111827]">JD not found</h2>
        <p className="mt-1 text-sm text-[#6b7280]">This job description doesn&apos;t exist or has been deleted.</p>
        <Link
          href="/dashboard/library"
          className="mt-4 rounded-lg bg-[#3D2BFF] px-3 py-1.5 text-sm font-medium text-white"
        >
          Back to library
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Link
        href="/dashboard/library"
        className="inline-flex items-center gap-1 text-sm text-[#6b7280] transition-colors hover:text-[#3D2BFF]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to library
      </Link>
      <JdOutput
        id={entry.id}
        title={entry.title}
        content={entry.content}
        language={entry.language as "arabic" | "english" | "both"}
      />
    </div>
  )
}
