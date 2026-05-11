import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { getSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response("CLERK_WEBHOOK_SECRET not configured", { status: 500 })
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent
  try {
    evt = new Webhook(WEBHOOK_SECRET).verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch {
    return new Response("Invalid webhook signature", { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return new Response("Supabase not configured", { status: 500 })
  }

  if (evt.type === "user.created") {
    const { id, email_addresses } = evt.data
    const email = email_addresses?.[0]?.email_address ?? null

    const { error } = await supabase
      .from("users")
      .upsert({ clerk_user_id: id, email }, { onConflict: "clerk_user_id" })

    if (error) {
      console.error("Webhook user.created error:", error)
      return new Response("Failed to create user", { status: 500 })
    }
  }

  if (evt.type === "user.deleted") {
    const { id } = evt.data

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("clerk_user_id", id)

    if (error) {
      console.error("Webhook user.deleted error:", error)
      return new Response("Failed to delete user", { status: 500 })
    }
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses } = evt.data
    const email = email_addresses?.[0]?.email_address ?? null

    const { error } = await supabase
      .from("users")
      .update({ email })
      .eq("clerk_user_id", id)

    if (error) {
      console.error("Webhook user.updated error:", error)
      return new Response("Failed to update user", { status: 500 })
    }
  }

  return new Response("OK", { status: 200 })
}
