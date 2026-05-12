import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { isClerkConfigured } from "@/lib/clerk"
import { LibraryItem } from "@/components/app/LibraryItem"

interface LibraryEntry {
  id: string
  title: string
  created_at: string
  language: string
  content: string
}

async function getLibrary(): Promise<LibraryEntry[]> {
  try {
    const cookieStore = await cookies()
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/library/list`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch {
    return []
  }
}

export default async function LibraryPage() {
  if (!isClerkConfigured) redirect("/")

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const items = await getLibrary()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#111827]">Your Library</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Saved job descriptions — {items.length} total
          </p>
        </div>
        <Link
          href="/dashboard/generate"
          className="inline-flex self-start rounded-xl bg-[#3D2BFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
        >
          Generate new
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#EAE8FF] bg-white/50 py-16">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
            <path d="M14 2v6h6" />
            <path d="M12 18v-6" />
            <path d="m9 15 3-3 3 3" />
          </svg>
          <h3 className="mt-4 font-heading text-sm font-semibold text-[#9ca3af]">No saved JDs yet</h3>
          <p className="mt-1 text-xs text-[#9ca3af]">Generate your first job description and save it here.</p>
          <Link
            href="/dashboard/generate"
            className="mt-4 rounded-lg bg-[#3D2BFF] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
          >
            Generate your first JD
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <LibraryItem
              key={item.id}
              id={item.id}
              title={item.title}
              createdAt={new Date(item.created_at).toLocaleDateString()}
              language={item.language}
              snippet={item.content.slice(0, 150)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
