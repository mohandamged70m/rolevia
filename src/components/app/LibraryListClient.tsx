"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { LibraryItem } from "@/components/app/LibraryItem"

interface LibraryEntry {
  id: string
  title: string
  created_at: string
  language: string
  content: string
}

export function LibraryListClient({ items }: { items: LibraryEntry[] }) {
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState<"newest" | "oldest">("newest")

  const filtered = useMemo(() => {
    let result = items
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter((item) => item.title.toLowerCase().includes(q))
    }
    return [...result].sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return sort === "newest" ? diff : -diff
    })
  }, [items, query, sort])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#111827]">Your Library</h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            {items.length} saved job {items.length === 1 ? "description" : "descriptions"}
          </p>
        </div>
        <Link
          href="/dashboard/generate"
          className="inline-flex self-start rounded-xl bg-[#3D2BFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
        >
          + Generate new
        </Link>
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-[#EAE8FF] bg-white py-2 pl-9 pr-3 text-sm text-[#111827] placeholder:text-[#9ca3af] transition-colors focus:border-[#3D2BFF]/40 focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="self-stretch rounded-xl border border-[#EAE8FF] bg-white px-3 py-2 text-sm text-[#6b7280] transition-colors focus:border-[#3D2BFF]/40 focus:outline-none focus:ring-2 focus:ring-[#3D2BFF]/10"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#EAE8FF] bg-white/50 py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0EEFF]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3D2BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6" />
                <path d="m9 15 3-3 3 3" />
              </svg>
            </div>
            <h3 className="mt-4 font-heading text-sm font-semibold text-[#111827]">No saved JDs yet</h3>
            <p className="mt-1 text-xs text-[#9ca3af]">Generate your first job description and save it here.</p>
            <Link
              href="/dashboard/generate"
              className="mt-4 rounded-lg bg-[#3D2BFF] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#3525E0]"
            >
              Generate your first JD
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#EAE8FF] bg-white/50 py-12">
            <p className="text-sm text-[#9ca3af]">No results match &quot;{query}&quot;</p>
            <button onClick={() => setQuery("")} className="mt-2 text-xs font-medium text-[#3D2BFF] hover:text-[#3525E0]">
              Clear search
            </button>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <LibraryItem
              key={item.id}
              id={item.id}
              title={item.title}
              createdAt={item.created_at}
              language={item.language}
              snippet={item.content.slice(0, 150)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
