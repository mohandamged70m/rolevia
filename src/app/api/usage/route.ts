import { NextResponse } from "next/server"
import { currentUser, auth } from "@clerk/nextjs/server"
import { getMonthlyUsage, MONTHLY_LIMIT } from "@/lib/user-usage"
import { getUserPlan, getPlanLimit } from "@/lib/payments/plans"

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ used: 0, limit: MONTHLY_LIMIT, plan: "free" })
    }

    const { has } = await auth()
    const plan = getUserPlan(has)
    const { used } = await getMonthlyUsage(user.id)
    const planLimit = getPlanLimit(plan)
    const limit = typeof planLimit === "number" ? planLimit : 999999

    return NextResponse.json({ used, limit, plan })
  } catch {
    return NextResponse.json({ used: 0, limit: MONTHLY_LIMIT, plan: "free" })
  }
}
