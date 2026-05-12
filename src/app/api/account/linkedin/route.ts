import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase/server"

export async function GET() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ connected: false })
  }

  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
  const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
  const configured = !!(CLIENT_ID && CLIENT_SECRET)

  if (!configured) {
    return NextResponse.json({ connected: false, configured: false })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ connected: false, configured })
  }

  const { data } = await supabase
    .from("users")
    .select("linkedin_user_id, linkedin_connected_at, linkedin_access_token")
    .eq("clerk_user_id", user.id)
    .single()

  const connected = !!(data?.linkedin_access_token && data?.linkedin_user_id)

  return NextResponse.json({
    connected,
    configured,
    linkedinUserId: data?.linkedin_user_id || null,
    connectedAt: data?.linkedin_connected_at || null,
  })
}

export async function DELETE() {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 })
  }

  const { error } = await supabase
    .from("users")
    .update({
      linkedin_access_token: null,
      linkedin_user_id: null,
      linkedin_connected_at: null,
    })
    .eq("clerk_user_id", user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
