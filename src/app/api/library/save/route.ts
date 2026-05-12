import { writeFileSync, mkdirSync } from "fs"
import { join } from "path"
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

    const entryId = id || crypto.randomUUID()

    const supabase = await getAuthenticatedSupabase()
    if (supabase) {
      const { data, error } = await supabase
        .from("jd_library")
        .insert({ id: entryId, user_id: user.id, title, content, language })
        .select("id")
        .single()

      if (!error && data) {
        return NextResponse.json({ success: true, id: data.id })
      }

      console.warn("Supabase save failed:", error?.message)
    }

    const dir = join(process.cwd(), ".data", "library")
    mkdirSync(dir, { recursive: true })
    writeFileSync(
      join(dir, `${entryId}.json`),
      JSON.stringify({ id: entryId, user_id: user.id, title, content, language, created_at: new Date().toISOString() }, null, 2),
    )
    return NextResponse.json({ success: true, id: entryId })
  } catch (error) {
    console.error("Library save error:", error)
    const message = error instanceof Error ? error.message : "Failed to save"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
