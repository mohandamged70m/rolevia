import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { getAuthenticatedSupabase } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = request.nextUrl.searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const supabase = await getAuthenticatedSupabase()

    if (supabase) {
      const { error } = await supabase
        .from("jd_library")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        console.warn("Supabase delete failed, falling back to file system:", error.message)
      } else {
        return NextResponse.json({ success: true })
      }
    }

    const { unlinkSync, existsSync } = await import("fs")
    const { join } = await import("path")
    const filePath = join(process.cwd(), ".data", "library", `${id}.json`)
    if (existsSync(filePath)) {
      unlinkSync(filePath)
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Library delete error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
