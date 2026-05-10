import { getSupabase } from "./server"

export interface UserRecord {
  id: number
  clerk_user_id: string
  email: string | null
  plan: "free" | "starter" | "pro" | "team"
  plan_expires_at: string | null
  created_at: string
  updated_at: string
}

export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY
}

export async function ensureUser(clerkUserId: string, email?: string | null): Promise<UserRecord | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle()

  if (existing) {
    if (email && existing.email !== email) {
      const { data } = await supabase
        .from("users")
        .update({ email })
        .eq("clerk_user_id", clerkUserId)
        .select("*")
        .single()
      return data
    }
    return existing
  }

  const { data } = await supabase
    .from("users")
    .insert({ clerk_user_id: clerkUserId, email: email ?? null })
    .select("*")
    .single()

  return data
}

export async function getUser(clerkUserId: string): Promise<UserRecord | null> {
  if (!isSupabaseConfigured()) return null

  const supabase = getSupabase()
  if (!supabase) return null

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle()

  return data
}

export async function getUserPlan(clerkUserId: string): Promise<{ plan: string; plan_expires_at: string | null }> {
  const user = await getUser(clerkUserId)
  return {
    plan: user?.plan ?? "free",
    plan_expires_at: user?.plan_expires_at ?? null,
  }
}
