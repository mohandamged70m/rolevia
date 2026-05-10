import fs from "fs/promises"
import path from "path"

const STORE_PATH = path.join(process.cwd(), ".usage-store.json")
export const GENERATION_LIMIT = 3

interface Store {
  [date: string]: {
    [ip: string]: number
  }
}

async function readStore(): Promise<Store> {
  try {
    const data = await fs.readFile(STORE_PATH, "utf-8")
    return JSON.parse(data)
  } catch {
    return {}
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

export async function getUsage(ip: string): Promise<number> {
  const store = await readStore()
  return store[getTodayKey()]?.[ip] ?? 0
}

export async function incrementUsage(ip: string): Promise<number> {
  const store = await readStore()
  const today = getTodayKey()
  if (!store[today]) store[today] = {}
  store[today][ip] = (store[today][ip] ?? 0) + 1
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2))
  return store[today][ip]
}
