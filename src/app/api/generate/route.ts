import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { getIp, getUsage, incrementUsage, GENERATION_LIMIT } from "@/lib/usage-store"

const MODEL_ID = "gemini-2.5-flash"

type Language = "arabic" | "english" | "both"

function buildSystemPrompt(language: Language): string {
  const base =
    `You are Rolevia, an AI job description writer for HR teams in the MENA region. ` +
    `Generate a professional job description for the given role ` +
    `following KSA/UAE labor law standards.\n\n` +
    `Structure your response with clear section headings using markdown (## headings).\n` +
    `Use professional HR language. Output ONLY the job description, no thinking or extra text. ` +
    `Keep it concise but comprehensive (~300 words total).`

  if (language === "english") {
    return (
      base +
      `\n\nGenerate in English only. Use these sections:\n` +
      `## Job Title\n` +
      `## About the Role\n` +
      `## Key Responsibilities\n` +
      `## Qualifications & Requirements\n` +
      `## What We Offer`
    )
  }

  if (language === "arabic") {
    return (
      base +
      `\n\nباللغة العربية فقط. استخدم الأقسام التالية:\n` +
      `## المسمى الوظيفي\n` +
      `## عن الوظيفة\n` +
      `## المسؤوليات الرئيسية\n` +
      `## المؤهلات والمتطلبات\n` +
      `## ما نقدمه`
    )
  }

  return (
    base +
    `\n\nGenerate bilingually (Arabic + English). Present each section in English first, then Arabic. Use these sections:\n` +
    `## Job Title (English + Arabic)\n` +
    `## About the Role (English then Arabic)\n` +
    `## Key Responsibilities (English then Arabic)\n` +
    `## Qualifications & Requirements (English then Arabic)\n` +
    `## What We Offer (English then Arabic)`
  )
}

function buildContentPrompt(role: string, language: Language): string {
  const labels: Record<Language, string> = {
    english: `Generate an English job description for: ${role}`,
    arabic: `قم بإنشاء وصف وظيفي باللغة العربية للدور: ${role}`,
    both: `Generate a bilingual job description for: ${role}`,
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
        systemInstruction: buildSystemPrompt(lang),
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      contents: buildContentPrompt(role, lang),
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 },
    )
  }
}
