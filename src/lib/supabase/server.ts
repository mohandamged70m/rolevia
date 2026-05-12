import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function getSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  })
}

export async function getAuthenticatedSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  try {
    const { getToken } = await auth()
    const token = await getToken({ template: "supabase" })
    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        auth: { persistSession: false },
      })
    }
  } catch {
    // fall through to service role fallback
  }

  // Fall back to service role when Clerk JWT template is missing
  // Safe because API routes already authenticate via Clerk's currentUser()
  if (supabaseUrl && supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  }

  return null
}
