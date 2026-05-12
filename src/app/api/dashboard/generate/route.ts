import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getMonthlyUsage, incrementMonthlyUsage, MONTHLY_LIMIT } from "@/lib/user-usage"

const MODEL_ID = "gemini-2.0-flash-lite"

type Language = "arabic" | "english" | "both"

function buildSystemPrompt(language: Language): string {
  const base =
    `You are an expert HR copywriter and talent acquisition specialist with deep knowledge of the MENA job market. ` +
    `Your job is to write compelling, professional job descriptions in both Arabic and English that attract top-tier candidates.\n\n` +
    `## YOUR TASK\n` +
    `Generate a complete job description based on the inputs provided by the user.\n\n` +
    `## OUTPUT STRUCTURE\n` +
    `Always return the job description with these exact sections:\n\n` +
    `1. **Job Title** — Clear, specific, market-standard title\n` +
    `2. **About the Role** — 2-3 sentences. What the role is, why it exists, what impact it has. NO filler phrases.\n` +
    `3. **Key Responsibilities** — 5-7 bullet points. Start each with a strong action verb. Focus on outcomes, not activities.\n` +
    `4. **Requirements** — Split into:\n` +
    `   - Must-have (hard requirements)\n` +
    `   - Nice-to-have (preferred but not blocking)\n` +
    `5. **What We Offer** — 4-5 specific, differentiating perks. Avoid generic phrases like "competitive salary" or "dynamic team" unless accompanied by a real detail.\n` +
    `6. **About the Company** (if company info is provided) — 2 sentences max. What you do, who you serve.\n\n` +
    `## WRITING RULES\n` +
    `- Tone: Professional but human. Not corporate-robotic.\n` +
    `- Length: Enough to inform, not so long it overwhelms. Aim for 350-500 words per language.\n` +
    `- Avoid: "We are looking for a passionate rockstar ninja", "fast-paced environment", "competitive compensation package", vague superlatives.\n` +
    `- Use: Specific numbers where possible (years of experience, team size, user base, salary range if known).\n` +
    `- For Arabic: Use formal Modern Standard Arabic (فصحى معاصرة). Mirror the same sections, do not add or remove content.\n` +
    `- Both versions should feel natively written, not translated.\n\n` +
    `## OUTPUT FORMAT\n` +
    `Return both versions clearly separated:`

  if (language === "english") {
    return (
      base +
      `\n\n---\n` +
      `🇬🇧 ENGLISH VERSION\n` +
      `[job description in English]\n` +
      `---\n\n` +
      `Generate in English only. Use the exact sections listed above.`
    )
  }

  if (language === "arabic") {
    return (
      base +
      `\n\n---\n` +
      `🇸🇦 ARABIC VERSION\n` +
      `[job description in Arabic]\n` +
      `---\n\n` +
      `باللغة العربية فقط. استخدم الأقسام المذكورة أعلاه. ` +
      `استخدم اللغة العربية الفصحى المعاصرة.`
    )
  }

  return (
    base +
    `\n\n---\n` +
    `🇬🇧 ENGLISH VERSION\n` +
    `[job description in English]\n\n` +
    `---\n` +
    `🇸🇦 ARABIC VERSION\n` +
    `[job description in Arabic]\n` +
    `---\n\n` +
    `Generate bilingually. Present the English version first, then the Arabic version. ` +
    `Use the exact sections listed above for each language.`
  )
}

function buildContextBlock(context: Record<string, string | string[] | undefined>): string {
  const lines: string[] = ["## INPUT CONTEXT"]
  const items: Record<string, string> = {}

  if (context.industry) items["Industry"] = context.industry as string
  if (context.tone) items["Company Tone"] = context.tone as string
  if (context.companyName) items["Company Name"] = context.companyName as string
  if (context.location) items["Location"] = context.location as string
  if (context.experienceLevel) items["Experience Level"] = context.experienceLevel as string
  if (context.employmentType) items["Employment Type"] = context.employmentType as string
  if (context.salaryRange) items["Salary Range"] = context.salaryRange as string
  if (context.skills) items["Key Skills"] = context.skills as string

  const responsibilities = context.responsibilities
  if (Array.isArray(responsibilities) && responsibilities.length > 0) {
    items["Key Responsibilities"] = responsibilities.join(" | ")
  }

  for (const [key, val] of Object.entries(items)) {
    lines.push(`- ${key}: ${val}`)
  }

  return lines.length > 1 ? lines.join("\n") : ""
}

function buildContentPrompt(role: string, language: Language): string {
  const labels: Record<Language, string> = {
    english: `Generate an English job description for the role: ${role}`,
    arabic: `قم بإنشاء وصف وظيفي باللغة العربية للدور: ${role}`,
    both: `Generate a bilingual (English + Arabic) job description for the role: ${role}`,
  }
  return labels[language]
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { used, limit } = await getMonthlyUsage(user.id)

    if (used >= limit) {
      return NextResponse.json(
        { error: "You've reached your monthly limit. Upgrade to generate more JDs.", used, limit, remaining: 0 },
        { status: 403 },
      )
    }

    const { role, language = "both", industry, tone, responsibilities, companyName, location, experienceLevel, employmentType, salaryRange, skills } = await request.json()
    const lang: Language = ["arabic", "english", "both"].includes(language) ? language : "both"

    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    let lastError: Error | null = null
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** attempt, 8000)))
      }
      try {
        const response = await ai.models.generateContent({
          model: MODEL_ID,
          config: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
          contents: buildSystemPrompt(lang) + "\n\n" + buildContextBlock({ industry, tone, responsibilities, companyName, location, experienceLevel, employmentType, salaryRange, skills }) + "\n\n" + buildContentPrompt(role, lang),
        })

        const text = response.text

        if (text) {
          const newUsed = await incrementMonthlyUsage(user.id)
          const remaining = Math.max(0, limit - newUsed)

          return NextResponse.json({
            content: text,
            used: newUsed,
            limit,
            remaining,
          })
        }

        lastError = new Error("No content generated")
        break
      } catch (e) {
        lastError = e instanceof Error ? e : new Error("Generation failed")
        const msg = lastError.message
        const isRetriable = msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("500") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")
        if (!isRetriable) break
      }
    }

    throw lastError || new Error("Generation failed")
  } catch (error) {
    console.error("Dashboard generation error:", error)
    const msg = error instanceof Error ? error.message : "Generation failed"
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")
    const isUnavailable = msg.includes("503") || msg.includes("UNAVAILABLE")
    if (isQuota) {
      return NextResponse.json(
        { error: "Daily API limit reached. Please try again tomorrow or upgrade your plan.", retryAfter: "24h" },
        { status: 429 },
      )
    }
    if (isUnavailable) {
      return NextResponse.json(
        { error: "AI service is temporarily unavailable. Please try again in a few seconds.", retryAfter: "5s" },
        { status: 503 },
      )
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 },
    )
  }
}
