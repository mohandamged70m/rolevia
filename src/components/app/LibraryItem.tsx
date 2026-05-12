"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LibraryItemProps {
  id: string
  title: string
  createdAt: string
  language: string
  snippet: string
}

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const diff = now - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function LibraryItem({ id, title, createdAt, language, snippet }: LibraryItemProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const langLabel = language === "both" ? "AR/EN" : language === "arabic" ? "AR" : "EN"
  const wordCount = snippet.length > 0 ? snippet.split(/\s+/).filter(Boolean).length : 0

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (deleting) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/library/delete?id=${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } catch {
      setDeleting(false)
    }
  }

  return (
    <Link
      href={`/dashboard/library/${id}`}
      className="group relative block rounded-xl border border-[#EAE8FF] bg-white transition-all hover:border-[#3D2BFF]/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-sm font-semibold text-[#111827]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-[#6b7280]">{snippet}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
            {langLabel}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#EAE8FF]/60 px-4 py-2">
        <div className="flex items-center gap-3 text-[10px] text-[#9ca3af]">
          <span>{relativeTime(createdAt)}</span>
          <span>{wordCount} words</span>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium text-[#9ca3af] opacity-0 transition-all hover:bg-[#FF5C3A]/10 hover:text-[#FF5C3A] group-hover:opacity-100"
        >
          {deleting ? (
            <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          )}
          Delete
        </button>
      </div>
    </Link>
  )
}
