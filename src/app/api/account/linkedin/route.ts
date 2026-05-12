import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { linkedinUrl } = await request.json()
    if (typeof linkedinUrl !== "string") {
      return NextResponse.json({ error: "linkedinUrl is required" }, { status: 400 })
    }

    const supabase = getSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const trimmed = linkedinUrl.trim() || null

    const { error } = await supabase
      .from("users")
      .update({ linkedin_url: trimmed })
      .eq("clerk_user_id", user.id)

    if (error) {
      console.error("Supabase update failed:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ linkedinUrl: trimmed })
  } catch (error) {
    console.error("LinkedIn save error:", error)
    const message = error instanceof Error ? error.message : "Failed to save"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
