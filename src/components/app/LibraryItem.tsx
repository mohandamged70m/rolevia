import Link from "next/link"

interface LibraryItemProps {
  id: string
  title: string
  createdAt: string
  language: string
  snippet: string
}

export function LibraryItem({ id, title, createdAt, language, snippet }: LibraryItemProps) {
  const langLabel = language === "both" ? "Ar/En" : language === "arabic" ? "Ar" : "En"

  return (
    <Link
      href={`/dashboard/library/${id}`}
      className="block rounded-xl border border-[#EAE8FF] bg-white p-4 transition-all hover:border-[#3D2BFF]/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-heading text-sm font-semibold text-[#111827]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-[#6b7280]">{snippet}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
            {langLabel}
          </span>
          <span className="text-[10px] text-[#9ca3af]">{createdAt}</span>
        </div>
      </div>
    </Link>
  )
}
