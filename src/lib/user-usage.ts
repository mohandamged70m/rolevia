import { getSupabase } from "./supabase/server"

const MONTHLY_LIMIT = 10

function getStoreDir(): string {
  try {
    const { accessSync, constants } = require("fs")
    accessSync(process.cwd(), constants.W_OK)
    return require("path").join(process.cwd(), ".data", "user-usage")
  } catch {
    return require("path").join("/tmp", ".data", "user-usage")
  }
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export async function getMonthlyUsage(userId: string): Promise<{ used: number; limit: number }> {
  const supabase = getSupabase()

  if (supabase) {
    try {
      const monthYear = getCurrentMonth()
      const { count } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("month_year", monthYear)
      return { used: count ?? 0, limit: MONTHLY_LIMIT }
    } catch (err) {
      console.error("Supabase usage fetch failed, using file fallback:", err)
    }
  }

  const { readFileSync, existsSync, mkdirSync } = await import("fs")
  const dir = getStoreDir()
  mkdirSync(dir, { recursive: true })
  const file = require("path").join(dir, `${userId}.json`)

  if (!existsSync(file)) return { used: 0, limit: MONTHLY_LIMIT }

  const data = JSON.parse(readFileSync(file, "utf-8"))
  const month = getCurrentMonth()
  return { used: data[month] ?? 0, limit: MONTHLY_LIMIT }
}

export async function incrementMonthlyUsage(userId: string): Promise<number> {
  const supabase = getSupabase()
  const monthYear = getCurrentMonth()

  if (supabase) {
    try {
      const { error } = await supabase
        .from("generations")
        .insert({ user_id: userId, month_year: monthYear, count: 1 })
      if (error) console.error("Failed to insert generation:", error)

      const { count } = await supabase
        .from("generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("month_year", monthYear)
      return count ?? 0
    } catch (err) {
      console.error("Supabase usage increment failed, using file fallback:", err)
    }
  }

  const { readFileSync, existsSync, mkdirSync, writeFileSync } = await import("fs")
  const dir = getStoreDir()
  mkdirSync(dir, { recursive: true })
  const file = require("path").join(dir, `${userId}.json`)

  let data: Record<string, number> = {}
  if (existsSync(file)) {
    data = JSON.parse(readFileSync(file, "utf-8"))
  }

  data[monthYear] = (data[monthYear] ?? 0) + 1
  writeFileSync(file, JSON.stringify(data, null, 2))

  return data[monthYear]
}

export { MONTHLY_LIMIT }
