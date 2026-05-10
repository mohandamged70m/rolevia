import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"

const FREE_LIMIT = 10

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ used: 0, limit: FREE_LIMIT, plan: "free" })
    }

    const { createClient } = await import("@supabase/supabase-js")
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    let used = 0

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const now = new Date()
      const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      const { count } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("month_year", monthYear)
      used = count || 0
    }

    return NextResponse.json({ used, limit: FREE_LIMIT, plan: "free" })
  } catch {
    return NextResponse.json({ used: 0, limit: FREE_LIMIT, plan: "free" })
  }
}
