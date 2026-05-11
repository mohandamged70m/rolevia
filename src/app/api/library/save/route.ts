import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content, language } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const supabase = await getAuthenticatedSupabase()

    if (!supabase) {
      const { writeFileSync, mkdirSync } = await import("fs")
      const { join } = await import("path")
      const dir = join(process.cwd(), ".data", "library")
      mkdirSync(dir, { recursive: true })
      const id = crypto.randomUUID()
      const entry = { id, user_id: user.id, title, content, language, created_at: new Date().toISOString() }
      writeFileSync(join(dir, `${id}.json`), JSON.stringify(entry, null, 2))
      return NextResponse.json({ success: true, id })
    }

    const { data, error } = await supabase
      .from("jd_library")
      .insert({ user_id: user.id, title, content, language })
      .select("id")
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error("Library save error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }
}
