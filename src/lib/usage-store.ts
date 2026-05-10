import fs from "fs/promises"
import path from "path"
import { getSupabase } from "./supabase/server"

const STORE_PATH = path.join(process.cwd(), ".usage-store.json")
export const GENERATION_LIMIT = 3

interface Store {
  [date: string]: {
    [ip: string]: number
  }
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

export function getIp(request: Request): string {
  return getClientIp(request)
}

async function readFileStore(): Promise<Store> {
  try {
    const data = await fs.readFile(STORE_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
  }
}

async function writeFileStore(store: Store): Promise<void> {
  try {
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2))
  } catch (err) {
    console.warn("File store write failed (read-only fs?):", err)
  }
}

export async function getUsage(ip: string): Promise<number> {
  const supabase = getSupabase()
  if (supabase) {
    const today = getTodayKey()
    const { data } = await supabase
      .from("usage_tracking")
      .select("count")
      .eq("ip_address", ip)
      .eq("date", today)
      .maybeSingle()
    return data?.count ?? 0
  }

  const store = await readFileStore()
  return store[getTodayKey()]?.[ip] ?? 0
}

export async function incrementUsage(ip: string): Promise<number> {
  const supabase = getSupabase()
  if (supabase) {
    const today = getTodayKey()
    const { data: existing } = await supabase
      .from("usage_tracking")
      .select("id, count")
      .eq("ip_address", ip)
      .eq("date", today)
      .maybeSingle()

    if (existing) {
      const { data } = await supabase
        .from("usage_tracking")
        .update({ count: existing.count + 1, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select("count")
        .single()
      return data?.count ?? existing.count + 1
    }

    const { data } = await supabase
      .from("usage_tracking")
      .insert({ ip_address: ip, date: today, count: 1 })
      .select("count")
      .single()
    return data?.count ?? 1
  }

  const store = await readFileStore()
  const today = getTodayKey()
  if (!store[today]) store[today] = {}
  store[today][ip] = (store[today][ip] ?? 0) + 1
  await writeFileStore(store)
  return store[today][ip]
}
