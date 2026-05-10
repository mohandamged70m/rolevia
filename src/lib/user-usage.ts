import { clerkClient } from "@clerk/nextjs/server"

const MONTHLY_LIMIT = 10
const ERROR_PREFIX = "clerk:gen:"

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export async function getMonthlyUsage(userId: string): Promise<{ used: number; limit: number }> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const raw = (user.publicMetadata?.generations as Record<string, number> | undefined)?.[getCurrentMonth()]
    return { used: raw ?? 0, limit: MONTHLY_LIMIT }
  } catch (err) {
    console.error("Clerk usage fetch failed:", err)
    return { used: 0, limit: MONTHLY_LIMIT }
  }
}

export async function incrementMonthlyUsage(userId: string): Promise<number> {
  const monthYear = getCurrentMonth()

  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const gens: Record<string, number> = (user.publicMetadata?.generations as Record<string, number>) ?? {}
    gens[monthYear] = (gens[monthYear] ?? 0) + 1
    await client.users.updateUser(userId, {
      publicMetadata: { ...user.publicMetadata, generations: gens },
    })
    return gens[monthYear]
  } catch (err) {
    console.error("Clerk usage increment failed:", err)
    return 0
  }
}

export { MONTHLY_LIMIT }
