import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase/server"

const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error || !code) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/account?linkedin=error`)
  }

  if (!CLIENT_SECRET) {
    return NextResponse.redirect(`${BASE_URL}/dashboard/account?linkedin=not_configured`)
  }

  const user = await currentUser()
  if (!user) {
    return NextResponse.redirect(`${BASE_URL}/sign-in`)
  }

  const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: `${BASE_URL}/api/account/linkedin/callback`,
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET,
      }),
    })

    const tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token

    if (!accessToken) {
      return NextResponse.redirect(`${BASE_URL}/dashboard/account?linkedin=token_error`)
    }

    // Fetch LinkedIn user profile
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const profile = await profileRes.json()
    const linkedinUserId = profile.sub

    // Store in DB
    const supabase = getSupabase()
    if (supabase) {
      await supabase
        .from("users")
        .update({
          linkedin_access_token: accessToken,
          linkedin_user_id: linkedinUserId,
          linkedin_connected_at: new Date().toISOString(),
        })
        .eq("clerk_user_id", user.id)
    }

    return NextResponse.redirect(`${BASE_URL}/dashboard/account?linkedin=connected`)
  } catch {
    return NextResponse.redirect(`${BASE_URL}/dashboard/account?linkedin=error`)
  }
}
