import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, title, content, language } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const supabase = await getAuthenticatedSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const entryId = id || crypto.randomUUID()
    const { data, error } = await supabase
      .from("jd_library")
      .insert({ id: entryId, user_id: user.id, title, content, language })
      .select("id")
      .single()

    if (error) {
      console.error("Supabase save failed:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error("Library save error:", error)
    const message = error instanceof Error ? error.message : "Failed to save"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
