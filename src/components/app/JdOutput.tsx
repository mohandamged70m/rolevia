"use client"

import { cn } from "@/lib/utils"
import { JdActions } from "./JdActions"

interface JdOutputProps {
  id?: string
  title?: string
  content: string
  language?: "arabic" | "english" | "both"
  onRegenerate?: () => void
  onSave?: () => void
  isSaving?: boolean
  isRegenerating?: boolean
}

function splitBilingual(text: string): { english: string; arabic: string } {
  const engMatch = text.match(/🇬🇧\s*ENGLISH VERSION\n([\s\S]*?)(?=\n---|\n🇸🇦|$)/)
  const araMatch = text.match(/🇸🇦\s*ARABIC VERSION\n([\s\S]*?)(?=\n---|$)/)

  const english = engMatch ? engMatch[1].trim() : text
  const arabic = araMatch ? araMatch[1].trim() : text

  return { english, arabic }
}

function extractSections(text: string) {
  const lines = text.split("\n")
  const sections: { heading: string; body: string[] }[] = []
  let current: { heading: string; body: string[] } | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    const isHeading =
      /^#{1,3}\s/.test(trimmed) ||
      /^\*\*[^*]+\*\*/.test(trimmed) ||
      /^[A-Z][a-z]+ [A-Z]/.test(trimmed) ||
      /^[A-Z][A-Z\s]+$/.test(trimmed)
    if (isHeading) {
      current = { heading: trimmed.replace(/^#+\s*|\*\*/g, ""), body: [] }
      sections.push(current)
    } else if (current) {
      current.body.push(trimmed)
    }
  }

  return sections.length > 0 ? sections : [{ heading: "", body: lines.filter((l) => l.trim()) }]
}

function OutputPanel({ content, rtl }: { content: string; rtl: boolean }) {
  const sections = extractSections(content)

  return (
    <div
      className={cn(
        "space-y-4 rounded-xl border border-[#EAE8FF] bg-white p-5 text-sm leading-relaxed",
        rtl && "text-right",
      )}
      dir={rtl ? "rtl" : "ltr"}
    >
      {sections.length === 0 ? (
        <p className="text-[#9ca3af]">No content</p>
      ) : (
        sections.map((section, i) => (
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
        ))
      )}
    </div>
  )
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export function JdOutput({
  id,
  title,
  content,
  language = "both",
  onRegenerate,
  onSave,
  isSaving,
  isRegenerating,
}: JdOutputProps) {
  const wordCount = countWords(content)

  if (language === "both") {
    const { english, arabic } = splitBilingual(content)

    return (
      <div className="space-y-4">
        <div className="sticky top-0 z-10 -mx-6 -mt-2 rounded-t-xl border-b border-[#EAE8FF] bg-white/95 px-6 pb-3 pt-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-b-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {title && (
                <h2 className="truncate font-heading text-base font-semibold text-[#111827]">{title}</h2>
              )}
              {id && (
                <span className="shrink-0 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-mono text-[#9ca3af]">
                  #{id.slice(0, 8)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#9ca3af]">{wordCount} words</span>
              <span className="rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
                AR / EN
              </span>
            </div>
          </div>
          <div className="mt-2 sm:hidden">
            <JdActions
              content={content}
              onRegenerate={onRegenerate}
              onSave={onSave}
              isSaving={isSaving}
              isRegenerating={isRegenerating}
            />
          </div>
        </div>

        <div className="hidden sm:block">
          <JdActions
            content={content}
            onRegenerate={onRegenerate}
            onSave={onSave}
            isSaving={isSaving}
            isRegenerating={isRegenerating}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              English
            </p>
            <OutputPanel content={english} rtl={false} />
          </div>
          <div>
            <p className="mb-2 text-right text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              العربية
            </p>
            <OutputPanel content={arabic} rtl={true} />
          </div>
        </div>
      </div>
    )
  }

  const isRtl = language === "arabic"

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-6 -mt-2 rounded-t-xl border-b border-[#EAE8FF] bg-white/95 px-6 pb-3 pt-4 backdrop-blur-sm sm:static sm:mx-0 sm:border-b-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {title && (
              <h2 className="truncate font-heading text-base font-semibold text-[#111827]">{title}</h2>
            )}
            {id && (
              <span className="shrink-0 rounded-full bg-[#F5F5F5] px-2 py-0.5 text-[10px] font-mono text-[#9ca3af]">
                #{id.slice(0, 8)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#9ca3af]">{wordCount} words</span>
            <span className="rounded-full bg-[#F0EEFF] px-2 py-0.5 text-[10px] font-medium text-[#3D2BFF]">
              {language === "arabic" ? "AR" : "EN"}
            </span>
          </div>
        </div>
        <div className="mt-2 sm:hidden">
          <JdActions
            content={content}
            onRegenerate={onRegenerate}
            onSave={onSave}
            isSaving={isSaving}
            isRegenerating={isRegenerating}
          />
        </div>
      </div>

      <div className="hidden sm:block">
        <JdActions
          content={content}
          onRegenerate={onRegenerate}
          onSave={onSave}
          isSaving={isSaving}
          isRegenerating={isRegenerating}
        />
      </div>

      <OutputPanel content={content} rtl={isRtl} />
    </div>
  )
}
