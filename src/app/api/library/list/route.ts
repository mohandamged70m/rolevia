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
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { data, error } = await supabase
      .from("jd_library")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase list failed:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data, total: data.length })
  } catch (error) {
    console.error("Library list error:", error)
    const message = error instanceof Error ? error.message : "Failed to list"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
