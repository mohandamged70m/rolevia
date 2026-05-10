import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getMonthlyUsage, MONTHLY_LIMIT } from "@/lib/user-usage"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ used: 0, limit: MONTHLY_LIMIT, plan: "free" })
    }

    const { used, limit } = await getMonthlyUsage(user.id)

    return NextResponse.json({ used, limit, plan: "free" })
  } catch {
    return NextResponse.json({ used: 0, limit: MONTHLY_LIMIT, plan: "free" })
  }
}
