import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      const { readdirSync, existsSync } = await import("fs")
      const { join } = await import("path")
      const dir = join(process.cwd(), ".data", "library")
      if (!existsSync(dir)) return NextResponse.json({ items: [], total: 0 })
      const files = readdirSync(dir)
      const items = files
        .filter((f) => f.endsWith(".json"))
        .map((f) => {
          const { readFileSync } = require("fs")
          return JSON.parse(readFileSync(join(dir, f), "utf-8"))
        })
        .filter((item: { user_id: string }) => item.user_id === user.id)
        .sort((a: { created_at: string }, b: { created_at: string }) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      return NextResponse.json({ items, total: items.length })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
      .from("jd_library")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json({ items: data || [], total: (data || []).length })
  } catch (error) {
    console.error("Library list error:", error)
    return NextResponse.json({ error: "Failed to list" }, { status: 500 })
  }
}
