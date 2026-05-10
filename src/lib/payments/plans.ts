export interface Plan {
  id: "starter" | "pro" | "team"
  label: string
  price: number
  limit: number | "unlimited"
  description: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    label: "Starter",
    price: 12,
    limit: 50,
    description: "For small teams and occasional hiring",
    features: ["50 JDs per month", "Bilingual AR/EN", "Library storage", "Email support"],
  },
  {
    id: "pro",
    label: "Pro",
    price: 29,
    limit: "unlimited",
    description: "For growing teams with active hiring",
    features: ["Unlimited JDs", "Bilingual AR/EN", "Library storage", "Priority support", "Export to Word"],
  },
  {
    id: "team",
    label: "Team",
    price: 79,
    limit: "unlimited",
    description: "For HR teams and recruitment agencies",
    features: ["Unlimited JDs", "Bilingual AR/EN", "Library storage", "Priority support", "5 team seats", "Analytics"],
  },
]

const PLAN_LIMITS: Record<string, number | "unlimited"> = {
  free: 10,
  starter: 50,
  pro: "unlimited",
  team: "unlimited",
}

export function getPlanLimit(plan: string): number | "unlimited" {
  return PLAN_LIMITS[plan] ?? 10
}

export function isLemonConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_LEMON_CHECKOUT_URL ||
    process.env.LEMON_SQUEEZY_API_KEY
  )
}

export function getCheckoutUrl(planId: string, userId: string): string | null {
  const baseUrl = process.env.NEXT_PUBLIC_LEMON_CHECKOUT_URL
  const variantKey = `NEXT_PUBLIC_LEMON_VARIANT_${planId.toUpperCase()}`
  const variantId = process.env[variantKey]

  if (!baseUrl || !variantId) return null

  return `${baseUrl}/${variantId}?checkout[custom][clerk_user_id]=${encodeURIComponent(userId)}`
}
