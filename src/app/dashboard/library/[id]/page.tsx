import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { isClerkConfigured } from "@/lib/clerk"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"
import { JdOutput } from "@/components/app/JdOutput"
import { DeleteButton } from "@/components/app/DeleteButton"

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

async function getEntry(id: string, userId: string): Promise<LibraryEntry | null> {
  try {
    const supabase = await getAuthenticatedSupabase()
    if (!supabase) return null
    const { data } = await supabase
      .from("jd_library")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()
    return data
  } catch {
    return null
  }
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} minutes ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} months ago`
  return `${Math.floor(months / 12)} years ago`
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

const langLabels: Record<string, string> = {
  arabic: "Arabic",
  english: "English",
  both: "Arabic / English",
}

export default async function LibraryIdPage({ params }: PageProps) {
  if (!isClerkConfigured) redirect("/")

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const { id } = await params
  const entry = await getEntry(id, user.id)

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#EAE8FF] bg-white/50 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EEFF]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </div>
        <h2 className="mt-4 font-heading text-sm font-semibold text-[#111827]">JD not found</h2>
        <p className="mt-1 text-xs text-[#9ca3af]">This job description doesn&apos;t exist or has been deleted.</p>
        <Link
          href="/dashboard/library"
          className="mt-4 rounded-lg bg-[#3D2BFF] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
        >
          Back to library
        </Link>
      </div>
    )
  }

  const wc = wordCount(entry.content)
  const langLabel = langLabels[entry.language] || entry.language

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <Link
          href="/dashboard/library"
          className="inline-flex items-center gap-1 text-sm text-[#6b7280] transition-colors hover:text-[#3D2BFF]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </Link>
        <DeleteButton id={entry.id} />
      </div>

      <div className="rounded-xl border border-[#EAE8FF] bg-white/50 p-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#6b7280]">
          <span className="rounded-full bg-[#F0EEFF] px-2 py-0.5 font-medium text-[#3D2BFF]">
            {langLabel}
          </span>
          <span>{wc.toLocaleString()} words</span>
          <span>Saved {relativeTime(entry.created_at)}</span>
        </div>
      </div>

      <JdOutput
        id={entry.id}
        title={entry.title}
        content={entry.content}
        language={entry.language as "arabic" | "english" | "both"}
      />
    </div>
  )
}
