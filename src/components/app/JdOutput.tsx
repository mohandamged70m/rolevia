"use client"

import { cn } from "@/lib/utils"
import { JdActions } from "./JdActions"

interface JdOutputProps {
  title?: string
  content: string
  language?: "arabic" | "english" | "both"
  onRegenerate?: () => void
  onSave?: () => void
  isSaving?: boolean
  isRegenerating?: boolean
}

function extractSections(text: string) {
  const lines = text.split("\n")
  const sections: { heading: string; body: string[] }[] = []
  let current: { heading: string; body: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (/^#{1,3}\s/.test(trimmed) || /^\*\*[^*]+\*\*/.test(trimmed) || /^[A-Z][a-z]+ [A-Z]/.test(trimmed) || /^[A-Z][A-Z\s]+$/.test(trimmed)) {
      current = { heading: trimmed.replace(/^#+\s*|\*\*/g, ""), body: [] }
      sections.push(current)
    } else if (current) {
      current.body.push(trimmed)
    }
  }

  return sections.length > 0 ? sections : [{ heading: "", body: lines.filter((l) => l.trim()) }]
}

export function JdOutput({
  title,
  content,
  language = "both",
  onRegenerate,
  onSave,
  isSaving,
  isRegenerating,
}: JdOutputProps) {
  const isRtl = language === "arabic"
  const sections = extractSections(content)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {title && (
          <h2 className="font-heading text-base font-semibold text-[#111827]">{title}</h2>
        )}
        <JdActions
          content={content}
          onRegenerate={onRegenerate}
          onSave={onSave}
          isSaving={isSaving}
          isRegenerating={isRegenerating}
        />
      </div>

      <div
        className={cn(
          "rounded-xl border border-[#EAE8FF] bg-white p-5 text-sm leading-relaxed",
          isRtl && "text-right",
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {sections.map((section, i) => (
          <div key={i} className="mb-4 last:mb-0">
            {section.heading && (
              <h3 className="mb-2 font-heading text-sm font-semibold text-[#3D2BFF]">
                {section.heading}
              </h3>
            )}
            {section.body.map((line, j) => {
              const isBullet = /^[-*•]\s/.test(line)
              const clean = line.replace(/^[-*•]\s*/, "")
              return (
                <p key={j} className={cn("mb-1 text-[#4b5563]", isBullet && "flex gap-2")}>
                  {isBullet && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3D2BFF]/30" />}
                  <span>{clean}</span>
                </p>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
