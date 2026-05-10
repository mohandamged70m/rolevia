import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { getIp, getUsage, incrementUsage, GENERATION_LIMIT } from "@/lib/usage-store"

const MODEL_ID = "gemini-2.5-flash"

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

function buildContentPrompt(role: string, language: Language): string {
  const labels: Record<Language, string> = {
    english: `Generate an English job description for the role: ${role}`,
    arabic: `قم بإنشاء وصف وظيفي باللغة العربية للدور: ${role}`,
    both: `Generate a bilingual (English + Arabic) job description for the role: ${role}`,
  }
  return labels[language]
}

export async function GET(request: Request) {
  const ip = getIp(request)
  const used = await getUsage(ip)
  return NextResponse.json({ remaining: Math.max(0, GENERATION_LIMIT - used) })
}

export async function POST(request: Request) {
  try {
    const ip = getIp(request)
    const used = await getUsage(ip)

    if (used >= GENERATION_LIMIT) {
      return NextResponse.json(
        { error: "You've used all free generations. Book a demo for unlimited access.", remaining: 0 },
        { status: 403 },
      )
    }

    const { role, language = "both" } = await request.json()
    const lang: Language = ["arabic", "english", "both"].includes(language) ? language : "both"

    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      config: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
      contents: buildSystemPrompt(lang) + "\n\n" + buildContentPrompt(role, lang),
    })

    const text = response.text

    if (!text) {
      return NextResponse.json({ error: "No content generated" }, { status: 500 })
    }

    const newUsed = await incrementUsage(ip)
    const remaining = Math.max(0, GENERATION_LIMIT - newUsed)

    return NextResponse.json({ content: text, remaining })
  } catch (error) {
    console.error("Generation error:", error)
    const msg = error instanceof Error ? error.message : "Generation failed"
    const isQuota = msg.includes("429") || msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED")
    if (isQuota) {
      return NextResponse.json(
        { error: "Daily API limit reached. Please try again tomorrow or upgrade your plan.", retryAfter: "24h" },
        { status: 429 },
      )
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 },
    )
  }
}
