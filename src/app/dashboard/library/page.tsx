import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { isClerkConfigured } from "@/lib/clerk"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"
import { LibraryListClient } from "@/components/app/LibraryListClient"

interface LibraryEntry {
  id: string
  title: string
  created_at: string
  language: string
  content: string
}

async function getLibrary(userId: string): Promise<LibraryEntry[]> {
  try {
    const supabase = await getAuthenticatedSupabase()
    if (!supabase) return []
    const { data } = await supabase
      .from("jd_library")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export default async function LibraryPage() {
  if (!isClerkConfigured) redirect("/")

  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const items = await getLibrary(user.id)

  return <LibraryListClient items={items} />
}
