import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await getAuthenticatedSupabase()

    let items: any[] = []

    if (supabase) {
      const { data, error } = await supabase
        .from("jd_library")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && data) {
        items = data
      } else {
        console.warn("Supabase list failed, falling back to file system:", error?.message)
      }
    }

    if (items.length === 0 || !supabase) {
      const { readdirSync, existsSync, readFileSync } = await import("fs")
      const { join } = await import("path")
      const dir = join(process.cwd(), ".data", "library")
      if (existsSync(dir)) {
        const files = readdirSync(dir)
        items = files
          .filter((f) => f.endsWith(".json"))
          .map((f) => JSON.parse(readFileSync(join(dir, f), "utf-8")))
          .filter((item: { user_id: string }) => item.user_id === user.id)
      }
    }

    items.sort((a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    return NextResponse.json({ items, total: items.length })
  } catch (error) {
    console.error("Library list error:", error)
    return NextResponse.json({ error: "Failed to list" }, { status: 500 })
  }
}
