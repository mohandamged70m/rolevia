import { NextRequest, NextResponse } from "next/server"

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function GET() {
  if (!CLIENT_ID) {
    return NextResponse.json({ error: "LinkedIn not configured" }, { status: 501 })
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/account/linkedin/callback`,
    scope: ["openid", "profile", "email", "w_member_social"].join(" "),
    state: crypto.randomUUID(),
  })

  return NextResponse.redirect(`https://www.linkedin.com/oauth/v2/authorization?${params}`)
}
