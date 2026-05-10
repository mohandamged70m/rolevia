import { GoogleGenAI } from "@google/genai"
import { NextResponse } from "next/server"
import { getIp, getUsage, incrementUsage, GENERATION_LIMIT } from "@/lib/usage-store"

const MODEL_ID = "gemini-2.5-flash"

const SYSTEM_PROMPT =
  `You are Rolevia, an AI job description writer for HR teams in the MENA region. ` +
  `Generate a professional bilingual (Arabic + English) job description for the given role ` +
  `following KSA/UAE labor law standards.\n\n` +
  `Structure your response with clear section headings using markdown (## headings):\n` +
  `## Job Title (English + Arabic)\n` +
  `## About the Role (English then Arabic)\n` +
  `## Key Responsibilities (English then Arabic)\n` +
  `## Qualifications & Requirements (English then Arabic)\n` +
  `## What We Offer (English then Arabic)\n\n` +
  `Use professional HR language. Output ONLY the job description, no thinking or extra text. ` +
  `Keep it concise but comprehensive (~300 words total).`

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

    const { role } = await request.json()

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
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
      contents: `Generate a bilingual job description for: ${role}`,
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
