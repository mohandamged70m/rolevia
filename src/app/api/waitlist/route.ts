import { NextResponse } from "next/server"
import { addEmail } from "@/lib/book"

export async function POST(request: Request) {
  try {
    const { email, feature } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const result = addEmail(email)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({ message: `You're on the waitlist for ${feature || "upcoming features"}!` }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
